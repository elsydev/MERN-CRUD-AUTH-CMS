import { Router } from "express";
import {
  login,
  logout,
  profile,
  register,
  verifyToken,
  confirmar,
  requirePassword,
  validateToken,
  updatePasswordWithToken,
} from "../controllers/auth.controller.js";
import { authRequired, isAuthorized } from "../middlewares/validateToken.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { registerSchema, loginSchema } from "../schemas/auth.schema.js";
const router = Router();

router.post("/login", validateSchema(loginSchema), login);
router.post("/forgot-password", requirePassword);
router.post("/validate-token", validateToken);
router.post("/update-password/:token", updatePasswordWithToken);

router.post("/confirm-account", confirmar);
router.post("/register", validateSchema(registerSchema), register);
router.post("/logout", authRequired, logout);
router.get("/verify", verifyToken);
router.get("/profile", authRequired, isAuthorized("Admin"), profile);
export default router;
