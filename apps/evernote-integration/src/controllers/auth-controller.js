// const authService = require('../services/auth-service');
const connectionModelService = require('../services/model-services/connection-model-service');
const { cache, cacheKeys } = require("../services/cache-service")
const authService = require('../services/auth-service');

const evernoteAuth = async (req, res, next) => {
  const { userId, backToUrl } = req.session;
  const evernoteClient = authService.getEvernoteConsumerClient();

  evernoteClient.getRequestToken(authService.getRedirectUri(userId, backToUrl), (error, oauthToken, oauthTokenSecret) => {
    cache.set(cacheKeys.OAUTH_SECRET, oauthTokenSecret);
    if(error) {
      console.log(error)
    }
    res.redirect(evernoteClient.getAuthorizeUrl(oauthToken)); // send the user to Evernote
  });
};

const evernoteAuthenticatedCallback = async (req, res) => {
  const { userId } = req.params;
  const { oauth_token, oauth_verifier, backToUrl } = req.query;
  try {
    const token = await authService.getToken(oauth_token, oauth_verifier);

    await connectionModelService.createConnection(userId, token);

    return res.redirect(backToUrl);
  } catch(err) {
    console.error(err);
    return res.status(500).send({ message: 'internal server error' });
  }
};

module.exports = {
  evernoteAuth,
  evernoteAuthenticatedCallback
}
