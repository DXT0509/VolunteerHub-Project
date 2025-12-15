import { Router } from "express";
import { register, login, me, getUserByEmailAndPhone } from "./auth.controller";
import { authenticate } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticate, me);
router.post("/get-user-by-email-phone", getUserByEmailAndPhone);
export default router;
