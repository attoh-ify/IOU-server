import express from 'express';
import { config } from './config';
import { createServiceLogger } from './utils/logger';
import { setupSwagger } from './api/common/swagger';
import { setupMiddlewares } from './api/common/middlewares';


const logger = createServiceLogger("server-index");
const PORT = config.port;

const startServer = async () => {
    try {
        const app = express();

        setupMiddlewares(app);

        // setupRoutes(app);

        setupSwagger(app);

        // await connectToDatabase();

        app.listen(PORT, () => {
            logger.info(
                `IOU server is running on port ${PORT}`
            );
            logger.info(
                `IOU API Documentation is avalaible at http://localhost:${PORT}/api-docs`
            );
        });
    } catch (error) {
        logger.error('Error starting server:', error);
        process.exit(1);
    }
}

startServer();
