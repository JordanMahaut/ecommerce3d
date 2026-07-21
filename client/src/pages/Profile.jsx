import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const initials = `${user.firstname?.[0] || ""}${user.lastname?.[0] || ""}`
    .toUpperCase();

  return (
    <div className="bg-slate-50">
      <div className="mx-auto min-h-[calc(100vh-160px)] max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* EN-TÊTE */}
        <section className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-700 via-blue-600 to-cyan-500 p-8 text-white shadow-2xl shadow-blue-200 sm:p-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl border border-white/20 bg-white/15 text-3xl font-extrabold backdrop-blur">
              {initials || "U"}
            </div>

            <div>
              <p className="font-semibold text-blue-100">
                Espace personnel
              </p>

              <h1 className="mt-1 text-4xl font-extrabold">
                Bonjour {user.firstname} 👋
              </h1>

              <p className="mt-3 text-blue-100">
                Gérez vos informations personnelles et suivez vos commandes.
              </p>
            </div>
          </div>
        </section>

        <div className="mt-10 grid items-start gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-8">
            {/* INFORMATIONS */}
            <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <p className="font-semibold text-indigo-600">
                    Mon compte
                  </p>

                  <h2 className="mt-1 text-2xl font-bold text-slate-900">
                    Informations personnelles
                  </h2>
                </div>

                <button
                  type="button"
                  className="rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
                >
                  Modifier
                </button>
              </div>

              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-5">
                  <p className="text-sm font-medium text-slate-500">
                    Prénom
                  </p>

                  <p className="mt-2 text-lg font-bold text-slate-900">
                    {user.firstname || "Non renseigné"}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-5">
                  <p className="text-sm font-medium text-slate-500">
                    Nom
                  </p>

                  <p className="mt-2 text-lg font-bold text-slate-900">
                    {user.lastname || "Non renseigné"}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-5 sm:col-span-2">
                  <p className="text-sm font-medium text-slate-500">
                    Adresse e-mail
                  </p>

                  <p className="mt-2 break-all text-lg font-bold text-slate-900">
                    {user.email}
                  </p>
                </div>
              </div>
            </section>

            {/* COMMANDES */}
            <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-indigo-600">
                    Mes achats
                  </p>

                  <h2 className="mt-1 text-2xl font-bold text-slate-900">
                    Dernières commandes
                  </h2>
                </div>

                <Link
                  to="/profile/orders"
                  className="font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  Tout voir →
                </Link>
              </div>

              <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-3xl shadow-sm">
                  📦
                </div>

                <h3 className="mt-5 text-xl font-bold text-slate-900">
                  Aucune commande
                </h3>

                <p className="mt-2 text-slate-500">
                  Vos commandes apparaîtront ici après votre premier achat.
                </p>

                <Link
                  to="/shop"
                  className="mt-6 inline-flex rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
                >
                  Découvrir la boutique
                </Link>
              </div>
            </section>
          </div>

          {/* COLONNE DROITE */}
          <aside className="space-y-6">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900">
                Résumé du compte
              </h2>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                  <span className="text-slate-600">Statut</span>

                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-700">
                    Actif
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                  <span className="text-slate-600">Rôle</span>

                  <span className="font-bold text-slate-900">
                    {user.role === "ADMIN" ? "Administrateur" : "Client"}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                  <span className="text-slate-600">Commandes</span>

                  <span className="font-bold text-slate-900">
                    0
                  </span>
                </div>
              </div>

              {user.role === "ADMIN" && (
                <Link
                  to="/admin"
                  className="mt-6 flex w-full items-center justify-center rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-800"
                >
                  Accéder à l’administration
                </Link>
              )}
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900">
                Sécurité
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Modifiez régulièrement votre mot de passe pour protéger votre
                compte.
              </p>

              <button
                type="button"
                className="mt-5 w-full rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
              >
                Modifier le mot de passe
              </button>
            </section>

            <section className="rounded-3xl bg-slate-900 p-6 text-white shadow-xl">
              <p className="font-semibold text-indigo-300">
                Projet personnalisé
              </p>

              <h2 className="mt-2 text-xl font-bold">
                Besoin d’une création sur mesure ?
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-300">
                Envoyez votre idée ou votre fichier STL pour obtenir une
                estimation.
              </p>

              <Link
                to="/quote"
                className="mt-5 inline-flex font-semibold text-indigo-300 hover:text-white"
              >
                Demander un devis →
              </Link>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default Profile;