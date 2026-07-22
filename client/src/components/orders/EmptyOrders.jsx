import { Link } from "react-router-dom";

function EmptyOrders() {
  return (
    <section className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-indigo-100 text-5xl">
        📦
      </div>

      <h2 className="mt-8 text-3xl font-bold text-slate-900">
        Aucune commande
      </h2>

      <p className="mx-auto mt-4 max-w-lg text-slate-500">
        Vous n'avez encore effectué aucun achat.
        Découvrez notre boutique et trouvez les produits qui vous
        correspondent.
      </p>

      <div className="mt-8 flex justify-center gap-4">
        <Link
          to="/shop"
          className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
        >
          Découvrir la boutique
        </Link>

        <Link
          to="/"
          className="rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          Retour à l'accueil
        </Link>
      </div>
    </section>
  );
}

export default EmptyOrders;