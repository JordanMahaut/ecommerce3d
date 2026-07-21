import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Header() {
  const { user, logout } = useAuth();

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
      <Link to="/shop" className="hover:text-indigo-600">
        Boutique
      </Link>

      <Link to="/cart" className="hover:text-indigo-600">
        Panier 🛒
      </Link>

      <Link to="/profile" className="hover:text-indigo-600">
        Bonjour Jordan 👋
      </Link>

      <button className="rounded-lg bg-slate-100 px-4 py-2 hover:bg-slate-200">
        Déconnexion
      </button>
    </nav>
  </div>
</header>
  );
}

export default Header;