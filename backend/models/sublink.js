"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class sublink extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      sublink.belongsTo(models.link, {
        as: "link",
        foreignKey: {
          name: "linkId",
        },
      });
    }
  }
  sublink.init(
    {
      title: DataTypes.STRING,
      url: DataTypes.STRING,
      image: DataTypes.STRING,
      linkId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "sublink",
    }
  );
  return sublink;
};
