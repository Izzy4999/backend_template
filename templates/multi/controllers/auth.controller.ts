import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "@/utils/jwt";
import {
  isRefreshTokenValid,
  removeRefreshToken,
  storeRefreshToken,
} from "@/utils/tokenStore";
import { Request, Response } from "express";

/**
 * Issue tokens (use in your login handler). Payload must include `id` (userId).
 * Each login gets a new refresh token (multiple sessions).
 */
export const issueTokens = (payload: object) => {
  if (typeof payload !== "object" || payload === null || !("id" in payload)) {
    throw new Error("issueTokens payload must contain id (userId)");
  }
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);
  storeRefreshToken(refreshToken);
  return { accessToken, refreshToken };
};

/**
 * Refresh: rotates tokens; returns new access + new refresh (each device has its own).
 */
export const refreshToken = (req: Request, res: Response) => {
  const { refreshToken: token } = req.body;
  if (!token) {
    return res.status(400).json({ message: "Missing refresh token" });
  }

  if (!isRefreshTokenValid(token)) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }

  let decoded: object & { id?: unknown };
  try {
    decoded = verifyRefreshToken(token) as object & { id?: unknown };
  } catch {
    removeRefreshToken(token);
    return res.status(403).json({ message: "Invalid or expired refresh token" });
  }

  if (typeof decoded !== "object" || !decoded || !("id" in decoded)) {
    return res.status(403).json({ message: "Invalid token payload" });
  }

  removeRefreshToken(token);
  const newAccessToken = generateAccessToken({ ...decoded });
  const newRefreshToken = generateRefreshToken({ ...decoded });
  storeRefreshToken(newRefreshToken);
  res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
};

/**
 * Logout: revokes only the refresh token sent in body (current session only).
 */
export const logout = (req: Request, res: Response) => {
  const token = req.body?.refreshToken;
  if (token) removeRefreshToken(token);
  res.json({ message: "Logged out successfully" });
};
