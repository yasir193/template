import { Router } from "express";
import * as adminService from "./Services/admin.service.js";
import { verifyAdminToken } from "./../../Middlewares/auth-admin.middleware.js";
// import { errorHandler } from "./../../Middlewares/error-handler.middleware.js";

const adminController = Router();

adminController.post(
  "/",
  verifyAdminToken,
  adminService.addAdmin)
;
adminController.get(
  "/pending",
  adminService.getPendingPlanRequests)
;
adminController.patch(
  "/approve/:requestId",
  adminService.approvePlanRequest)
;
adminController.patch(
  "/reject/:requestId",
  adminService.rejectPlanRequest)
;
adminController.delete(
  "/:targetId",
  verifyAdminToken,
  adminService.deleteAdmin)
;
adminController.get(
  "/",
  verifyAdminToken,
  adminService.getAllAdmins)
;
adminController.get(
  "/dashboard-stats",
  adminService.dashboardStats)
;
export default adminController;
