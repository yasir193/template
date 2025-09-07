import { Router } from "express";
import * as authService from "./Services/auth.service.js";
import { validateSignUp } from "../../Middlewares/auth.middleware.js";

const authController = Router();
authController.post("/signup",validateSignUp ,authService.signUp);
authController.post("/signin", authService.signIn);
authController.post("/forgot-password", authService.forgotPassword);
authController.post("/reset-password", authService.resetPassword);
authController.post("/gmail-login", authService.GmailLoginService);
authController.post("/gmail-signup", authService.GmailRegistrationService);

export default authController;
