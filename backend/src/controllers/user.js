const express = require("express");
const Joi = require("joi");
const { user, Product } = require("../../models");

// Get All users
exports.getUser = async (req, res) => {
  try {
    const users = await user.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
    });

    res.send({
      status: "success",
      data: {
        users,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Server Error",
    });
  }
};

//  Get Detail user
exports.getDetailUser = async (req, res) => {
  try {
    const { id } = req.params;
    const users = await user.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
    });

    res.send({
      status: "success",
      data: {
        users,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Server Error",
    });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req;

    const schema = Joi.object({
      fullName: Joi.string().min(4),
      email: Joi.string(),
    });

    const { error } = schema.validate(req.body);

    if (error)
      return res.status(400).send({
        status: "validation failed",
        message: error.details[0].message,
      });

    const checkId = await user.findOne({
      where: {
        id,
      },
    });

    if (!checkId)
      return res.send({
        status: "Fail",
        message: `User with id ${id} not found`,
      });

    if (checkId.id !== req.userId.id)
      return res.send({
        status: "Fail",
        message: `You not allowed updated this user`,
      });

    if (checkId.id == req.userId.id) {
      await user.update(body, {
        where: {
          id: checkId.id,
        },
      });
    }

    const userData = await user.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
    });

    res.send({
      status: "success",
      message: "User successfully updated",
      data: {
        userData,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Server Error",
    });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const checkId = await user.findOne({
      where: {
        id,
      },
    });

    if (!checkId || checkId.id !== req.userId.id)
      return res.status(400).send({
        status: "error",
        message: "You not allowed to delete this user",
      });

    await user.destroy({
      where: {
        id: checkId.id,
      },
    });

    res.send({
      status: "success",
      message: "User successfully removed",
      data: {
        id,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Server Error",
    });
  }
};
