const noteModelService = require('../services/model-services/note-model-service');
const { NoteStore, Client, NoteStoreClient, Types } = require('evernote');
const { Note } = require('../db/models');

class EvernoteService {
  /**
   * @param {string} content
   * @param {string} token
   * @param {string} title
   * @param {string} userId
   * @param {number} itemId
   * @param {boolean} allowDuplicates whether to create the note even if it already exists
   * @return {Promise<void>}
   */
  static async upsertNote(content, token, title, userId, itemId, allowDuplicates = false) {
    const noteStore = this.getNoteStore(token);
    const existingLocalNote = await noteModelService.getNoteByItemId(itemId);

    const updatedNote = await this.updateEvernote(noteStore, existingLocalNote, content, title) ||
      await this.createEvernote(noteStore, content, title, userId, itemId);

    await noteModelService.upsert({ itemId , guid: updatedNote.guid, userTokenId: userId});
  }

  /**
   * @private
   * @param {NoteStoreClient} noteStore
   * @param {string} content
   * @param {string} title
   * @param {string} userId
   * @param {number} itemId
   * @return {Promise<Types.Note>}
   */
  static async createEvernote(noteStore, content, title, userId, itemId) {
    return await noteStore.createNote({ content: this.buildNoteContent(content), title });
  }

  /**
   * @private
   * @param {NoteStoreClient} noteStore
   * @param {Note | undefined} existingLocalNote
   * @param {string} status
   * @param {string} title
   * @return {Promise<Types.Note | undefined>}
   */
  static async updateEvernote(noteStore, existingLocalNote, status, title) {
    if(existingLocalNote) {
      // Check against evernote - it could have been deleted there.
      const existingNote = await noteStore.getNoteWithResultSpec(existingLocalNote.getDataValue('guid'), new NoteStore.NoteResultSpec({ includeContent: true }))
        .catch(error => {
          //Further control, probably note was deleted from Evernote
          console.log("Note not found: error");
          return undefined;
        });
      if(existingNote && existingNote.active) {
        /** @type {Types.Note} **/
        const noteArgs = { guid: existingNote.guid, title: existingNote.title, content: this.buildNoteContent(status) };
        return await noteStore.updateNote(new Types.Note(noteArgs));
      } else {
        return undefined;
      }
    }
  }

  /**
   * @private
   * @param content the content to show
   * @return {string}
   */
  static buildNoteContent(content) {
    return `
    <?xml version="1.0" encoding="UTF-8"?><!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd">
    <en-note>The status changed to ${ content }!</en-note>`
      .trim().replaceAll(/[\r\n]+/g, '');
  }

  /**
   * @private
   * @return {NoteStoreClient} noteStore
   */
  static getNoteStore(token) {
    return new Client({
      token,
      sandbox: true
    }).getNoteStore();
  }
}

module.exports = EvernoteService;
