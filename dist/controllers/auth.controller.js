"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.refreshToken = exports.issueTokens = void 0;
const jwt_1 = require("../utils/jwt");
const tokenStore_1 = require("../utils/tokenStore");
/**
 * Issue tokens (use in your login handler)
 */
const issueTokens = (payload) => {
    const accessToken = (0, jwt_1.generateAccessToken)(payload);
    const refreshToken = (0, jwt_1.generateRefreshToken)(payload);
    (0, tokenStore_1.storeRefreshToken)(refreshToken);
    return { accessToken, refreshToken };
};
exports.issueTokens = issueTokens;
/**
 * Refresh endpoint - replace old token, issue new tokens
 */
const refreshToken = (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(400).json({ message: "Missing refresh token" });
    }
    if (!(0, tokenStore_1.isRefreshTokenValid)(refreshToken)) {
        return res.status(403).json({ message: "Invalid refresh token" });
    }
    const decoded = (0, jwt_1.verifyRefreshToken)(refreshToken);
    if (!decoded) {
        (0, tokenStore_1.removeRefreshToken)(refreshToken);
        return res.status(403).json({ message: "Expired refresh token" });
    }
    (0, tokenStore_1.removeRefreshToken)(refreshToken);
    if (typeof decoded !== "object" || !("id" in decoded)) {
        return res.status(403).json({ message: "Invalid token payload" });
    }
    const newAccessToken = (0, jwt_1.generateAccessToken)({ ...decoded });
    const newRefreshToken = (0, jwt_1.generateRefreshToken)({ ...decoded });
    (0, tokenStore_1.storeRefreshToken)(newRefreshToken);
    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
};
exports.refreshToken = refreshToken;
/**
 * Logout endpoint - destroy refresh token
 */
const logout = (req, res) => {
    const { refreshToken } = req.body;
    if (refreshToken)
        (0, tokenStore_1.removeRefreshToken)(refreshToken);
    res.json({ message: "Logged out successfully" });
};
exports.logout = logout;
