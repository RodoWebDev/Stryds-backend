'use strict';

import express from 'express';
import { getAllUsers, login, signin, updateUser } from '../../controllers/auth';
import { asyncMiddleware, authenticateJWT } from '../../libs/utils';

const router = express.Router();

router.get('/all', authenticateJWT, asyncMiddleware(getAllUsers));
router.post('/login', asyncMiddleware(login));
router.put('/signin', asyncMiddleware(signin));
router.post('/update', authenticateJWT, asyncMiddleware(updateUser));

export default router;
