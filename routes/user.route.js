import express from 'express';
const router = express.Router();
import { signUp, logIn } from '../controllers/user.controller.js'

router.post('/login', logIn)
router.post('/signup', signUp)

export default router;
