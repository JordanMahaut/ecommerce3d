function Dashboard() {
  const stats = [
    { label: "Produits", value: 0 },
    { label: "Commandes", value: 0 },
    { label: "Utilisateurs", value: 0 },
    { label: "Devis", value: 0 },
  ];

  return (
    <section>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Tableau de bord
        </h1>

        <p className="mt-2 text-slate-500">
          Gérez votre boutique et vos services.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <article
            key={stat.label}
            className="rounded-2xl border bg-white p-6 shadow-sm"
          >
            <p className="text-sm text-slate-500">
              {stat.label}
            </p>

            <p className="mt-3 text-3xl font-bold text-slate-900">
              {stat.value}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Dashboard;