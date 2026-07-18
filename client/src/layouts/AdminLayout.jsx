import { NavLink, Outlet } from "react-router-dom";

function AdminLayout() {
  const linkClass = ({ isActive }) =>
    `block rounded-lg px-4 py-3 transition ${
      isActive
        ? "bg-black text-white"
        : "text-slate-600 hover:bg-slate-100"
    }`;

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
        <aside className="border-r bg-white p-6">
          <h1 className="mb-8 text-2xl font-bold">
            3D Factory Admin
          </h1>

          <nav className="space-y-2">
            <NavLink to="/admin" end className={linkClass}>
              Tableau de bord
            </NavLink>

            <NavLink to="/admin/products" className={linkClass}>
              Produits
            </NavLink>

            <NavLink to="/admin/categories" className={linkClass}>
              Catégories
            </NavLink>

            <NavLink to="/admin/orders" className={linkClass}>
              Commandes
            </NavLink>

            <NavLink to="/admin/users" className={linkClass}>
              Utilisateurs
            </NavLink>

            <NavLink to="/admin/quotes" className={linkClass}>
              Devis
            </NavLink>

            <NavLink to="/" className={linkClass}>
              Retour au site
            </NavLink>
          </nav>
        </aside>

        <main className="p-6 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;