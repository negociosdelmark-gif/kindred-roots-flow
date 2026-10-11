import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertAdmin(context: { supabase: any; userId: string }) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", context.userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) {
    console.error("[assertAdmin]", error);
    throw new Error("No se pudo verificar el acceso.");
  }
  if (!data) throw new Error("Acceso denegado. Se requiere rol de administrador.");
}

export const listContactMessages = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        page: z.number().int().min(1).default(1),
        pageSize: z.number().int().min(1).max(100).default(10),
        search: z.string().trim().max(120).optional().or(z.literal("")),
        dateFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal("")),
        dateTo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal("")),
      })
      .parse(input ?? {}),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const from = (data.page - 1) * data.pageSize;
    const to = from + data.pageSize - 1;
    let query = supabaseAdmin
      .from("contact_messages")
      .select("id, name, email, phone, service_type, message, created_at", { count: "exact" });

    if (data.search) {
      const term = data.search.replace(/[%,()]/g, " ").trim();
      if (term) query = query.or(`name.ilike.%${term}%,email.ilike.%${term}%`);
    }
    if (data.dateFrom) query = query.gte("created_at", `${data.dateFrom}T00:00:00.000Z`);
    if (data.dateTo) query = query.lte("created_at", `${data.dateTo}T23:59:59.999Z`);

    const { data: rows, error, count } = await query
      .order("created_at", { ascending: false })
      .range(from, to);
    if (error) {
      console.error("[listContactMessages]", error);
      throw new Error("No se pudieron cargar los mensajes.");
    }
    return { items: rows ?? [], total: count ?? 0, page: data.page, pageSize: data.pageSize };
  });

export const deleteContactMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("contact_messages").delete().eq("id", data.id);
    if (error) {
      console.error("[deleteContactMessage]", error);
      throw new Error("No se pudo eliminar el mensaje.");
    }
    return { ok: true };
  });

export const exportContactMessages = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        search: z.string().trim().max(120).optional().or(z.literal("")),
        dateFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal("")),
        dateTo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal("")),
      })
      .parse(input ?? {}),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    let query = supabaseAdmin
      .from("contact_messages")
      .select("id, name, email, phone, service_type, message, created_at");
    if (data.search) {
      const term = data.search.replace(/[%,()]/g, " ").trim();
      if (term) query = query.or(`name.ilike.%${term}%,email.ilike.%${term}%`);
    }
    if (data.dateFrom) query = query.gte("created_at", `${data.dateFrom}T00:00:00.000Z`);
    if (data.dateTo) query = query.lte("created_at", `${data.dateTo}T23:59:59.999Z`);
    const { data: rows, error } = await query
      .order("created_at", { ascending: false })
      .limit(5000);
    if (error) {
      console.error("[exportContactMessages]", error);
      throw new Error("No se pudo exportar.");
    }
    return { items: rows ?? [] };
  });

export const getMyAdminStatus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    return { isAdmin: !!data, userId: context.userId };
  });
