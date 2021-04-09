"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class link extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      link.belongsTo(models.user, {
        as: "user",
        foreignKey: {
          name: "userId",
        },
      });
      link.hasMany(models.sublink, {
        as: "links",
      });
    }
  }
  link.init(
    {
      title: DataTypes.STRING,
      description: DataTypes.STRING,
      image: DataTypes.STRING,
      template: DataTypes.STRING,
      uniqueLink: DataTypes.STRING,
      viewCount: DataTypes.STRING,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "link",
    }
  );
  return link;
};
