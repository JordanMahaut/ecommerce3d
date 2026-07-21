import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function AccountSummary() {
  const { user } = useAuth();

  if (!user) return null;

  // Ces valeurs seront remplacées plus tard par l'API
  const totalOrders = 0;
  const totalAddresses = 0;
  const totalSpent = 0;

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <p className="font-semibold text-indigo-600">
          Mon compte
        </p>

        <h2 className="mt-1 text-2xl font-bold text-slate-900">
          Résumé
        </h2>
      </div>

      <div className="mt-8 space-y-4">

        <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
          <span className="text-slate-600">
            Statut
          </span>

          <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-700">
            Actif
          </span>
        </div>

        <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
          <span className="text-slate-600">
            Rôle
          </span>

          <span className="font-bold text-slate-900">
            {user.role === "ADMIN"
              ? "Administrateur"
              : "Client"}
          </span>
        </div>

        <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
          <span className="text-slate-600">
            Commandes
          </span>

          <span className="text-lg font-bold text-indigo-600">
            {totalOrders}
          </span>
        </div>

        <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
          <span className="text-slate-600">
            Adresses
          </span>

          <span className="text-lg font-bold text-indigo-600">
            {totalAddresses}
          </span>
        </div>

        <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
          <span className="text-slate-600">
            Total des achats
          </span>

          <span className="text-lg font-bold text-indigo-600">
            {totalSpent.toFixed(2)} €
          </span>
        </div>

      </div>

      {user.role === "ADMIN" && (
        <Link
          to="/admin"
          className="mt-8 flex w-full items-center justify-center rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-800"
        >
          Accéder au panneau d'administration
        </Link>
      )}
    </section>
  );
}

export default AccountSummary;