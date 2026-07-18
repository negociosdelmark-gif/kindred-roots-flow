import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Mail, Phone, Trash2, LogOut, ShieldAlert } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  listContactMessages,
  deleteContactMessage,
  getMyAdminStatus,
} from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Panel · Mensajes de contacto" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const list = useServerFn(listContactMessages);
  const del = useServerFn(deleteContactMessage);
  const status = useServerFn(getMyAdminStatus);

  const statusQ = useQuery({ queryKey: ["admin-status"], queryFn: () => status() });
  const messagesQ = useQuery({
    queryKey: ["contact-messages"],
    queryFn: () => list(),
    enabled: statusQ.data?.isAdmin === true,
  });

  const delMut = useMutation({
    mutationFn: (id: string) => del({ data: { id } }),
    onSuccess: () => {
      toast.success("Mensaje eliminado");
      qc.invalidateQueries({ queryKey: ["contact-messages"] });
    },
    onError: (e: any) => toast.error("Error", { description: e?.message ?? "" }),
  });

  const onSignOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  if (statusQ.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!statusQ.data?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md text-center rounded-2xl border border-border bg-card p-8 shadow-soft">
          <ShieldAlert className="mx-auto h-10 w-10 text-primary" />
          <h1 className="mt-4 text-xl font-serif font-semibold">Acceso restringido</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Tu cuenta está autenticada pero no tiene rol de administrador. Contacta al soporte para
            que asignen tu ID de usuario:
          </p>
          <code className="mt-3 inline-block break-all rounded bg-muted px-2 py-1 text-xs">
            {statusQ.data?.userId}
          </code>
          <button
            onClick={onSignOut}
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm hover:bg-accent"
          >
            <LogOut className="h-4 w-4" /> Cerrar sesión
          </button>
        </div>
      </div>
    );
  }

  const messages = messagesQ.data ?? [];

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-semibold text-foreground">
              Mensajes recibidos
            </h1>
            <p className="text-sm text-muted-foreground">
              {messages.length} {messages.length === 1 ? "mensaje" : "mensajes"} en total
            </p>
          </div>
          <button
            onClick={onSignOut}
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm hover:bg-accent"
          >
            <LogOut className="h-4 w-4" /> Salir
          </button>
        </header>

        {messagesQ.isLoading ? (
          <div className="mt-10 flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : messages.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
            Aún no hay mensajes.
          </div>
        ) : (
          <ul className="mt-6 grid gap-4">
            {messages.map((m: any) => (
              <li
                key={m.id}
                className="rounded-2xl border border-border bg-card p-5 shadow-soft"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-foreground">{m.name}</h3>
                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <a href={`mailto:${m.email}`} className="inline-flex items-center gap-1 hover:text-foreground">
                        <Mail className="h-3 w-3" /> {m.email}
                      </a>
                      {m.phone && (
                        <a href={`tel:${m.phone}`} className="inline-flex items-center gap-1 hover:text-foreground">
                          <Phone className="h-3 w-3" /> {m.phone}
                        </a>
                      )}
                      {m.service_type && <span>· {m.service_type}</span>}
                      <span>· {new Date(m.created_at).toLocaleString("es-CO")}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm("¿Eliminar este mensaje? Esta acción es permanente.")) {
                        delMut.mutate(m.id);
                      }
                    }}
                    disabled={delMut.isPending}
                    className="inline-flex items-center gap-1.5 rounded-full border border-destructive/40 px-3 py-1.5 text-xs text-destructive hover:bg-destructive/10 disabled:opacity-50"
                  >
                    <Trash2 className="h-3 w-3" /> Eliminar
                  </button>
                </div>
                <p className="mt-3 whitespace-pre-wrap text-sm text-foreground/90">{m.message}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
