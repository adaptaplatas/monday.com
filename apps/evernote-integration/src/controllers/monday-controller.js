const connectionModelService = require('../services/model-services/connection-model-service');
const evernote = require('evernote');
const initMonday = require("monday-sdk-js")
const monday = initMonday();

const executeAction = async (req, res) => {
  const { userId, shortLivedToken } = req.session;
  const { itemId, columnId } = req.body.payload.inputFields;
  monday.setToken(shortLivedToken);

  try {
    const userToken = await connectionModelService.getConnectionByUserId(userId);
    const token = userToken.getDataValue('token');
    let noteStore = new evernote.Client({
      token,
      sandbox: true
    }).getNoteStore();
    const items = await monday.api(`
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

    const changedItem = items.data.items.length ? items.data.items[0] : undefined;
    if(!changedItem) {
      throw new Error();
    }

    const existingNote = noteStore.getNote()

    const content = `
    <?xml version="1.0" encoding="UTF-8"?>
    <!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd">
    <en-note>The status changed to ${changedItem.column_values.find(column => column.id === columnId).text}!</en-note>`
      .trim().replaceAll(/[\r\n]+/g,'');

    const savedNote = noteStore.createNote({ content, title: changedItem.name })
             .catch(error => {
               console.log(error);
             });

    return res.status(200).send();
  } catch(err) {
    console.error(err);
    return res.status(500).send({ message: 'internal server error' });
  }
};

module.exports = {
  executeAction
};
