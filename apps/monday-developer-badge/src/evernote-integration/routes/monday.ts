import {Router} from 'express';
import * as transformationController from '../controllers/monday-controller';
import Authentication from "../middlewares/authentication";
const router = Router();

router.post('/evernote_action', Authentication.authenticationMiddleware, transformationController.executeAction);

export default router;
