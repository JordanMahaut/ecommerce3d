import { Link } from "react-router-dom";
import OrderStatusBadge from "./OrderStatusBadge";

function OrderCard({
  order,
  onCancel,
}) {
  const canCancel =
    order.status === "PENDING" ||
    order.status === "PAID";

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-slate-900">
              Commande #{order.id}
            </h2>

            <OrderStatusBadge status={order.status} />
          </div>

          <p className="text-sm text-slate-500">
            Passée le{" "}
            {new Date(order.createdAt).toLocaleDateString("fr-FR")}
          </p>

          <div className="grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
            <div>
              <span className="font-semibold">
                Articles :
              </span>{" "}
              {order.items?.length ?? 0}
            </div>

            <div>
              <span className="font-semibold">
                Total :
              </span>{" "}
              {Number(order.total).toFixed(2)} €
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">

          <Link
            to={`/profile/orders/${order.id}`}
            className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
          >
            Voir les détails
          </Link>

          {canCancel && (
            <button
              onClick={() => onCancel(order.id)}
              className="rounded-xl border border-red-300 px-5 py-3 font-semibold text-red-600 transition hover:bg-red-50"
            >
              Annuler
            </button>
          )}

        </div>

      </div>

      {order.items?.length > 0 && (
        <>
          <div className="my-6 border-t border-slate-200" />

          <div className="space-y-3">
            {order.items.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-4">

                  <img
                    src={item.product?.image}
                    alt={item.product?.name}
                    className="h-16 w-16 rounded-xl border object-cover"
                  />

                  <div>
                    <p className="font-semibold text-slate-900">
                      {item.product?.name}
                    </p>

                    <p className="text-sm text-slate-500">
                      Quantité : {item.quantity}
                    </p>
                  </div>

                </div>

                <p className="font-semibold">
                  {(item.price * item.quantity).toFixed(2)} €
                </p>
              </div>
            ))}

            {order.items.length > 3 && (
              <p className="pt-2 text-center text-sm text-slate-500">
                + {order.items.length - 3} article(s) supplémentaire(s)
              </p>
            )}
          </div>
        </>
      )}
    </article>
  );
}

export default OrderCard;