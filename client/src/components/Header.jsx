import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="border-b bg-white px-8 py-4 flex justify-between items-center">

      {/* Logo */}
      <Link 
        to="/" 
        className="text-2xl font-bold"
      >
        3D Factory
      </Link>


      {/* Navigation */}
      <nav className="flex items-center gap-6">

        <Link 
          to="/shop"
          className="hover:underline"
        >
          Boutique
        </Link>


        <Link 
          to="/cart"
          className="hover:underline"
        >
          Panier 🛒
        </Link>


        {user ? (

          <div className="flex items-center gap-4">

            <Link
              to="/profile"
              className="font-medium hover:underline"
            >
              Bonjour {user.firstname} 👋
            </Link>


            <button
              onClick={logout}
              className="text-sm hover:underline"
            >
              Déconnexion
            </button>

          </div>

        ) : (

          <div className="flex gap-4">

            <Link
              to="/login"
              className="hover:underline"
            >
              Connexion
            </Link>


            <Link
              to="/register"
              className="hover:underline"
            >
              Inscription
            </Link>

          </div>

        )}

      </nav>

    </header>
  );
}

export default Header;