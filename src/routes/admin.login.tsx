import { Link, createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useState } from "react";

import { adminLogin, fetchAdminSession } from "@/lib/admin/admin-auth";

export const Route = createFileRoute("/admin/login")({
  beforeLoad: () => {
    if (typeof window === "undefined") return;
    const session = fetchAdminSession();
    if (session.authenticated) {
      throw redirect({ to: "/admin" });
    }
  },
  head: () => ({
    meta: [{ name: "robots", content: "noindex, nofollow" }],
    title: "Вход — админка Ромедов",
  }),
  component: AdminLoginPage,
});

const fieldClass =
  "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-lime-deep";
const labelClass =
  "font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground";

function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSending(true);

    try {
      await adminLogin({ username, password });
      await router.navigate({ to: "/admin" });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Не удалось войти");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-5">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm">
        <p className="font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Ромедов · админка
        </p>
        <h1 className="mt-2 font-display text-2xl font-semibold uppercase">Вход</h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <label className="block">
            <span className={labelClass}>Логин</span>
            <input
              className={`${fieldClass} mt-2`}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </label>

          <label className="block">
            <span className={labelClass}>Пароль</span>
            <input
              type="password"
              className={`${fieldClass} mt-2`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </label>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <button
            type="submit"
            disabled={sending}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 font-display text-xs font-semibold uppercase tracking-[0.12em] text-brand-foreground disabled:opacity-60"
          >
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Войти
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          <Link to="/" className="text-lime-deep hover:underline">
            На сайт
          </Link>
        </p>
      </div>
    </div>
  );
}
