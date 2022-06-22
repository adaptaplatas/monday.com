const { Note } = require('../../db/models');
const GenericModelService = require('./generic-model-service');

class NoteModelService extends GenericModelService {
  // @ts-ignore
  constructor() {super(Note);}

  /**
   * @param {string} userId
   * @return {Promise<Array<Note>>}
   */
  async getNotesByUserId(userId) {
    return this.withCatch(this._model.findAll({ where: { userTokenId: userId } }));
  }

  /**
   * @param {number} itemId
   * @return {Promise<Note | undefined>}
   */
  async getNoteByItemId(itemId) {
    return this.withCatch(this._model.findByPk(itemId));
  }
}

module.exports = new NoteModelService();
