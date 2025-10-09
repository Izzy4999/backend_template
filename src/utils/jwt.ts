import jwt, { Secret } from "jsonwebtoken";
import { env } from "@utils/env";

export const generateAccessToken = (payload: object) =>
  jwt.sign(payload, env.JWT_SECRET as Secret, { expiresIn: "15m" });

export const generateRefreshToken = (payload: object) =>
  jwt.sign(payload, env.REFRESH_SECRET as Secret, { expiresIn: "7d" });

export const verifyAccessToken = (token: string) =>
  jwt.verify(token, env.JWT_SECRET as Secret);

export const verifyRefreshToken = (token: string) =>
  jwt.verify(token, env.REFRESH_SECRET as Secret);
