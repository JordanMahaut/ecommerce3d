import { useAuth } from "../../context/AuthContext";

function ProfileHeader() {
  const { user } = useAuth();

  if (!user) return null;

  const initials =
    `${user.firstname?.[0] || ""}${user.lastname?.[0] || ""}`.toUpperCase();

  return (
    <section className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-700 via-blue-600 to-cyan-500 p-8 text-white shadow-2xl shadow-blue-200 sm:p-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl border border-white/20 bg-white/15 text-3xl font-extrabold backdrop-blur">
          {initials || "U"}
        </div>

        <div className="flex-1">
          <p className="font-semibold text-blue-100">
            Espace personnel
          </p>

          <h1 className="mt-1 text-4xl font-extrabold">
            Bonjour {user.firstname} 👋
          </h1>

          <p className="mt-3 max-w-2xl text-blue-100">
            Gérez vos informations personnelles, vos adresses,
            vos commandes et la sécurité de votre compte.
          </p>
        </div>

        <div className="rounded-2xl bg-white/10 px-6 py-4 backdrop-blur">
          <p className="text-sm text-blue-100">
            Statut
          </p>

          <p className="mt-1 text-xl font-bold">
            {user.role === "ADMIN" ? "Administrateur" : "Client"}
          </p>
        </div>
      </div>
    </section>
  );
}

export default ProfileHeader;