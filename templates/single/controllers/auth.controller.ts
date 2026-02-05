import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "@/utils/jwt";
import {
  invalidateUserRefreshToken,
  isRefreshTokenValid,
  setUserRefreshToken,
} from "@/utils/tokenStore";
import { Request, Response } from "express";

/**
 * Issue tokens (use in your login handler). Payload must include `id` (userId).
 * One refresh token per user; new login replaces the previous.
 */
export const issueTokens = (payload: object) => {
  if (typeof payload !== "object" || payload === null || !("id" in payload)) {
    throw new Error("issueTokens payload must contain id (userId)");
  }
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);
  const userId = String((payload as { id: unknown }).id);
  setUserRefreshToken(userId, refreshToken);
  return { accessToken, refreshToken };
};

/**
 * Refresh: returns new access token only; same refresh token (one session everywhere).
 */
export const refreshToken = (req: Request, res: Response) => {
  const { refreshToken: token } = req.body;
  if (!token) {
    return res.status(400).json({ message: "Missing refresh token" });
  }

  let decoded: object & { id?: unknown };
  try {
    decoded = verifyRefreshToken(token) as object & { id?: unknown };
  } catch {
    return res.status(403).json({ message: "Invalid or expired refresh token" });
  }

  if (typeof decoded !== "object" || !decoded || !("id" in decoded)) {
    return res.status(403).json({ message: "Invalid token payload" });
  }

  const userId = String(decoded.id);
  if (!isRefreshTokenValid(userId, token)) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }

  const newAccessToken = generateAccessToken({ ...decoded });
  res.json({ accessToken: newAccessToken, refreshToken: token });
};

/**
 * Logout: invalidates the user's single refresh token (logs out from all devices).
 * Accepts refresh token in body or Bearer access token in Authorization header.
 */
export const logout = (req: Request, res: Response) => {
  let userId: string | null = null;
  const tokenFromBody = req.body?.refreshToken;
  if (tokenFromBody) {
    try {
      const decoded = verifyRefreshToken(tokenFromBody) as object & { id?: unknown };
      if (typeof decoded === "object" && decoded && "id" in decoded) {
        userId = String(decoded.id);
      }
    } catch {
      // invalid/expired - still respond success
    }
  }
  if (!userId && req.headers.authorization?.startsWith("Bearer ")) {
    const accessToken = req.headers.authorization.split(" ")[1];
    try {
      const decoded = verifyAccessToken(accessToken) as object & { id?: unknown };
      if (typeof decoded === "object" && decoded && "id" in decoded) {
        userId = String(decoded.id);
      }
    } catch {
      // invalid/expired
    }
  }
  if (userId) invalidateUserRefreshToken(userId);
  res.json({ message: "Logged out successfully" });
};
