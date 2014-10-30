"use strict";
module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable("Photos", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      background: {
        type: DataTypes.STRING
      },
      animal: {
        type: DataTypes.STRING
      },
      itemone: {
        type: DataTypes.STRING
      },
      itemtwo: {
        type: DataTypes.STRING
      },
      img: {
        type: DataTypes.STRING
      },
      UserId: {
        type: DataTypes.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    }).done(done);
  },
  down: function(migration, DataTypes, done) {
    migration.dropTable("Photos").done(done);
  }
};