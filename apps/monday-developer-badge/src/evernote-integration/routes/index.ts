import express from 'express';
import mondayRoutes from './monday';
import Authentication from "../middlewares/authentication";
const router = express.Router();

router.use(mondayRoutes);

router.post('evernote/auth', Authentication.evernoteAuthMiddleware)
router.post('evernote/oauth_callback', Authentication.evernoteAuthenticatedCallback)

export default router;
