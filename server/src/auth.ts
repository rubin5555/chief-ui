// The plan's integration point (§2 "Auth on the WS connection"): the collab
// server should verify whatever token your real system's auth already issues,
// not invent a second mechanism. Since that system's token shape (JWT vs
// opaque session id) isn't known yet, this is a placeholder — replace the body
// with a real verification call once that's confirmed.
//
// For now it accepts the token value itself as the user id, which is enough
// to simulate distinct users locally (e.g. `?token=alice` vs `?token=bob`)
// for manual multi-tab testing and the future two-BrowserContext Playwright
// spec from the plan's §7.

export interface AuthenticatedUser {
  userId: string;
}

export class AuthError extends Error {}

export const verifyToken = async (token: string | null): Promise<AuthenticatedUser> => {
  if (!token) throw new AuthError('Missing auth token');
  return { userId: token };
};
