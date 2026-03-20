import { Router } from 'express';
import * as trendsController from '../controllers/trendsController.js';

const router = Router();

router.get('/list', trendsController.getList)
router.get('/list/:limit', trendsController.getListByCount)

export default router;
