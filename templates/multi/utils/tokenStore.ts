// Multi session only: multiple refresh tokens; logout only revokes the one sent.
const refreshTokens = new Set<string>();

export const storeRefreshToken = (token: string) => {
  refreshTokens.add(token);
};

export const removeRefreshToken = (token: string) => {
  refreshTokens.delete(token);
};

export const isRefreshTokenValid = (token: string) => refreshTokens.has(token);

export const clearAllTokens = () => {
  refreshTokens.clear();
};
