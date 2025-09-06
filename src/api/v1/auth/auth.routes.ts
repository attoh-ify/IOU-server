import express from "express";
import { AuthController } from "./auth.controller.js";
import methodNotAllowed from "../../common/middlewares/methodNotAllowed.js";
import { AuthSchema } from "./auth.schema.js";
import { validateBody } from "../../common/middlewares/validateSchema.js";
import { isAuth } from "../../common/middlewares/auth.js";

const router = express.Router();

router
  .route("/")
  .get(isAuth, AuthController.getUser)
  .all(methodNotAllowed);

router
  .route("/login")
  .post(validateBody(AuthSchema.login), AuthController.login)
  .all(methodNotAllowed);

export default router;
