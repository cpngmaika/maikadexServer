import express from 'express';
import {
    signup_post,
    login_post,
    checkUser_get,
    logout_get,
    changePassword_put
} from '../controllers/authControllers.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/signup', signup_post);
router.post('/login', login_post);
router.get('/me', requireAuth, checkUser_get);
router.get('/logout', logout_get);
router.put('/change-password', requireAuth, changePassword_put);

export default router;