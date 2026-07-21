import { Link } from "react-router-dom";

function OrdersPreview() {
  const orders = [];

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-indigo-600">
            Mes achats
          </p>

          <h2 className="mt-1 text-2xl font-bold text-slate-900">
            Dernières commandes
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Retrouvez l'historique de toutes vos commandes.
          </p>
        </div>

        <Link
          to="/profile/orders"
          className="font-semibold text-indigo-600 hover:text-indigo-800"
        >
          Tout voir →
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
          <div className="text-6xl">
            📦
          </div>

          <h3 className="mt-5 text-2xl font-bold text-slate-900">
            Aucune commande
          </h3>

          <p className="mt-3 text-slate-500">
            Vos commandes apparaîtront ici après votre premier achat.
          </p>

          <Link
            to="/shop"
            className="mt-6 inline-flex rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
          >
            Découvrir la boutique
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between rounded-2xl border border-slate-200 p-5 transition hover:shadow-sm"
            >
              <div>
                <h3 className="font-bold text-slate-900">
                  Commande #{order.id}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {order.createdAt}
                </p>
              </div>

              <div className="text-right">
                <p className="font-bold text-indigo-600">
                  {order.total} €
                </p>

                <span className="mt-2 inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default OrdersPreview;