const { Model } = require('sequelize');

class UserToken extends Model {
  /**
   * @param db {import('../../helpers/types').DataBase}
   */
  static associate(db) {
    // @ts-ignore
    db.UserToken.hasMany(db.Note, {as: "notes"})
  }
}

module.exports = (sequelize, DataTypes) => {
  UserToken.init(
    {
      userId: DataTypes.STRING,
      token: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'UserToken',
      tableName: 'USER_TOKEN'
    }
  );
  return UserToken;
};
