const { cache, cacheKeys } = require('../services/cache-service');
const evernote = require('evernote');

const getToken = async (oauth_token, oauth_verifier) => {
  const evernoteClient = getEvernoteConsumerClient();
  const oauthSecret = cache.get(cacheKeys.OAUTH_SECRET);
  return new Promise((resolve, reject) => {
    evernoteClient.getAccessToken(
      oauth_token,
      oauthSecret,
      oauth_verifier,
      function(error, oauthToken, oauthTokenSecret, results) {
        if(error) {
          reject(error);
        } else {
          resolve(oauthToken);
        }
      });
  });
};

const getRedirectUri = (userId, backToUrl) => {
  return `${ cache.get(cacheKeys.SERVER_URL) }/auth/callback/${ userId }?backToUrl=${ backToUrl }`;
};

const getEvernoteConsumerClient = () => new evernote.Client({
  consumerKey: process.env.EVERNOTE_FULL_CONSUMER_KEY,
  consumerSecret: process.env.EVERNOTE_FULL_CONSUMER_SECRET,
  sandbox: true // change to false when you are ready to switch to production
});

module.exports = {
  getRedirectUri,
  getToken,
  getEvernoteConsumerClient
};
