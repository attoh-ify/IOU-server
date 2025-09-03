import type { Request, Response } from "express";
import { CategoryService } from "./category.service.js";

export class CategoryController {
    // Create category
    static async create(req: Request, res: Response) {
        const categoryData = req.body;
        const result = await CategoryService.create(categoryData);
        res.status(201).json(result);
    }
}
