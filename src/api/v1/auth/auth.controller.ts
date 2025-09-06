import type { Request, Response } from "express";
import { AuthService } from "./auth.service.js";
import { AuthenticatedUser } from "../../../config/token.js";

export class AuthController {
  // Register user
  static async register(req: Request, res: Response) {
    const userData = req.body;
    const result = await AuthService.register(userData);
    res.status(201).json(result);
  }

  // Login user
  static async login(req: Request, res: Response) {
    const userData = req.body;
    const result = await AuthService.login(userData);
    res.status(200).json(result);
  }

  // Get user data
  static async getUser(req: Request, res: Response) {
    const { userId } = req.user as AuthenticatedUser;
    const result = await AuthService.getUser(userId);
    res.status(200).json(result);
  }
}
