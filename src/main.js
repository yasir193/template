import express from "express";
import { config } from "dotenv";
import { database_connection } from "./DB/connection.js";
config();
import userController from "./Modules/User/user.controller.js";
import authController from "./Modules/Auth/auth.controller.js";
import planController from "./Modules/Plan/plan.controller.js";
import adminController from "./Modules/Admin/admin.controller.js";
import uploadController from "./Modules/UploadFiles/uploadFiles.controller.js";
import cors from "cors";
import authAdminController from "./Modules/AuthAdmin/auth-admin.controller.js";
import templateController from "./Modules/Templates/template.controller.js";
import chatController from "./Modules/Chat/chat.controller.js";
import "./utils/mailService.js";
import { globalErrorHandler } from "./Middlewares/error-handler.middleware.js";
import profileController from './Modules/Profile/profile.controller.js';






export const bootstrap = () => {
  const app = express();
  app.use(express.json());

  app.use(cors());
  app.use(
    cors({
      origin: "*",
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      credentials: true,
    })
  );

  // Routes
  app.use("/auth", authController);
  app.use("/template", templateController);
  app.use("/chat", chatController);
  app.use("/user", userController);
  app.use("/profile", profileController);
  app.use("/admin", adminController);
  app.use("/auth-admin", authAdminController);
  app.use("/plan", planController);
  app.use("/upload", uploadController);
  app.use(globalErrorHandler)
  // Connect DB and start server
  database_connection();
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
};
