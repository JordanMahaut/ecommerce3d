const STATUS_CONFIG = {
  PENDING: {
    icon: "⏳",
    label: "En attente",
    className: "bg-yellow-100 text-yellow-800",
  },
  PAID: {
    icon: "💳",
    label: "Payée",
    className: "bg-blue-100 text-blue-800",
  },
  PROCESSING: {
    icon: "⚙️",
    label: "En préparation",
    className: "bg-purple-100 text-purple-800",
  },
  SHIPPED: {
    icon: "🚚",
    label: "Expédiée",
    className: "bg-orange-100 text-orange-800",
  },
  DELIVERED: {
    icon: "✅",
    label: "Livrée",
    className: "bg-emerald-100 text-emerald-800",
  },
  CANCELLED: {
    icon: "❌",
    label: "Annulée",
    className: "bg-red-100 text-red-800",
  },
};

function OrderStatusBadge({ status }) {
  const current =
    STATUS_CONFIG[status] || {
      label: status,
      className: "bg-slate-100 text-slate-700",
    };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${current.className}`}
    >
      {current.label}
    </span>
  );
}

export default OrderStatusBadge;