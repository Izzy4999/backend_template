// Single session only: one refresh token per user; logout logs out everywhere.
const userRefreshTokens = new Map<string, string>();

export const setUserRefreshToken = (userId: string, token: string) => {
  userRefreshTokens.set(userId, token);
};

export const getUserRefreshToken = (userId: string): string | undefined =>
  userRefreshTokens.get(userId);

export const isRefreshTokenValid = (userId: string, token: string) =>
  userRefreshTokens.get(userId) === token;

export const invalidateUserRefreshToken = (userId: string) => {
  userRefreshTokens.delete(userId);
};

export const clearAllTokens = () => {
  userRefreshTokens.clear();
};
