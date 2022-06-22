const { Model } = require('sequelize');
const { UserToken } = require('../../db/models');

const GenericModelService = require('./generic-model-service');

class UserTokenModelService extends GenericModelService {
  // @ts-ignore
  constructor() {super(UserToken);}

  /**
   * @param {number} userId
   * @return {Promise<Model | null>}
   */
  async getByUserId(userId) {
    return this.withCatch(this._model.findOne({ where: { userId } }));
  }
}

module.exports = new UserTokenModelService();
