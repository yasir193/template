import { Router } from "express";
import * as chatService from "./Services/chat.service.js";
import { authenticate } from './../../Middlewares/auth.middleware.js';

const chatController = Router();

chatController.post("/user" ,authenticate,chatService.sendUserMessage);
chatController.post("/ai",authenticate ,chatService.sendAIResponse);
chatController.get("/", authenticate ,chatService.getChatHistory);

export default chatController;
