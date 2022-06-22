'use strict';
const { Model, DataTypes } = require('sequelize');

/**
 * The id for this table is the itemId
 */
class Note extends Model {
  /**
   * @param {import('../../helpers/types').DataBase} db
   */
  static associate(db) {
    // @ts-ignore
    db.Note.belongsTo(db.UserToken, {
      foreignKey: "userTokenId",
      as: "userToken",
    })
  }
}

module.exports = (sequelize) => {
  Note.init(
    {
      itemId: {
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      guid: DataTypes.STRING,
      userTokenId: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: 'Note',
      tableName: 'NOTE'
    }
  );
  return Note;
};
