import jwt from "jsonwebtoken";
import express from "express";
import evernote from "evernote";

const evernoteClient = new evernote.Client({
  consumerKey: process.env.EVERNOTE_CONSUMER_KEY,
  consumerSecret: process.env.EVERNOTE_CONSUMER_SECRET,
  sandbox: true // change to false when you are ready to switch to production
});

class Authentication {
  private _evernoteToken: string | undefined;

  public get evernoteToken() {
    return this._evernoteToken;
  }

  async authenticationMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
      const authorization = req.headers.authorization ?? req.query?.token;

      if (typeof authorization !== "string") {
        res.status(401).json({ error: "not authenticated, no credentials in request" });
        return;
      }

      if (typeof process.env.MONDAY_SIGNING_SECRET !== "string") {
        res.status(500).json({ error: "Missing MONDAY_SIGNING_SECRET (should be in .env file)" });
        return;
      }

      const { accountId, userId, backToUrl, shortLivedToken } = jwt.verify(
        authorization,
        process.env.MONDAY_SIGNING_SECRET
      ) as any;

      req.session = { accountId, userId, backToUrl, shortLivedToken };

      next();
    } catch (err) {
      console.log("error in auth:", err);
      res.status(401).json({ error: "authentication error, could not verify credentials" });
    }
  }

  evernoteAuthMiddleware = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const callbackUrl = "https://integration.loca.lt:49000/oauth_callback";

    evernoteClient.getRequestToken(callbackUrl, (error, oauthToken, oauthTokenSecret) => {
      if (error) {
        // do your error handling here
      }
      // store your token here somewhere - for this example we use req.session
      req.session.oauthToken = oauthToken;
      req.session.oauthTokenSecret = oauthTokenSecret;
      res.redirect(evernoteClient.getAuthorizeUrl(oauthToken)); // send the user to Evernote
    });
  };

  evernoteAuthenticatedCallback = async (req: express.Request) => {
    if (!req.session.oauthToken) {
      throw new Error("evernote oathToken missing");
    }
    if (!req.session.oauthTokenSecret) {
      throw new Error("evernote oauthTokenSecret missing");
    }
    console.log("evernote request:", req.session);

    evernoteClient.getAccessToken(
      req.session.oauthToken,
      req.session.oauthTokenSecret,
      req.query.oauth_verifier as string,
      (error, oauthToken) => {
        if (error) {
          // do your error handling
          console.log("getAccessToken error:", error);
        } else {
          this._evernoteToken = oauthToken;
        }
      }
    );
  };
}

export default new Authentication();
