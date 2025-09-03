import type { Request, Response } from "express";
import { VoucherService } from "./voucher.service.js";

export class VoucherController {
    // Create Voucher
    static async create(req: Request, res: Response) {
        const voucherData = req.body;
        const result = await VoucherService.create(voucherData);
        res.status(201).json(result);
    }
}
