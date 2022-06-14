import jwt from "jsonwebtoken";
import express from "express";

export default async function authenticationMiddleware(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const authorization = req.headers.authorization ?? req.query?.token;

    if (typeof authorization !== "string") {
      res
        .status(401)
        .json({ error: "not authenticated, no credentials in request" });
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
    res
      .status(401)
      .json({ error: "authentication error, could not verify credentials" });
  }
}
