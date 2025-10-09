// Simple in-memory store (replace with DB/Redis in production)
const refreshTokens = new Set<string>();

export const storeRefreshToken = (token: string) => {
  refreshTokens.add(token);
};

export const removeRefreshToken = (token: string) => {
  refreshTokens.delete(token);
};

export const isRefreshTokenValid = (token: string) => {
  return refreshTokens.has(token);
};

export const clearAllTokens = () => {
  refreshTokens.clear();
};
