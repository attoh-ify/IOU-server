import winston from 'winston';
import fs from 'fs';
import path from 'path';
import DailyRotateFile from 'winston-daily-rotate-file';

const ensureLogDirExists = (dirPath: string) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const createServiceLogger = (serviceName: string) => {
  const logDir = path.join('logs', serviceName);
  ensureLogDirExists(logDir);

  const isProduction = process.env.NODE_ENV === 'production';

  return winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      isProduction
        ? winston.format.json()
        : winston.format.printf(({ timestamp, level, message, service, ...meta }) => {
            return `${timestamp} ${level}: [${service}] ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
          })
    ),
    defaultMeta: { service: serviceName },
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        )
      }),

      new DailyRotateFile({
        filename: path.join(logDir, `${serviceName}.error-%DATE%.log`),
        datePattern: 'YYYY-MM-DD',
        level: 'error',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d'
      }),

      new DailyRotateFile({
        filename: path.join(logDir, `${serviceName}.combined-%DATE%.log`),
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d'
      })
    ]
  });
};

export { createServiceLogger };