import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";
import { submitContactMessage } from "@/lib/contact.functions";

const services = [
  "Sesión individual",
  "Constelación familiar",
  "Taller grupal",
  "Terapia infantil",
  "Otro",
];

export function ContactForm() {
  const submit = useServerFn(submitContactMessage);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      phone: String(fd.get("phone") || ""),
      service_type: String(fd.get("service_type") || ""),
      message: String(fd.get("message") || ""),
      website: String(fd.get("website") || ""),
    };

    setLoading(true);
    try {
      await submit({ data: payload });
      toast.success("Mensaje enviado", {
        description: "Gracias por escribir. Te responderé muy pronto.",
      });
      e.currentTarget.reset();
    } catch (err) {
      console.error(err);
      // Fallback: si falla el guardado en Supabase, ofrecer enviar por WhatsApp
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

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
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
          <input name="name" required minLength={2} maxLength={120} className={inputCls} placeholder="Tu nombre" />
        </label>
        <label className="block">
          <span className="block text-sm mb-1.5 text-foreground/80">Email</span>
          <input name="email" type="email" required maxLength={255} className={inputCls} placeholder="tu@email.com" />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="block text-sm mb-1.5 text-foreground/80">Teléfono</span>
          <input name="phone" maxLength={40} className={inputCls} placeholder="+57 ..." />
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
          required
          minLength={5}
          maxLength={2000}
          rows={5}
          className={inputCls}
          placeholder="Cuéntame brevemente qué te trae aquí..."
        />
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
