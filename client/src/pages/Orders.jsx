import { useState } from "react";

import useOrders from "../hooks/useOrders";

import OrderCard from "../components/orders/OrderCard";
import EmptyOrders from "../components/orders/EmptyOrders";

import { cancelOrder } from "../services/order.service";

function Orders() {
  const {
    orders,
    loading,
    error,
    reload,
  } = useOrders();

  const [statusFilter, setStatusFilter] = useState("ALL");

  async function handleCancel(id) {
    const confirmCancel = window.confirm(
      "Voulez-vous vraiment annuler cette commande ?"
    );

    if (!confirmCancel) return;

    try {
      await cancelOrder(id);

      reload();
    } catch (err) {
      console.error(err);
      alert("Impossible d'annuler cette commande.");
    }
  }

  const filteredOrders =
    statusFilter === "ALL"
      ? orders
      : orders.filter((order) => order.status === statusFilter);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="rounded-3xl bg-white p-12 text-center shadow-sm">
          Chargement des commandes...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="rounded-3xl border border-red-200 bg-red-50 p-12 text-center text-red-700">
          Une erreur est survenue lors du chargement des commandes.
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-6 py-10">

      <div>
        <p className="font-semibold text-indigo-600">
          Mon compte
        </p>

        <h1 className="mt-2 text-4xl font-bold text-slate-900">
          Mes commandes
        </h1>

        <p className="mt-3 text-slate-500">
          Consultez l'historique et le suivi de vos commandes.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">

        {[
          "ALL",
          "PENDING",
          "PAID",
          "PROCESSING",
          "SHIPPED",
          "DELIVERED",
          "CANCELLED",
        ].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`rounded-xl px-5 py-2 font-semibold transition ${
              statusFilter === status
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {status === "ALL" ? "Toutes" : status}
          </button>
        ))}

      </div>

      {filteredOrders.length === 0 ? (
        <EmptyOrders />
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onCancel={handleCancel}
            />
          ))}
        </div>
      )}

    </div>
  );
}

export default Orders;