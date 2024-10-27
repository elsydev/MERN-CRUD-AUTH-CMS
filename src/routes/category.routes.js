import { Router } from "express";
import {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  getCategoryForTheme,
} from "../controllers/category.controller.js";
import { authRequired, isAuthorized } from "../middlewares/validateToken.js";

const router = Router();

router.post(
  "/add-category",
  authRequired,
  isAuthorized("Admin"),
  createCategory
);
router.get("/all", getCategories);
router.get("/:id", getCategory);
router.post("/catfortheme", getCategoryForTheme);
router.put("/update/:id", authRequired, isAuthorized("Admin"), updateCategory);
router.delete(
  "/delete/:id",
  authRequired,
  isAuthorized("Admin"),
  deleteCategory
);
export default router;
