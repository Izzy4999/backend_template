import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "@/utils/jwt";
import { env } from "@utils/env";
import {
  invalidateUserRefreshToken,
  isRefreshTokenValidMulti,
  isRefreshTokenValidSingle,
  removeRefreshToken,
  setUserRefreshToken,
  storeRefreshToken,
} from "@/utils/tokenStore";
import { Request, Response } from "express";

const isSingleSession = () => env.AUTH_SESSION_MODE === "single";

/**
 * Issue tokens (use in your login handler).
 * Payload must include `id` (userId).
 * - single: one refresh token per user (new login replaces previous).
 * - multi: each login gets a new refresh token (multiple sessions).
 */
export const issueTokens = (payload: object) => {
  if (typeof payload !== "object" || payload === null || !("id" in payload)) {
    throw new Error("issueTokens payload must contain id (userId)");
  }
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);
  if (isSingleSession()) {
    const userId = String((payload as { id: unknown }).id);
    setUserRefreshToken(userId, refreshToken);
  } else {
    storeRefreshToken(refreshToken);
  }
  return { accessToken, refreshToken };
};

/**
 * Refresh endpoint.
 * - single: returns new access token only; same refresh token (one session everywhere).
 * - multi: rotates tokens; returns new access + new refresh (each device has its own).
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

  if (isSingleSession()) {
    const userId = String(decoded.id);
    if (!isRefreshTokenValidSingle(userId, token)) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }
    const newAccessToken = generateAccessToken({ ...decoded });
    return res.json({ accessToken: newAccessToken, refreshToken: token });
  }

  // multi: validate, rotate (remove old, issue new)
  if (!isRefreshTokenValidMulti(token)) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }
  removeRefreshToken(token);
  const newAccessToken = generateAccessToken({ ...decoded });
  const newRefreshToken = generateRefreshToken({ ...decoded });
  storeRefreshToken(newRefreshToken);
  res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
};

/**
 * Logout endpoint.
 * - single: invalidates the user's single refresh token (logs out from all devices). Accepts refresh token in body or Bearer access token in header.
 * - multi: revokes only the refresh token sent in body (logs out current session only).
 */
export const logout = (req: Request, res: Response) => {
  if (isSingleSession()) {
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
  } else {
    const token = req.body?.refreshToken;
    if (token) removeRefreshToken(token);
  }
  res.json({ message: "Logged out successfully" });
};
