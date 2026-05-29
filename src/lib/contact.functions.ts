import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const ContactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  service_type: z.string().trim().max(80).optional().or(z.literal("")),
  message: z.string().trim().min(5).max(2000),
});

export const submitContactMessage = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ContactSchema.parse(input))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin.from("contact_messages").insert({
  .handler(async ({ data }) => {
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
    return { ok: true };
  });