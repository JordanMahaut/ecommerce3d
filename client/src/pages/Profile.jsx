import { useAuth } from "../context/AuthContext";

function Profile() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-xl mx-auto py-12">

      <h1 className="text-3xl font-bold mb-6">
        Mon profil
      </h1>

      <div className="bg-white shadow rounded-xl p-6 space-y-3">

        <p>
          <strong>Prénom :</strong> {user.firstname}
        </p>

        <p>
          <strong>Nom :</strong> {user.lastname}
        </p>

        <p>
          <strong>Email :</strong> {user.email}
        </p>

        <p>
          <strong>Rôle :</strong> {user.role}
        </p>

      </div>

    </div>
  );
}

export default Profile;