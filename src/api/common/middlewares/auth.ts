import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../../../utils/responseHandler.js";
import asyncWrapper from "./asyncWrapper.js";
import { verifyToken } from "../../../config/token.js";


const isAuth = asyncWrapper(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw ApiError.unauthorized("No Token Provided");
        }

        const token = authHeader.split(" ")[1];
        const payload = verifyToken(token as string);

        req.user = payload;
        next();
    }
);

export { isAuth };
