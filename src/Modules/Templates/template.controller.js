import { Router } from "express";
import * as templateService from "./Services/template.service.js";
// import { errorHandler } from './../../Middlewares/error-handler.middleware.js';

const templateController = Router();

templateController.post("/" , templateService.addTemplate);
templateController.get("/:id", templateService.getSpecificTemplate);
templateController.get("/", templateService.getAllTemplates);

export default templateController;
