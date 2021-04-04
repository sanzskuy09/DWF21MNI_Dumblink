const { user } = require("../../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Joi = require("joi");

exports.registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);

    const schema = Joi.object({
      email: Joi.string().email().min(10).max(50).required(),
      password: Joi.string().min(8).required(),
      fullName: Joi.string().min(4).required(),
    });

    const { error } = schema.validate(req.body);

    if (error)
      return res.status(400).send({
        status: "validation failed",
        message: error.details[0].message,
      });

    const checkEmail = await user.findOne({
      where: {
        email,
      },
    });

    if (checkEmail)
      return res.status(400).send({
        status: "Register Failed",
        message: "Email already registered",
      });

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = await user.create({
      ...req.body,
      password: hashedPassword,
    });

    const secretKey = "lvj3lkas82r17kj";
    const token = jwt.sign(
      {
        id: userData.id,
      },
      secretKey
    );

    res.send({
      status: "success",
      data: {
        user: {
          email: userData.email,
          fullName: userData.fullName,
          token,
        },
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "Error",
      message: "Server Error",
    });
  }
};

// Login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const schema = Joi.object({
      email: Joi.string().email().min(10).max(50).required(),
      password: Joi.string().min(8).required(),
    });

    const { error } = schema.validate(req.body);

    if (error)
      return res.status(400).send({
        status: "validation failed",
        message: error.details[0].message,
      });

    const checkEmail = await user.findOne({
      where: {
        email,
      },
    });

    if (!checkEmail)
      return res.status(400).send({
        status: "Login Failed",
        message: "Your Credentials is not Valid",
      });

    const validPassword = await bcrypt.compare(password, checkEmail.password);

    if (!validPassword)
      return res.status(400).send({
        status: "Login Failed",
        message: "Your Credentials is not Valid",
      });

    const secretKey = "lvj3lkas82r17kj";
    const token = jwt.sign(
      {
        id: checkEmail.id,
      },
      secretKey
    );

    res.send({
      status: "success",
      message: "Login Success",
      data: {
        user: {
          email: checkEmail.email,
          fullName: checkEmail.fullName,
          token,
        },
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "Error",
      message: "Server Error",
    });
  }
};

// Check Auth
exports.checkAuth = async (req, res) => {
  try {
    const userData = await user.findOne({
      where: {
        id: req.userId.id,
      },
    });

    res.send({
      status: "success",
      message: "User Valid",
      data: {
        userData,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Error",
    });
  }
};
