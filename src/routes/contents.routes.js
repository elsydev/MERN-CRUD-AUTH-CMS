import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import {
  getContent,
  getContents,
  deleteContent,
  updateContent,
  createContent,
} from "../controllers/contents.controller.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { createTaskSchema } from "../schemas/content.schema.js";

const router = Router();

router.get("/", authRequired, getContents);
router.get("/:id", authRequired, getContent);
router.post(
  "/add-content",
  authRequired,
  validateSchema(createTaskSchema),
  createContent
);
router.delete("/delete/:id", authRequired, deleteContent);
router.put("/update/:id", authRequired, updateContent);

export default router;
