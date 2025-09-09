import { Router } from "express";
import * as planService from "./Services/plan.service.js";
// import { errorHandler } from './../../Middlewares/error-handler.middleware.js';

const planController = Router();

planController.post("/", planService.addSubscription);
planController.delete("/:id", planService.deleteSubscription);
planController.put("/:id", planService.updateSubscription);
planController.get("/", planService.getAllPlans);  

export default planController;
