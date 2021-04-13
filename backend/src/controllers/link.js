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

    const links = await link.findOne({
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

    res.send({
      status: "success",
      message: "Success get link",
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

// add Link
exports.addLink = async (req, res) => {
  try {
    const { body } = req;
    console.log(body);

    const { title, description, links } = req.body;

    const schema = Joi.object({
      title: Joi.string().min(5).max(50).required(),
      description: Joi.string().min(5).max(255).required(),
    });

    const { error } = schema.validate({ title, description });

    if (error)
      return res.status(400).send({
        status: "validation failed",
        message: error.details[0].message,
      });

    const uniqueLink = () => {
      return Math.random().toString(36).substr(2, 7);
    };

    if (body.links.length < 2)
      return res.status(400).send({
        status: "Falied",
        message: "You must enter at least 2 links",
      });

    const { id: linkId } = await link.create({
      ...body,
      image: urlImg + req.files.imageFile[0].filename,
      viewCount: 0,
      uniqueLink: uniqueLink(),
      userId: req.userId.id,
    });

    const linkToJSON = JSON.parse(links);
    // console.log("ini lonk", linkToJSON);
    // const linkToparse = JSON.parse(linkToJSON);
    // console.log("ini lparse", linkToparse);

    // const sublinks = linkToparse.map((link, index) => ({
    //   ...link,
    //   title: link.title,
    //   url: link.url,
    //   linkId,
    // }));
    // console.log("ini sublink", sublinks);

    // const allLinks = await sublink.bulkCreate(sublinks);
    // console.log("in link", linkToJSON);

    await sublink.bulkCreate(
      linkToJSON.map((link, index) => ({
        ...link,
        linkId,
      }))
    );

    // console.log(linkToJSON);
    const newLinks = await link.findOne({
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
        links: newLinks,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Server Error",
    });
  }
};

// upload image sublink
exports.uploadImageSublinks = async (req, res) => {
  try {
    const image = urlImg + req.files.imageLink[0].filename;

    console.log(image);
    res.send({
      status: "success",
      message: "Success upload file",
      data: {
        image,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Server Error",
    });
  }
};

// edit link
exports.editLink = async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req;
    const { title, description, links, image } = req.body;
    // console.log("ini links", links);
    console.log("ini image", body);

    const checkLink = await link.findOne({
      where: { id },
    });

    if (!checkLink)
      return res.status(404).send({
        status: "Failed",
        message: "Link not found",
      });

    if (checkLink.userId !== req.userId.id)
      return res.send({
        status: "Failed",
        message: `You not allowed updated this user`,
      });

    // const image = urlImg + req.files.imageFile[0].filename;

    // console.log("ini req file", req.files);

    await link.update(
      {
        title,
        description,
        image: urlImg + req.files.imageFile[0].filename,
      },
      {
        where: {
          id,
        },
      }
    );

    const linkToJSON = JSON.parse(links);

    linkToJSON.map(async (link, index) => {
      if (link.id != 0) {
        await sublink.update(
          {
            title: link.title,
            url: link.url,
            image: link.image,
          },
          {
            where: {
              id: link.id,
            },
          }
        );
      } else {
        await sublink.create({
          ...link,
          linkId: req.userId.id,
        });
      }
    });

    const result = await link.findOne({
      where: {
        id,
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
      message: "Success edit link",
      data: {
        result,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Server Error",
    });
  }
};

// update Count link
exports.updateCount = async (req, res) => {
  try {
    const { uniqueLink } = req.params;
    const { body } = req;
    console.log(uniqueLink);

    await link.update(body, {
      where: {
        uniqueLink,
      },
    });

    const links = await link.findOne({
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

    res.send({
      status: "success",
      message: "Success Update Count",
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

// add Link (optional)
exports.addLinkNoMulter = async (req, res) => {
  try {
    const { body } = req;
    // const fileName = req.files.imageFile.map((e) => e.filename);
    const { template, title, description, links } = req.body;
    console.log(body);

    const schema = Joi.object({
      title: Joi.string().min(5).max(50).required(),
      description: Joi.string().min(5).max(255).required(),
      links: Joi.array().items(
        Joi.object({
          title: Joi.string().required(),
          url: Joi.string().required(),
          image: Joi.any(),
        })
      ),
    });

    const { error } = schema.validate({ title, description, links });

    if (error)
      return res.status(400).send({
        status: "validation failed",
        message: error.details[0].message,
      });

    const uniqueLink = () => {
      return Math.random().toString(36).substr(2, 7);
    };

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
      body.links.map((link, index) => ({
        ...link,
        linkId,
        title: link.title,
        url: link.url,
        // image: urlImg + fileName[index],
      }))
    );

    const newLinks = await link.findOne({
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
        links: newLinks,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Server Error",
    });
  }
};
