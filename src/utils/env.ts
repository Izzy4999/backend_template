import { cleanEnv, str, port } from "envalid";

export const env = cleanEnv(process.env, {
  NODE_ENV: str({ choices: ["development", "production", "test"] }),
  PORT: port({ default: 4000 }),
  JWT_SECRET: str(),
  REFRESH_SECRET: str(),
  EMAIL_USER: str(),
  EMAIL_PASS: str(),
  EMAIL_FROM: str(),
});
