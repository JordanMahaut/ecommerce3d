import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { getProducts } from "../services/product.service";

function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [category, setCategory] = useState("all");

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Erreur lors du chargement des produits :", error);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const categories = useMemo(() => {
    const values = products
      .map((product) => product.category?.name)
      .filter(Boolean);

    return [...new Set(values)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (search.trim()) {
      list = list.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (category !== "all") {
      list = list.filter(
        (product) => product.category?.name === category,
      );
    }

    switch (sort) {
      case "price-asc":
        list.sort((a, b) => Number(a.price) - Number(b.price));
        break;

      case "price-desc":
        list.sort((a, b) => Number(b.price) - Number(a.price));
        break;

      case "name":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;

      default:
        list.sort(
          (a, b) =>
            new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
        );
    }

    return list;
  }, [products, search, sort, category]);

  return (
    <div className="bg-slate-50">
      <div className="mx-auto min-h-[calc(100vh-160px)] max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

        {/* EN-TÊTE */}
        <div className="mb-10">
          <p className="font-semibold text-indigo-600">
            Nos créations
          </p>

          <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Boutique
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-500">
            Découvrez nos impressions 3D, objets personnalisés et créations
            fabriquées avec soin.
          </p>
        </div>

        {/* FILTRES */}
        <div className="mb-10 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 lg:grid-cols-[1fr_240px_240px]">
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                🔍
              </span>

              <input
                type="search"
                placeholder="Rechercher un produit..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
              />
            </div>

            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            >
              <option value="all">Toutes les catégories</option>

              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            >
              <option value="newest">Plus récents</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="name">Nom de A à Z</option>
            </select>
          </div>
        </div>

        {/* RÉSULTATS */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            {filteredProducts.length} produit
            {filteredProducts.length > 1 ? "s" : ""} trouvé
            {filteredProducts.length > 1 ? "s" : ""}
          </p>

          {(search || category !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCategory("all");
              }}
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-800"
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>

        {/* CONTENU */}
        {loading ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="animate-pulse overflow-hidden rounded-3xl border border-slate-200 bg-white"
              >
                <div className="h-64 bg-slate-200" />

                <div className="space-y-4 p-5">
                  <div className="h-4 w-24 rounded bg-slate-200" />
                  <div className="h-6 rounded bg-slate-200" />
                  <div className="h-4 rounded bg-slate-200" />
                  <div className="h-12 rounded bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-4xl">
              🔍
            </div>

            <h2 className="mt-6 text-2xl font-bold text-slate-900">
              Aucun produit trouvé
            </h2>

            <p className="mt-3 text-slate-500">
              Essayez de modifier votre recherche ou vos filtres.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCategory("all");
              }}
              className="mt-6 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700"
            >
              Réinitialiser
            </button>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <article
                key={product.id}
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                <Link
                  to={`/products/${product.slug}`}
                  className="relative block overflow-hidden bg-slate-100"
                >
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-64 items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                      <div className="text-center">
                        <div className="text-5xl">📦</div>
                        <p className="mt-3 text-sm font-medium text-slate-500">
                          Aucune image
                        </p>
                      </div>
                    </div>
                  )}

                  {product.featured && (
                    <span className="absolute left-4 top-4 rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-amber-950 shadow">
                      Populaire
                    </span>
                  )}

                  {product.stock === 0 && (
                    <span className="absolute right-4 top-4 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white shadow">
                      Rupture
                    </span>
                  )}
                </Link>

                <div className="flex min-h-64 flex-col p-5">
                  {product.category?.name && (
                    <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                      {product.category.name}
                    </p>
                  )}

                  <Link
                    to={`/products/${product.slug}`}
                    className="mt-2 block"
                  >
                    <h2 className="text-xl font-bold text-slate-900 transition group-hover:text-indigo-600">
                      {product.name}
                    </h2>
                  </Link>

                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">
                    {product.description || "Aucune description disponible."}
                  </p>

                  <div className="mt-auto pt-6">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-2xl font-extrabold text-slate-900">
                        {Number(product.price).toFixed(2)} €
                      </span>

                      <span
                        className={`text-xs font-semibold ${
                          product.stock > 0
                            ? "text-emerald-600"
                            : "text-red-600"
                        }`}
                      >
                        {product.stock > 0
                          ? `${product.stock} en stock`
                          : "Indisponible"}
                      </span>
                    </div>

                    <Link
                      to={`/products/${product.slug}`}
                      className="flex w-full items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
                    >
                      Voir le produit
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Shop;