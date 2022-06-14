import {Router} from 'express';
import * as transformationController from '../controllers/monday-controller';
import authenticationMiddleware from '../middlewares/authentication';
const router = Router();

router.post('/evernote_action', authenticationMiddleware, transformationController.executeAction);
router.post('/get_remote_list_options', authenticationMiddleware, transformationController.getRemoteListOptions);

export default router;
