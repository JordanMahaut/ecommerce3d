import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

function PersonalInformation() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  if (!user) {
    return null;
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="font-semibold text-indigo-600">Mon compte</p>

          <h2 className="mt-1 text-2xl font-bold text-slate-900">
            Informations personnelles
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Consultez et modifiez les informations associées à votre compte.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsEditing((current) => !current)}
          className="rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
        >
          {isEditing ? "Annuler" : "Modifier"}
        </button>
      </div>

      {!isEditing ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="text-sm font-medium text-slate-500">Prénom</p>

            <p className="mt-2 text-lg font-bold text-slate-900">
              {user.firstname || "Non renseigné"}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="text-sm font-medium text-slate-500">Nom</p>

            <p className="mt-2 text-lg font-bold text-slate-900">
              {user.lastname || "Non renseigné"}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-5 sm:col-span-2">
            <p className="text-sm font-medium text-slate-500">
              Adresse e-mail
            </p>

            <p className="mt-2 break-all text-lg font-bold text-slate-900">
              {user.email || "Non renseignée"}
            </p>
          </div>
        </div>
      ) : (
        <form
          className="mt-8 grid gap-5 sm:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault();
          }}
        >
          <div>
            <label
              htmlFor="firstname"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Prénom
            </label>

            <input
              id="firstname"
              name="firstname"
              type="text"
              defaultValue={user.firstname || ""}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label
              htmlFor="lastname"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Nom
            </label>

            <input
              id="lastname"
              name="lastname"
              type="text"
              defaultValue={user.lastname || ""}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Adresse e-mail
            </label>

            <input
              id="email"
              name="email"
              type="email"
              defaultValue={user.email || ""}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </div>

          <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Annuler
            </button>

            <button
              type="submit"
              className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
            >
              Enregistrer
            </button>
          </div>
        </form>
      )}
    </section>
  );
}

export default PersonalInformation;