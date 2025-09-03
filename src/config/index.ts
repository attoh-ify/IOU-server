import dotenv from "dotenv";
import path from "path";
import { z } from "zod";

dotenv.config({ path: path.join(__dirname, "../../.env") });

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  BASE_URL: z.string().default("http://localhost:3000"),
  NODE_ENV: z.string(),
  JWT_SECRET: z.string(),
});

// Parse + validate in one step
const env = envSchema.parse(process.env);

export const config = {
  port: env.PORT,
  base_url: env.BASE_URL,
  node_env: env.NODE_ENV,
  jwt: {
    secret: env.JWT_SECRET,
  }
};
