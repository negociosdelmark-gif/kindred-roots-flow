import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const ContactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  service_type: z.string().trim().max(80).optional().or(z.literal("")),
  message: z.string().trim().min(5).max(2000),
  // Honeypot: campo oculto que humanos no completan
  website: z.string().max(0).optional().or(z.literal("")),
});

const SCOPE = "contact";
const WINDOW_MS = 60 * 60 * 1000; // 1 hora
const MAX_PER_WINDOW = 3;

function getClientIp(): string {
  try {
    const req = getRequest();
    const h = req.headers;
    const xff = h.get("x-forwarded-for");
    if (xff) return xff.split(",")[0].trim();
    return (
      h.get("cf-connecting-ip") ||
      h.get("x-real-ip") ||
      "unknown"
    );
  } catch {
    return "unknown";
  }
}

export const submitContactMessage = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ContactSchema.parse(input))
  .handler(async ({ data }) => {
    // Honeypot: si viene con contenido, descartar silenciosamente
    if (data.website && data.website.length > 0) {
      return { ok: true };
    }

    const ip = getClientIp();
    const since = new Date(Date.now() - WINDOW_MS).toISOString();

    // Rate limiting: 3 envíos por hora por IP
    const { count, error: countErr } = await supabaseAdmin
      .from("rate_limits")
      .select("id", { count: "exact", head: true })
      .eq("scope", SCOPE)
      .eq("ip", ip)
      .gte("created_at", since);

    if (countErr) {
      console.error("[rate_limits.count]", countErr);
    } else if ((count ?? 0) >= MAX_PER_WINDOW) {
      throw new Error(
        "Has alcanzado el límite de mensajes por hora. Intenta de nuevo más tarde o escríbeme por WhatsApp.",
      );
    }

    const { error } = await supabaseAdmin.from("contact_messages").insert({
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      service_type: data.service_type || null,
      message: data.message,
    });
    if (error) {
      console.error("[contact_messages.insert]", error);
      throw new Error("No se pudo guardar tu mensaje. Intenta de nuevo más tarde.");
    }

    // Registrar el envío para el rate limit (fire-and-forget)
    await supabaseAdmin.from("rate_limits").insert({ scope: SCOPE, ip });

    return { ok: true };
  });
