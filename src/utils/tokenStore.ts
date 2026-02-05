// --- Single session (one refresh token per user; logout logs out everywhere) ---
const userRefreshTokens = new Map<string, string>();

export const setUserRefreshToken = (userId: string, token: string) => {
  userRefreshTokens.set(userId, token);
};

export const getUserRefreshToken = (userId: string): string | undefined =>
  userRefreshTokens.get(userId);

export const isRefreshTokenValidSingle = (userId: string, token: string) =>
  userRefreshTokens.get(userId) === token;

export const invalidateUserRefreshToken = (userId: string) => {
  userRefreshTokens.delete(userId);
};

// --- Multi session (multiple refresh tokens; logout only revokes the one sent) ---
const refreshTokensSet = new Set<string>();

export const storeRefreshToken = (token: string) => {
  refreshTokensSet.add(token);
};

export const removeRefreshToken = (token: string) => {
  refreshTokensSet.delete(token);
};

export const isRefreshTokenValidMulti = (token: string) =>
  refreshTokensSet.has(token);

// --- Shared ---
export const clearAllTokens = () => {
  userRefreshTokens.clear();
  refreshTokensSet.clear();
};
