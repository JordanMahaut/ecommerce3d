import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getOrder } from "../services/order.service";
import OrderStatusBadge from "../components/orders/OrderStatusBadge";

function OrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      try {
        const data = await getOrder(id);
        setOrder(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-10">
        Chargement...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-10">
        <h2 className="text-3xl font-bold">
          Commande introuvable
        </h2>

        <Link
          to="/profile/orders"
          className="mt-6 inline-flex rounded-xl bg-indigo-600 px-5 py-3 text-white"
        >
          Retour
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-6 py-10">

      <div className="flex items-center justify-between">

        <div>
          <p className="font-semibold text-indigo-600">
            Commande
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            #{order.id}
          </h1>

          <p className="mt-2 text-slate-500">
            {new Date(order.createdAt).toLocaleDateString("fr-FR")}
          </p>
        </div>

        <OrderStatusBadge status={order.status} />

      </div>

      <div className="grid gap-8 lg:grid-cols-3">

        <div className="space-y-6 lg:col-span-2">

          <section className="rounded-3xl border bg-white p-6 shadow-sm">

            <h2 className="mb-6 text-2xl font-bold">
              Produits
            </h2>

            <div className="space-y-5">

              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b pb-5 last:border-none"
                >
                  <div className="flex gap-4">

                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-20 w-20 rounded-xl object-cover"
                    />

                    <div>

                      <h3 className="font-semibold">
                        {item.product.name}
                      </h3>

                      <p className="text-sm text-slate-500">
                        Quantité : {item.quantity}
                      </p>

                    </div>

                  </div>

                  <div className="font-bold">
                    {(item.quantity * item.price).toFixed(2)} €
                  </div>

                </div>
              ))}

            </div>

          </section>

          <section className="rounded-3xl border bg-white p-6 shadow-sm">

            <h2 className="mb-5 text-2xl font-bold">
              Adresse de livraison
            </h2>

            <div className="space-y-2 text-slate-700">

              <p>
                {order.shippingFirstname} {order.shippingLastname}
              </p>

              <p>{order.shippingStreet}</p>

              {order.shippingStreet2 && (
                <p>{order.shippingStreet2}</p>
              )}

              <p>
                {order.shippingPostal} {order.shippingCity}
              </p>

              <p>{order.shippingCountry}</p>

              {order.shippingPhone && (
                <p>{order.shippingPhone}</p>
              )}

            </div>

          </section>

        </div>

        <aside>

          <section className="rounded-3xl border bg-white p-6 shadow-sm">

            <h2 className="text-2xl font-bold">
              Récapitulatif
            </h2>

            <div className="mt-6 space-y-4">

              <div className="flex justify-between">
                <span>Sous-total</span>

                <span>{order.total.toFixed(2)} €</span>
              </div>

              <div className="flex justify-between">
                <span>Livraison</span>

                <span>Gratuite</span>
              </div>

              <hr />

              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>

                <span>{order.total.toFixed(2)} €</span>
              </div>

            </div>

            <button
              className="mt-8 w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-700"
            >
              Télécharger la facture
            </button>

          </section>

        </aside>

      </div>

    </div>
  );
}

export default OrderDetails;