import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  Loader2,
  Mail,
  Phone,
  Trash2,
  LogOut,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Search,
  Download,
  X,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  listContactMessages,
  deleteContactMessage,
  exportContactMessages,
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

type Msg = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  service_type: string | null;
  message: string;
  created_at: string;
};

function toCsv(rows: Msg[]) {
  const esc = (v: string) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const header = ["nombre", "email", "mensaje", "fecha"].join(",");
  const body = rows
    .map((r) =>
      [esc(r.name), esc(r.email), esc(r.message), esc(new Date(r.created_at).toISOString())].join(","),
    )
    .join("\n");
  return `${header}\n${body}`;
}

function AdminPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const list = useServerFn(listContactMessages);
  const del = useServerFn(deleteContactMessage);
  const exp = useServerFn(exportContactMessages);
  const status = useServerFn(getMyAdminStatus);

  const statusQ = useQuery({ queryKey: ["admin-status"], queryFn: () => status() });
  const PAGE_SIZE = 10;
  const [page, setPage] = useState(1);

  // Filtros (draft) y aplicados
  const [searchDraft, setSearchDraft] = useState("");
  const [fromDraft, setFromDraft] = useState("");
  const [toDraft, setToDraft] = useState("");
  const [filters, setFilters] = useState({ search: "", dateFrom: "", dateTo: "" });

  const messagesQ = useQuery({
    queryKey: ["contact-messages", page, filters],
    queryFn: () => list({ data: { page, pageSize: PAGE_SIZE, ...filters } }),
    enabled: statusQ.data?.isAdmin === true,
    placeholderData: keepPreviousData,
  });

  const [pendingDelete, setPendingDelete] = useState<Msg | null>(null);
  const confirmBtnRef = useRef<HTMLButtonElement>(null);

  const delMut = useMutation({
    mutationFn: (id: string) => del({ data: { id } }),
    onSuccess: () => {
      toast.success("Mensaje eliminado");
      setPendingDelete(null);
      qc.invalidateQueries({ queryKey: ["contact-messages"] });
    },
    onError: (e: any) => toast.error("Error", { description: e?.message ?? "" }),
  });

  useEffect(() => {
    if (!pendingDelete) return;
    confirmBtnRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setPendingDelete(null);
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (!delMut.isPending) delMut.mutate(pendingDelete.id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pendingDelete, delMut]);

  const onSignOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  const applyFilters = () => {
    setPage(1);
    setFilters({ search: searchDraft.trim(), dateFrom: fromDraft, dateTo: toDraft });
  };

  const clearFilters = () => {
    setSearchDraft("");
    setFromDraft("");
    setToDraft("");
    setPage(1);
    setFilters({ search: "", dateFrom: "", dateTo: "" });
  };

  const exportCsv = async () => {
    let rows: Msg[] = [];
    try {
      const r = await exp({ data: filters });
      rows = r.items as Msg[];
    } catch (e: any) {
      toast.error("Error", { description: e?.message ?? "" });
      return;
    }
    if (rows.length === 0) {
      toast.error("No hay mensajes para exportar");
      return;
    }
    const blob = new Blob(["\uFEFF" + toCsv(rows)], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mensajes_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast.success(`${rows.length} mensajes exportados`);
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

  const messages = (messagesQ.data?.items ?? []) as Msg[];
  const total = messagesQ.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const canPrev = page > 1;
  const canNext = page < totalPages;
  const hasFilters = !!(filters.search || filters.dateFrom || filters.dateTo);

  const fieldCls =
    "w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40";

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-semibold text-foreground">
              Mensajes recibidos
            </h1>
            <p className="text-sm text-muted-foreground">
              {total} {total === 1 ? "mensaje" : "mensajes"}
              {hasFilters ? " (filtrados)" : " en total"} · página {page} de {totalPages}
            </p>
          </div>
          <button
            onClick={onSignOut}
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm hover:bg-accent"
          >
            <LogOut className="h-4 w-4" /> Salir
          </button>
        </header>

        <section
          className="mt-6 grid gap-3 rounded-2xl border border-border bg-card p-4 sm:grid-cols-[1fr_auto_auto_auto_auto] sm:items-end"
          aria-label="Filtros"
        >
          <label className="block">
            <span className="mb-1 block text-xs text-muted-foreground">Nombre o email</span>
            <input
              value={searchDraft}
              onChange={(e) => setSearchDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyFilters()}
              placeholder="Buscar..."
              className={fieldCls}
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs text-muted-foreground">Desde</span>
            <input type="date" value={fromDraft} onChange={(e) => setFromDraft(e.target.value)} className={fieldCls} />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs text-muted-foreground">Hasta</span>
            <input type="date" value={toDraft} onChange={(e) => setToDraft(e.target.value)} className={fieldCls} />
          </label>
          <button
            onClick={applyFilters}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90"
          >
            <Search className="h-4 w-4" /> Buscar
          </button>
          <div className="flex gap-2">
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-sm hover:bg-accent"
              >
                <X className="h-4 w-4" /> Limpiar
              </button>
            )}
            <button
              onClick={exportCsv}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-sm hover:bg-accent"
            >
              <Download className="h-4 w-4" /> CSV
            </button>
          </div>
        </section>

        {messagesQ.isLoading ? (
          <div className="mt-10 flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : messages.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
            {hasFilters ? "No hay mensajes que coincidan con los filtros." : "Aún no hay mensajes."}
          </div>
        ) : (
          <>
            <ul className="mt-6 grid gap-4">
              {messages.map((m) => (
                <li key={m.id} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
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
                      onClick={() => setPendingDelete(m)}
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

            <nav className="mt-8 flex items-center justify-between" aria-label="Paginación">
              <button
                onClick={() => canPrev && setPage((p) => p - 1)}
                disabled={!canPrev || messagesQ.isFetching}
                className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" /> Anterior
              </button>
              <span className="text-sm text-muted-foreground">
                Página {page} de {totalPages}
              </span>
              <button
                onClick={() => canNext && setPage((p) => p + 1)}
                disabled={!canNext || messagesQ.isFetching}
                className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Siguiente <ChevronRight className="h-4 w-4" />
              </button>
            </nav>
          </>
        )}
      </div>

      {pendingDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 px-4"
          onClick={() => setPendingDelete(null)}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="del-title"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-warm"
          >
            <h2 id="del-title" className="text-lg font-serif font-semibold text-foreground">
              ¿Eliminar este mensaje?
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Se eliminará permanentemente el mensaje de{" "}
              <strong className="text-foreground">{pendingDelete.name}</strong> ({pendingDelete.email}).
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Enter para confirmar · Esc para cancelar
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setPendingDelete(null)}
                className="rounded-full border border-border px-4 py-2 text-sm hover:bg-accent"
              >
                Cancelar
              </button>
              <button
                ref={confirmBtnRef}
                onClick={() => delMut.mutate(pendingDelete.id)}
                disabled={delMut.isPending}
                className="inline-flex items-center gap-2 rounded-full bg-destructive px-4 py-2 text-sm text-destructive-foreground hover:opacity-90 disabled:opacity-60"
              >
                {delMut.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
