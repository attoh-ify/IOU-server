import { AuthenticatedUser } from "../config/token";

declare global {
  declare namespace Express {
    export interface Request {
      user?: AuthenticatedUser;
    }
  }
}