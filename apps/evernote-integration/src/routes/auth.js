const router = require('express').Router();
const { authenticationMiddleware } = require('../middlewares/authentication');
const authController = require('../controllers/auth-controller');

router.get('/auth', authenticationMiddleware, authController.evernoteAuth);
router.get('/auth/callback/:userId', authController.evernoteAuthenticatedCallback);

module.exports = router;
