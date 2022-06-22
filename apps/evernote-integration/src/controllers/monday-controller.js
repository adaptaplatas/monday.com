const userTokenModelService = require('../services/model-services/usertoken-model-service');
const initMonday = require("monday-sdk-js")
const EvernoteService = require('../services/evernote-service');
const monday = initMonday();

const executeAction = async (req, res) => {
  const { userId, shortLivedToken } = req.session;
  const { itemId, columnId } = req.body.payload.inputFields;
  monday.setToken(shortLivedToken);

  try {
    const userToken = await userTokenModelService.getByUserId(userId);
    if(!userToken) {
      throw new Error("user token not found");
    }
    const token = userToken.getDataValue('token');
    const result = await monday.api(`
    query {
      items(ids:[${itemId}]) {
        name,
        column_values {
            title
            id
            value
            text
            type
          }
      }
    }`);
    /**
     * @type {Array<import('../helpers/types').MondayItem>}
     */
    const items = result.data['items'];

    const changedItem = items.length ? items[0] : undefined;
    if(!changedItem) {
      throw new Error();
    }
    const status = changedItem.column_values.find(column => column.id === columnId)?.text;

    await EvernoteService.upsertNote(status, token, changedItem.name, userId, itemId);

    return res.status(200).send();
  } catch(err) {
    console.error(err);
    return res.status(500).send({ message: 'internal server error' });
  }
};

module.exports = {
  executeAction
};
