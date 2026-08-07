const GATEWAY_URL = "https://connector-gateway.lovable.dev/resend";
const TO_EMAIL = "Elianangarita@gmail.com";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function notifyNewMessage(payload: {
  name: string;
  email: string;
  phone?: string | null;
  service_type?: string | null;
  message: string;
}) {
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const resendKey = process.env["RESEND_API_KEY"];
  if (!lovableKey || !resendKey) {
    console.warn("[notifyNewMessage] Resend no configurado; se omite el email.");
    return { sent: false as const };
  }

  const html = `
    <h2>Nuevo mensaje desde la web</h2>
    <p><strong>Nombre:</strong> ${escapeHtml(payload.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
    <p><strong>Teléfono:</strong> ${escapeHtml(payload.phone || "—")}</p>
    <p><strong>Servicio:</strong> ${escapeHtml(payload.service_type || "—")}</p>
    <p><strong>Mensaje:</strong><br/>${escapeHtml(payload.message).replace(/\n/g, "<br/>")}</p>
  `;

  const res = await fetch(`${GATEWAY_URL}/emails`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": resendKey,
    },
    body: JSON.stringify({
      from: "Web Dra. Eliana <onboarding@resend.dev>",
      to: [TO_EMAIL],
      reply_to: payload.email,
      subject: `Nuevo mensaje de ${payload.name}`,
      html,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error(`[notifyNewMessage] Resend falló [${res.status}]: ${body}`);
    return { sent: false as const };
  }
  return { sent: true as const };
}
