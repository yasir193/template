import { Router } from "express";
import * as uploadFiles from "./Services/uploadFiles.service.js";
import { validateJson } from "../../Middlewares/validation.middleware.js";
import { authenticate } from "./../../Middlewares/auth.middleware.js";
import { errorHandler } from './../../Middlewares/error-handler.middleware.js';

const uploadController = Router();

uploadController.post("/", authenticate, validateJson, errorHandler(uploadFiles.uploadFile));
uploadController.put(
  "/files/:fileId",
  authenticate,
  validateJson,
  errorHandler(uploadFiles.updateFile
));
uploadController.get("/", errorHandler(uploadFiles.getAllContracts));
uploadController.delete("/:id", errorHandler(uploadFiles.deleteFile));
export default uploadController;
