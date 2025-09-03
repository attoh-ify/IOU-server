import express from "express";
import methodNotAllowed from "../../common/middlewares/methodNotAllowed.js";
import { CategorySchema } from "./category.schema.js";
import { CategoryController } from "./category.controller.js";
import { validateBody } from "../../common/middlewares/validateSchema.js";

const router = express.Router();

router
  .route("/")
  .post(validateBody(CategorySchema.create), CategoryController.create)
  .all(methodNotAllowed);

export default router;
