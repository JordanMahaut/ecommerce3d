import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

function Header() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="text-2xl font-extrabold text-slate-900"
        >
          3D <span className="text-indigo-600">Factory</span>
        </Link>

        <nav className="flex items-center gap-7 text-sm font-semibold text-slate-700">
          <Link
            to="/shop"
            className="hover:text-indigo-600"
          >
            Boutique
          </Link>

          <Link
            to="/cart"
            className="relative hover:text-indigo-600"
          >
            Panier 🛒

            {totalItems > 0 && (
              <span className="absolute -right-4 -top-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1 text-xs font-bold text-white">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </Link>

          {user ? (
            <>
              <Link
                to="/profile"
                className="hover:text-indigo-600"
              >
                Bonjour {user.firstname} 👋
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg bg-slate-100 px-4 py-2 hover:bg-slate-200"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hover:text-indigo-600"
              >
                Connexion
              </Link>

              <Link
                to="/register"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
              >
                Inscription
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;