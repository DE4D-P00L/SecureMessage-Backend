import express from 'express';
import { verifyToken } from '../middlewares/Jwt.js';
import Chat from '../models/chat.model.js'
import { sendMessage, getMessages } from '../controllers/chat.controller.js'

//create a router
const router = express.Router();

//configure routes and controllers
router.get('/', getMessages);
router.post('/',verifyToken, sendMessage);

export default router;
