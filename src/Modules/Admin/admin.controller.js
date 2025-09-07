import { Router } from "express";
import * as adminService from "./Services/admin.service.js";
import { validateUser } from "../../Middlewares/addUser.middleware.js";
import { verifyAdminToken } from './../../Middlewares/auth-admin.middleware.js';

const adminController = Router();

adminController.post("/", verifyAdminToken ,adminService.addAdmin);
// userController.patch("/:id", userService.updateUser);
// userController.get("/:id/plan", userService.getUserPlan);
adminController.get("/pending"  , adminService.getPendingPlanRequests)
adminController.patch("/approve/:requestId"  , adminService.approvePlanRequest)
adminController.patch("/reject/:requestId"  , adminService.rejectPlanRequest)
adminController.delete("/:targetId", verifyAdminToken, adminService.deleteAdmin);
adminController.get("/",verifyAdminToken , adminService.getAllAdmins);
adminController.get("/dashboard-stats", adminService.dashboardStats);
export default adminController;
