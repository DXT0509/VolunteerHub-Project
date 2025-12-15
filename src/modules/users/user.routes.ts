import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";
import { getMe, updateMe, changePassword, resetPassword } from "./user.controller";

const router = Router();

//User
router.get("/me", authenticate, getMe);
router.put("/me", authenticate, updateMe);
router.put("/change-password", authenticate, changePassword);
router.post("/reset-password", resetPassword);
export default router;
