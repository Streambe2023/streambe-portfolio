"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";
import { setSessionCookie, clearSessionCookie, requireSession } from "@/lib/session";

/**
 * Login del panel admin. Restringido a correos @streambe.com.
 * En caso de error, redirige a /admin/login?error=... para no depender
 * de hooks experimentales de formularios.
 */
export async function loginAction(formData: FormData): Promise<void> {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  if (!email.endsWith("@streambe.com")) {
    redirect("/admin/login?error=domain");
  }

  const admin = await prisma.adminUser.findUnique({ where: { email } });
  if (!admin || !verifyPassword(password, admin.passwordHash)) {
    redirect("/admin/login?error=invalid");
  }

  await setSessionCookie(email);
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await clearSessionCookie();
  redirect("/admin/login");
}

export async function createProjectAction(formData: FormData): Promise<void> {
  await requireSession();

  const name = String(formData.get("name") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const imageUrl = String(formData.get("imageUrl") || "").trim();
  const projectUrl = String(formData.get("projectUrl") || "").trim();
  const order = Number(formData.get("order") || 0);

  if (!name || !imageUrl || !projectUrl) {
    throw new Error("Nombre, imagen y URL del proyecto son obligatorios.");
  }

  await prisma.project.create({
    data: { name, description, imageUrl, projectUrl, order: Number.isFinite(order) ? order : 0 },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function updateProjectAction(id: string, formData: FormData): Promise<void> {
  await requireSession();

  const name = String(formData.get("name") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const imageUrl = String(formData.get("imageUrl") || "").trim();
  const projectUrl = String(formData.get("projectUrl") || "").trim();
  const order = Number(formData.get("order") || 0);

  if (!name || !imageUrl || !projectUrl) {
    throw new Error("Nombre, imagen y URL del proyecto son obligatorios.");
  }

  await prisma.project.update({
    where: { id },
    data: { name, description, imageUrl, projectUrl, order: Number.isFinite(order) ? order : 0 },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function deleteProjectAction(id: string): Promise<void> {
  await requireSession();
  await prisma.project.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin");
}
