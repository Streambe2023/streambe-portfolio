import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { logoutAction } from "@/lib/actions";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = getSession();
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/streambe-logo.svg" alt="Streambe" className="h-8" />
            <span className="font-display text-lg font-semibold text-ink">
              Panel de proyectos
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="hidden text-ink/60 sm:inline">{session.email}</span>
            <Link href="/" className="text-tech hover:underline">
              Ver landing
            </Link>
            <form action={logoutAction}>
              <button type="submit" className="text-ink/60 hover:text-danger">
                Salir
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </div>
  );
}
