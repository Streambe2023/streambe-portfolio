import crypto from "crypto";

/**
 * Hashea una contraseña con scrypt (nativo de Node, sin dependencias externas).
 * Formato de salida: "salt:hash" (ambos en hexadecimal).
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = crypto.scryptSync(password, salt, 64);
  return `${salt}:${derived.toString("hex")}`;
}

/**
 * Verifica una contraseña en texto plano contra un hash generado por hashPassword.
 */
export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hashHex] = stored.split(":");
  if (!salt || !hashHex) return false;

  const hashBuffer = Buffer.from(hashHex, "hex");
  const derived = crypto.scryptSync(password, salt, 64);

  if (hashBuffer.length !== derived.length) return false;
  return crypto.timingSafeEqual(hashBuffer, derived);
}
