import express from "express";
import methodNotAllowed from "../../common/middlewares/methodNotAllowed.js";
import { VoucherSchema } from "./voucher.schema.js";
import { VoucherController } from "./voucher.conroller.js";
import { validateBody } from "../../common/middlewares/validateSchema.js";

const router = express.Router();

router
  .route("/")
  .post(validateBody(VoucherSchema.create), VoucherController.create)
  .all(methodNotAllowed);

export default router;
