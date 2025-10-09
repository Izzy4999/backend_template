"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearAllTokens = exports.isRefreshTokenValid = exports.removeRefreshToken = exports.storeRefreshToken = void 0;
// Simple in-memory store (replace with DB/Redis in production)
const refreshTokens = new Set();
const storeRefreshToken = (token) => {
    refreshTokens.add(token);
};
exports.storeRefreshToken = storeRefreshToken;
const removeRefreshToken = (token) => {
    refreshTokens.delete(token);
};
exports.removeRefreshToken = removeRefreshToken;
const isRefreshTokenValid = (token) => {
    return refreshTokens.has(token);
};
exports.isRefreshTokenValid = isRefreshTokenValid;
const clearAllTokens = () => {
    refreshTokens.clear();
};
exports.clearAllTokens = clearAllTokens;
