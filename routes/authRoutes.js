import express from 'express';
import {
    signup_get,
    login_get,
    signup_post,
    login_post
} from '../controllers/authControllers.js';

const router = express.Router();

router.get('/signup', signup_get);
router.get('/login', login_get);
router.post('/signup', signup_post);
router.post('/login', login_post);

export default router;