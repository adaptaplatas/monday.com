const { Sequelize, Model } = require("sequelize");

/**
 * @typedef {Object} DataBase
 * @property {Sequelize} sequelize
 * @property {Model} UserToken
 * @property {Model} Note
 **/


/**
 * @typedef {Object} MondayItem
 * @property {string} name
 * @property {Array} column_values
 * @property {string} [column_values.title]
 * @property {string} [column_values.id]
 * @property {string} [column_values.value]
 * @property {string} [column_values.text]
 * @property {string} [column_values.type]
 */

