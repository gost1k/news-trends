import { Router } from 'express';
import * as trendsController from '../controllers/trendsController.js';

const router = Router();

router.get('/', trendsController.getList);

export default router;
