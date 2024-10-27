import { Router } from "express";
import {
  createTheme,
  getThemes,
  getTheme,
  updateTheme,
  deleteTheme,
} from "../controllers/theme.controller.js";
import { authRequired, isAuthorized } from "../middlewares/validateToken.js";

const router = Router();

router.post("/add-theme", authRequired, isAuthorized("Admin"), createTheme);
router.get("/all", getThemes);
router.get("/:id", authRequired, isAuthorized("Admin"), getTheme);
router.put("/update/:id", authRequired, isAuthorized("Admin"), updateTheme);
router.delete("/delete/:id", authRequired, isAuthorized("Admin"), deleteTheme);
export default router;
