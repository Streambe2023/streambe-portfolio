import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "crypto";

const COOKIE_NAME = "streambe_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 días

function getSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error(
      "Falta configurar la variable de entorno AUTH_SECRET (ver .env.example)."
    );
  }
  return secret;
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", getSecret()).update(payload).digest("hex");
}

function createSessionToken(email: string): string {
  const exp = Date.now() + SESSION_TTL_SECONDS * 1000;
  const payload = `${email}|${exp}`;
  const signature = sign(payload);
  return Buffer.from(`${payload}|${signature}`).toString("base64url");
}

function verifySessionToken(token: string | undefined): { email: string } | null {
  if (!token) return null;

  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const parts = decoded.split("|");
    if (parts.length !== 3) return null;

    const [email, expStr, signature] = parts;
    const expected = sign(`${email}|${expStr}`);

    const sigBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expected);
    if (sigBuffer.length !== expectedBuffer.length) return null;
    if (!crypto.timingSafeEqual(sigBuffer, expectedBuffer)) return null;

    if (Date.now() > Number(expStr)) return null;

    return { email };
  } catch {
    return null;
  }
}

export function setSessionCookie(email: string): void {
  cookies().set(COOKIE_NAME, createSessionToken(email), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export function clearSessionCookie(): void {
  cookies().set(COOKIE_NAME, "", { path: "/", maxAge: 0 });
}

export function getSession(): { email: string } | null {
  const token = cookies().get(COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

/** Usar dentro de Server Actions que requieren admin logueado. */
export async function requireSession(): Promise<{ email: string }> {
  const session = getSession();
  if (!session) {
    redirect("/admin/login");
  }
  return session;
}
