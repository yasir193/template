import { Router } from "express";
import * as authService from "./Services/auth.service.js";
import { validateSignUp } from "../../Middlewares/auth.middleware.js";
import { errorHandler } from './../../Middlewares/error-handler.middleware.js';

const authController = Router();
authController.post("/signup",validateSignUp ,errorHandler(authService.signUp));
authController.post("/signin", errorHandler(authService.signIn));
authController.post("/forgot-password", errorHandler(authService.forgotPassword));
authController.post("/reset-password", errorHandler(authService.resetPassword));
authController.post("/gmail-login", errorHandler(authService.GmailLoginService));
authController.post("/gmail-signup", errorHandler(authService.GmailRegistrationService));

export default authController;
