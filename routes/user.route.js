import express from 'express';
const router = express.Router();
import { signUp, logIn, forgotPassword, resetPassword } from '../controllers/user.controller.js'

router.post('/login', logIn)
router.post('/signup', signUp)
router.post('/forgot-password',forgotPassword)
router.post('/reset-password/:token',resetPassword)

export default router;
