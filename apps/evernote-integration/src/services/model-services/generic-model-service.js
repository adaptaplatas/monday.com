const { ModelDefined } = require('sequelize');

/**
 * @template {ModelDefined<T, T>} T
 */
class GenericModelService {
  /** @type {T} **/
  _model;
  /**
   * @param {ModelDefined<T,T>} useModel
   */
  constructor(useModel) {
    // @ts-ignore
    this._model = useModel;
  }

  /**
   *
   * @param {object} params object with the creation parameters
   * @return {Promise<void>} promise with the created object
   */
  async create(params) {
    await this.withCatch(this._model.create(params))
  }

  async upsert(model) {
    await this.withCatch(this._model.upsert(model));
  }

  /**
   * Deletes an item from the database by its id.
   * @param id The id of the item.
   * @return {Promise<void>} The model if it was deleted or null otherwise
   */
  async delete(id) {
      const item = await this._model.findByPk(id);
      if(!item) {
        throw new Error(`${this._model.name} with id ${id} not found`)
      }
      await this.withCatch(item.destroy());
  }

  /**
   * @protected
   * @param {Promise<any>} promise
   */
  async withCatch(promise) {
    return promise.catch(console.error)
  }

}

module.exports = GenericModelService;
