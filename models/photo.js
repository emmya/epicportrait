"use strict";

module.exports = function(sequelize, DataTypes) {
  var Photo = sequelize.define("Photo", {
    background: DataTypes.STRING,
    animal: DataTypes.STRING,
    itemone: DataTypes.STRING,
    itemtwo: DataTypes.STRING,
    img: DataTypes.STRING,
    UserId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        Photo.belongsTo(models.User);
      }
    }
  });

  return Photo;
};
