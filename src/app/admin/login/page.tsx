import { loginAction } from "@/lib/actions";

const ERROR_MESSAGES: Record<string, string> = {
  domain: "El acceso está restringido a correos @streambe.com.",
  invalid: "Email o contraseña incorrectos.",
};

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const error = searchParams.error ? ERROR_MESSAGES[searchParams.error] : undefined;

  return (
    <main className="flex min-h-screen items-center justify-center bg-digital px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-6 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/streambe-logo.svg" alt="Streambe" className="mx-auto h-10" />
          <h1 className="mt-4 font-display text-xl font-semibold text-ink">
            Panel de administración
          </h1>
          <p className="mt-1 text-sm text-ink/60">Acceso exclusivo @streambe.com</p>
        </div>
        <form action={loginAction} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-ink">Email</label>
            <input
              type="email"
              name="email"
              required
              placeholder="nombre@streambe.com"
              className="w-full rounded-lg border border-line px-3 py-2 text-sm focus:border-tech focus:outline-none focus:ring-2 focus:ring-tech/30"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ink">Contraseña</label>
            <input
              type="password"
              name="password"
              required
              className="w-full rounded-lg border border-line px-3 py-2 text-sm focus:border-tech focus:outline-none focus:ring-2 focus:ring-tech/30"
            />
          </div>
          {error && (
            <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>
          )}
          <button
            type="submit"
            className="w-full rounded-lg bg-tech px-4 py-3 font-semibold text-white transition hover:bg-digital"
          >
            Ingresar
          </button>
        </form>
      </div>
    </main>
  );
}
