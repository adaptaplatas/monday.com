const router = require('express').Router();
const { authenticationMiddleware } = require('../middlewares/authentication');
const mondayController = require('../controllers/monday-controller');

router.post('/evernote/new_item', authenticationMiddleware, mondayController.executeAction);

module.exports = router;
