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
 * Issue tokens (use in your login handler)
 */
export const issueTokens = (payload: object) => {
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);
  storeRefreshToken(refreshToken);
  return { accessToken, refreshToken };
};

/**
 * Refresh endpoint - replace old token, issue new tokens
 */
export const refreshToken = (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ message: "Missing refresh token" });
  }

  if (!isRefreshTokenValid(refreshToken)) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }

  const decoded = verifyRefreshToken(refreshToken);
  if (!decoded) {
    removeRefreshToken(refreshToken);
    return res.status(403).json({ message: "Expired refresh token" });
  }
  removeRefreshToken(refreshToken);

  if (typeof decoded !== "object" || !("id" in decoded)) {
    return res.status(403).json({ message: "Invalid token payload" });
  }

  const newAccessToken = generateAccessToken({ ...decoded });
  const newRefreshToken = generateRefreshToken({ ...decoded });
  storeRefreshToken(newRefreshToken);

  res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
};

/**
 * Logout endpoint - destroy refresh token
 */
export const logout = (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (refreshToken) removeRefreshToken(refreshToken);
  res.json({ message: "Logged out successfully" });
};
