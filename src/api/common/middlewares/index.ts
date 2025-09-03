import express, { Application } from "express";
import { createServiceLogger } from "../../../utils/logger";
import compression from "compression";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import notFound from "./notFound";
import { errorMiddleware } from "./error";

const logger = createServiceLogger("middlewares-index");

export const setupMiddlewares = (app: Application): void => {
    app.use(compression());
    app.use(express.json({ limit: "10mb" }));
    app.use(express.urlencoded({ extended: true, limit: "10mb" }));

    app.use(helmet());

    app.use(cors());

    // app.use(notFound);
    // app.use(errorMiddleware);

    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // max requests per IP
        standardHeaders: true,
        legacyHeaders: false,
    });
    app.use(limiter);

    app.use((req, res, next) => {
        const start = Date.now();

        res.on("finish", () => {
            const duration = Date.now() - start;

            const logDetails = {
                method: req.method,
                url: req.originalUrl,
                status: res.statusCode,
                duration: `${duration}ms`,
                ip: req.ip,
            };

            if (res.statusCode >= 400) {
                logger.warn('Request warning', logDetails);
            } else {
                logger.http('Request processed', logDetails);
            };
        });

        next();
    });
}