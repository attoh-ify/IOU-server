import type { ObjectId } from "mongoose";

declare global {
  declare namespace Express {
    export interface Request {
      user?: {
        userId: ObjectId;
        email: string;
        userName: string;
      };
    }
  }
}