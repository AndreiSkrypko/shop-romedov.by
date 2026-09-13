import { CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";

import { validateRequest } from "@/lib/request";
import { sendRequest } from "@/lib/send-request";
import { PHONE_DISPLAY, PHONE_HREF } from "@/lib/contacts";

const fieldClass =
  "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-lime-deep";
const labelClass =
  "font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground";

export function RequestForm({ source, compact = false }: { source: string; compact?: boolean }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    const payload = { name, phone, company, message, source };
    const validationError = validateRequest(payload);
    if (validationError) {
      setError(validationError);
      return;
    }

    setStatus("sending");
    const result = await sendRequest(payload);

    if (!result.ok) {
      setStatus("idle");
      setError(result.error);
      return;
    }

    setStatus("done");
  };

  if (status === "done") {
    return (
      <div className="rounded-2xl border border-lime-deep/40 bg-lime/10 p-8 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-lime-deep" />
        <p className="mt-4 font-display text-lg font-semibold uppercase">Заявка отправлена</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Свяжемся с вами в течение 30 минут в рабочее время. Срочный вопрос —{" "}
          <a href={PHONE_HREF} className="font-semibold text-lime-deep">
            {PHONE_DISPLAY}
          </a>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className={compact ? "space-y-4" : "grid gap-4 sm:grid-cols-2"}>
        <label className="block">
          <span className={labelClass}>Имя*</span>
          <input
            className={`${fieldClass} mt-2`}
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Ваше имя"
            autoComplete="name"
          />
        </label>

        <label className="block">
          <span className={labelClass}>Телефон*</span>
          <input
            className={`${fieldClass} mt-2`}
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="+375 __ ___-__-__"
            inputMode="tel"
            autoComplete="tel"
          />
        </label>
      </div>

      <label className="block">
        <span className={labelClass}>Компания</span>
        <input
          className={`${fieldClass} mt-2`}
          value={company}
          onChange={(event) => setCompany(event.target.value)}
          placeholder="Необязательно"
          autoComplete="organization"
        />
      </label>

      <label className="block">
        <span className={labelClass}>Что нужно подобрать</span>
        <textarea
          className={`${fieldClass} mt-2 min-h-28 resize-y`}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Сортамент, объём, сроки поставки, город доставки"
        />
      </label>

      {error ? (
        <p className="rounded-xl border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "sending"}
        className="flex h-13 w-full items-center justify-center gap-2 rounded-full bg-brand font-display text-sm font-semibold uppercase tracking-[0.12em] text-brand-foreground transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
      >
        {status === "sending" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Отправляем…
          </>
        ) : (
          "Отправить заявку"
        )}
      </button>

      <p className="text-[11px] leading-relaxed text-muted-foreground">
        Нажимая кнопку, вы соглашаетесь на обработку персональных данных.
      </p>
    </form>
  );
}
