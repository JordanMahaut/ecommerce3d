const prisma = require("../lib/prisma");
const { sendMail } = require("./mail.service");

async function createNotification({
  type,
  title,
  message,
  link = null,
  metadata = null,
}) {
  return prisma.notification.create({
    data: {
      type,
      title,
      message,
      link,
      metadata,
    },
  });
}

async function notifyNewOrder(order) {
  const reference =
    order.reference || `Commande #${order.id}`;

  const customerName = [
    order.user?.firstname,
    order.user?.lastname,
  ]
    .filter(Boolean)
    .join(" ");

  const total = formatPrice(order.total);

  const title = "Nouvelle commande";
  const message = `${reference} a été envoyée par ${
    customerName || "un client"
  } pour un montant de ${total}.`;

  await createNotification({
    type: "ORDER_CREATED",
    title,
    message,
    link: `/admin/orders/${order.id}`,
    metadata: {
      orderId: order.id,
      reference: order.reference || null,
      total: String(order.total ?? 0),
    },
  });

  await sendMail({
    to: process.env.ADMIN_EMAIL,
    subject: `[3D Factory] Nouvelle commande ${reference}`,
    text: message,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a">
        <h1 style="font-size:22px">Nouvelle commande reçue</h1>

        <p>Une nouvelle demande de commande vient d'être envoyée.</p>

        <table style="border-collapse:collapse">
          <tr>
            <td style="padding:6px 16px 6px 0"><strong>Référence</strong></td>
            <td>${escapeHtml(reference)}</td>
          </tr>
          <tr>
            <td style="padding:6px 16px 6px 0"><strong>Client</strong></td>
            <td>${escapeHtml(customerName || "Client")}</td>
          </tr>
          <tr>
            <td style="padding:6px 16px 6px 0"><strong>Total</strong></td>
            <td>${escapeHtml(total)}</td>
          </tr>
          <tr>
            <td style="padding:6px 16px 6px 0"><strong>Statut</strong></td>
            <td>${escapeHtml(order.status || "REQUESTED")}</td>
          </tr>
        </table>

        <p style="margin-top:24px">
          <a
            href="${process.env.CLIENT_URL}/admin/orders/${order.id}"
            style="background:#4f46e5;color:white;padding:12px 18px;text-decoration:none;border-radius:8px"
          >
            Voir la commande
          </a>
        </p>
      </div>
    `,
  });
}

async function notifyNewQuote(quote) {
  const reference =
    quote.reference || `Devis #${quote.id}`;

  const customerName =
    quote.name ||
    [quote.user?.firstname, quote.user?.lastname]
      .filter(Boolean)
      .join(" ") ||
    "Client";

  const title = "Nouvelle demande de devis";
  const message = `${reference} a été envoyé par ${customerName}.`;

  await createNotification({
    type: "QUOTE_CREATED",
    title,
    message,
    link: `/admin/quotes/${quote.id}`,
    metadata: {
      quoteId: quote.id,
      reference: quote.reference || null,
      email: quote.email || quote.user?.email || null,
    },
  });

  await sendMail({
    to: process.env.ADMIN_EMAIL,
    subject: `[3D Factory] Nouveau devis ${reference}`,
    text: message,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a">
        <h1 style="font-size:22px">Nouvelle demande de devis</h1>

        <p>Une nouvelle demande de devis vient d'être envoyée.</p>

        <table style="border-collapse:collapse">
          <tr>
            <td style="padding:6px 16px 6px 0"><strong>Référence</strong></td>
            <td>${escapeHtml(reference)}</td>
          </tr>
          <tr>
            <td style="padding:6px 16px 6px 0"><strong>Client</strong></td>
            <td>${escapeHtml(customerName)}</td>
          </tr>
          <tr>
            <td style="padding:6px 16px 6px 0"><strong>E-mail</strong></td>
            <td>${escapeHtml(
              quote.email || quote.user?.email || "Non renseigné",
            )}</td>
          </tr>
        </table>

        ${
          quote.message
            ? `
              <div style="margin-top:20px;padding:16px;background:#f1f5f9;border-radius:8px">
                ${escapeHtml(quote.message)}
              </div>
            `
            : ""
        }

        <p style="margin-top:24px">
          <a
            href="${process.env.CLIENT_URL}/admin/quotes/${quote.id}"
            style="background:#4f46e5;color:white;padding:12px 18px;text-decoration:none;border-radius:8px"
          >
            Voir le devis
          </a>
        </p>
      </div>
    `,
  });
}

function formatPrice(value) {
  const price = Number(value);

  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(Number.isFinite(price) ? price : 0);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

module.exports = {
  createNotification,
  notifyNewOrder,
  notifyNewQuote,
};