import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function SecurityCard() {
  const { logout, user } = useAuth();

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <p className="font-semibold text-indigo-600">
          Sécurité
        </p>

        <h2 className="mt-1 text-2xl font-bold text-slate-900">
          Connexion
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Gérez la sécurité de votre compte.
        </p>
      </div>

      <div className="mt-8 space-y-4">

        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-sm text-slate-500">
            Adresse email
          </p>

          <p className="mt-1 font-semibold text-slate-900">
            {user?.email}
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">
                Vérification de l'email
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Fonction disponible prochainement.
              </p>
            </div>

            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
              Bientôt
            </span>
          </div>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">
                Modifier le mot de passe
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Renforcez la sécurité de votre compte.
              </p>
            </div>

            <Link
              to="/profile/password"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Modifier
            </Link>
          </div>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">
                Dernière connexion
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Disponible prochainement.
              </p>
            </div>

            <span className="text-sm font-semibold text-slate-700">
              —
            </span>
          </div>
        </div>

      </div>

      <button
        onClick={logout}
        className="mt-8 w-full rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700"
      >
        Déconnexion
      </button>
    </section>
  );
}

export default SecurityCard;