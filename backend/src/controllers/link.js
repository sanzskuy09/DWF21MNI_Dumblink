const express = require("express");
const Joi = require("joi");
const { user, link, sublink } = require("../../models");

const urlImg = "http://localhost:5000/uploads/";

// get My links
exports.getMyLink = async (req, res) => {
  try {
    const links = await link.findAll({
      where: {
        userId: req.userId.id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "userId"],
      },
      include: {
        model: sublink,
        as: "links",
        attributes: {
          exclude: ["createdAt", "updatedAt", "linkId"],
        },
      },
    });
    // console.log(linkFromDatabase);

    // const linkString = JSON.stringify(linkFromDatabase);
    // const linkObject = JSON.parse(linkString);

    // const linkmaster = linkObject.map((link) => link);
    // console.log(linkmaster);

    // const links = linkObject[0].links.map((link) => ({
    //   ...link,
    //   image: urlImg + link.image,
    // }));

    res.send({
      status: "success",
      message: "Success get links",
      data: {
        links,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Server Error",
    });
  }
};

// get link
exports.getlinks = async (req, res) => {
  try {
    const { uniqueLink } = req.params;
    console.log(uniqueLink);

    const linkFromDatabase = await link.findOne({
      where: {
        uniqueLink,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "userId"],
      },
      include: {
        model: sublink,
        as: "links",
        attributes: {
          exclude: ["createdAt", "updatedAt", "linkId"],
        },
      },
    });

    const linkString = JSON.stringify(linkFromDatabase);
    const linkObject = JSON.parse(linkString);

    const links = linkObject.links.map((link) => ({
      ...link,
      image: urlImg + link.image,
    }));

    res.send({
      status: "success",
      message: "Success get link",
      data: {
        link: {
          id: linkFromDatabase.id,
          title: linkFromDatabase.title,
          description: linkFromDatabase.description,
          uniqueLink: linkFromDatabase.uniqueLink,
          viewCount: linkFromDatabase.viewCount,
          links: links,
        },
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Server Error",
    });
  }
};

// add Link
exports.addLink = async (req, res) => {
  try {
    const { body } = req;

    const schema = Joi.object({
      title: Joi.string().min(5).max(50).required(),
      description: Joi.string().min(5).max(255).required(),
      links: Joi.array().required(),
    });

    const { error } = schema.validate(req.body);

    if (error)
      return res.status(400).send({
        status: "validation failed",
        message: error.details[0].message,
      });

    const uniqueLink = () => {
      return Math.random().toString(36).substr(2, 7);
    };
    console.log(uniqueLink());

    if (body.links.length < 2)
      return res.status(400).send({
        status: "Falied",
        message: "You must enter at least 2 links",
      });

    const { id: linkId } = await link.create({
      ...body,
      viewCount: 0,
      uniqueLink: uniqueLink(),
      userId: req.userId.id,
    });

    await sublink.bulkCreate(
      body.links.map((link) => ({
        linkId,
        title: link.title,
        url: link.url,
        image: urlImg + link.image,
      }))
    );

    const links = await link.findOne({
      where: {
        id: linkId,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "userId", "viewCount"],
      },
      include: {
        model: sublink,
        as: "links",
        attributes: {
          exclude: ["createdAt", "updatedAt", "linkId"],
        },
      },
    });

    res.send({
      status: "success",
      message: "Success add link",
      data: {
        links,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Server Error",
    });
  }
};

// Delete Link
exports.deleteLink = async (req, res) => {
  try {
    const { id } = req.params;

    const checkId = await link.findOne({
      where: {
        id,
      },
    });

    if (!checkId || checkId.userId !== req.userId.id)
      return res.status(400).send({
        status: "error",
        message: "You not allowed to delete this user",
      });

    await link.destroy({
      where: {
        id,
      },
    });

    res.send({
      status: "success",
      message: "Success delete link",
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
