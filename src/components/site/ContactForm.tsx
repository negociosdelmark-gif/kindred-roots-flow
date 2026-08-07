import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";
import { z } from "zod";
import { submitContactMessage } from "@/lib/contact.functions";

const services = [
  "Sesión individual",
  "Constelación familiar",
  "Taller grupal",
  "Terapia infantil",
  "Otro",
];

const FormSchema = z.object({
  name: z.string().trim().min(1, "El nombre es obligatorio").max(120, "Máximo 120 caracteres"),
  email: z.string().trim().min(1, "El email es obligatorio").email("Formato de email inválido").max(255),
  phone: z.string().trim().max(40, "Máximo 40 caracteres").optional().or(z.literal("")),
  service_type: z.string().trim().max(80).optional().or(z.literal("")),
  message: z.string().trim().min(10, "El mensaje debe tener al menos 10 caracteres").max(2000, "Máximo 2000 caracteres"),
});

type FieldErrors = Partial<Record<"name" | "email" | "phone" | "message", string>>;

export function ContactForm() {
  const submit = useServerFn(submitContactMessage);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  const validateField = (name: string, value: string) => {
    const shape = FormSchema.shape as Record<string, z.ZodTypeAny>;
    const schema = shape[name];
    if (!schema) return;
    const res = schema.safeParse(value);
    setErrors((prev) => ({
      ...prev,
      [name]: res.success ? undefined : res.error.issues[0]?.message,
    }));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      phone: String(fd.get("phone") || ""),
      service_type: String(fd.get("service_type") || ""),
      message: String(fd.get("message") || ""),
      website: String(fd.get("website") || ""),
    };

    const parsed = FormSchema.safeParse(payload);
    if (!parsed.success) {
      const next: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof FieldErrors;
        if (key && !next[key]) next[key] = issue.message;
      }
      setErrors(next);
      toast.error("Revisa el formulario", {
        description: "Hay campos con errores por corregir.",
      });
      return;
    }
    setErrors({});

    setLoading(true);
    try {
      await submit({ data: payload });
      toast.success("Mensaje enviado", {
        description: "Gracias por escribir. Te responderé muy pronto.",
      });
      form.reset();
    } catch (err) {
      console.error(err);
      // Fallback: si falla el guardado, ofrecer enviar por WhatsApp
      const waText = encodeURIComponent(
        `Hola Dra. Eliana, soy ${payload.name}. ` +
          `Interés: ${payload.service_type || "Sesión"}. ` +
          `${payload.message} (Tel: ${payload.phone || "—"}, Email: ${payload.email})`,
      );
      const waUrl = `https://wa.me/573132655265?text=${waText}`;
      toast.error("No pudimos guardar tu mensaje", {
        description: "Puedes enviarlo directo por WhatsApp.",
        action: {
          label: "Enviar por WhatsApp",
          onClick: () => window.open(waUrl, "_blank", "noopener,noreferrer"),
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full rounded-xl border border-border bg-background/70 px-4 py-3 text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition";
  const errCls = "border-destructive/60 focus:ring-destructive/30 focus:border-destructive/60";
  const Err = ({ id, msg }: { id: string; msg?: string }) =>
    msg ? (
      <span id={id} role="alert" className="mt-1.5 block text-xs text-destructive">
        {msg}
      </span>
    ) : null;

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4">
      {/* Honeypot anti-spam: oculto para humanos, atractivo para bots */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label>
          No completar
          <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="block text-sm mb-1.5 text-foreground/80">Nombre</span>
          <input
            name="name"
            maxLength={120}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "err-name" : undefined}
            onBlur={(e) => validateField("name", e.target.value)}
            onChange={(e) => errors.name && validateField("name", e.target.value)}
            className={`${inputCls} ${errors.name ? errCls : ""}`}
            placeholder="Tu nombre"
          />
          <Err id="err-name" msg={errors.name} />
        </label>
        <label className="block">
          <span className="block text-sm mb-1.5 text-foreground/80">Email</span>
          <input
            name="email"
            type="email"
            maxLength={255}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "err-email" : undefined}
            onBlur={(e) => validateField("email", e.target.value)}
            onChange={(e) => errors.email && validateField("email", e.target.value)}
            className={`${inputCls} ${errors.email ? errCls : ""}`}
            placeholder="tu@email.com"
          />
          <Err id="err-email" msg={errors.email} />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="block text-sm mb-1.5 text-foreground/80">Teléfono</span>
          <input
            name="phone"
            maxLength={40}
            onBlur={(e) => validateField("phone", e.target.value)}
            className={`${inputCls} ${errors.phone ? errCls : ""}`}
            placeholder="+57 ..."
          />
          <Err id="err-phone" msg={errors.phone} />
        </label>
        <label className="block">
          <span className="block text-sm mb-1.5 text-foreground/80">Servicio de interés</span>
          <select name="service_type" defaultValue="" className={inputCls}>
            <option value="" disabled>Selecciona una opción</option>
            {services.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>
      </div>
      <label className="block">
        <span className="block text-sm mb-1.5 text-foreground/80">Mensaje</span>
        <textarea
          name="message"
          maxLength={2000}
          rows={5}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "err-message" : undefined}
          onBlur={(e) => validateField("message", e.target.value)}
          onChange={(e) => errors.message && validateField("message", e.target.value)}
          className={`${inputCls} ${errors.message ? errCls : ""}`}
          placeholder="Cuéntame brevemente qué te trae aquí... (mínimo 10 caracteres)"
        />
        <Err id="err-message" msg={errors.message} />
      </label>
      <button
        type="submit"
        disabled={loading}
        className="mt-2 inline-flex justify-center items-center gap-2 px-6 py-3.5 rounded-full bg-gradient-gold text-primary-foreground font-medium shadow-soft hover:shadow-warm transition disabled:opacity-60"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        {loading ? "Enviando..." : "Enviar mensaje"}
      </button>
    </form>
  );
}
