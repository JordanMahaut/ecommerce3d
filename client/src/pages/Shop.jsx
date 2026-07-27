import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { getProducts } from "../services/product.service";

function normalizeProductsResponse(response) {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.products)) {
    return response.products;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  if (Array.isArray(response?.data?.products)) {
    return response.data.products;
  }

  return [];
}

function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [category, setCategory] = useState("all");

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      try {
        setLoading(true);
        setError("");

        const response = await getProducts();
        const productList = normalizeProductsResponse(response);

        console.log("Réponse produits :", response);
        console.log("Produits normalisés :", productList);

        if (isMounted) {
          setProducts(productList);
        }
      } catch (requestError) {
        console.error(
          "Erreur lors du chargement des produits :",
          requestError.response?.data || requestError,
        );

        if (isMounted) {
          setProducts([]);

          setError(
            requestError.response?.data?.message ||
              "Impossible de charger les produits.",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const activeProducts = useMemo(() => {
    return products.filter(
      (product) => product && product.isActive !== false,
    );
  }, [products]);

  const categories = useMemo(() => {
    const categoryNames = activeProducts
      .map((product) => product.category?.name)
      .filter(Boolean);

    return [...new Set(categoryNames)].sort((a, b) =>
      a.localeCompare(b, "fr", {
        sensitivity: "base",
      }),
    );
  }, [activeProducts]);

  const filteredProducts = useMemo(() => {
    let productList = [...activeProducts];

    const normalizedSearch = search.trim().toLowerCase();

    if (normalizedSearch) {
      productList = productList.filter((product) => {
        const name = String(product.name || "").toLowerCase();
        const description = String(
          product.description || "",
        ).toLowerCase();
        const productCategory = String(
          product.category?.name || "",
        ).toLowerCase();

        return (
          name.includes(normalizedSearch) ||
          description.includes(normalizedSearch) ||
          productCategory.includes(normalizedSearch)
        );
      });
    }

    if (category !== "all") {
      productList = productList.filter(
        (product) => product.category?.name === category,
      );
    }

    switch (sort) {
      case "price-asc":
        productList.sort(
          (firstProduct, secondProduct) =>
            Number(firstProduct.price || 0) -
            Number(secondProduct.price || 0),
        );
        break;

      case "price-desc":
        productList.sort(
          (firstProduct, secondProduct) =>
            Number(secondProduct.price || 0) -
            Number(firstProduct.price || 0),
        );
        break;

      case "name":
        productList.sort((firstProduct, secondProduct) =>
          String(firstProduct.name || "").localeCompare(
            String(secondProduct.name || ""),
            "fr",
            {
              sensitivity: "base",
            },
          ),
        );
        break;

      case "newest":
      default:
        productList.sort(
          (firstProduct, secondProduct) =>
            new Date(secondProduct.createdAt || 0).getTime() -
            new Date(firstProduct.createdAt || 0).getTime(),
        );
        break;
    }

    return productList;
  }, [activeProducts, search, sort, category]);

  function resetFilters() {
    setSearch("");
    setCategory("all");
    setSort("newest");
  }

  return (
    <div className="bg-slate-50">
      <div className="mx-auto min-h-[calc(100vh-160px)] max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="mb-10">
          <p className="font-semibold text-indigo-600">
            Nos créations
          </p>

          <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Boutique
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-500">
            Découvrez nos impressions 3D, objets personnalisés et
            créations fabriquées avec soin.
          </p>
        </div>

        {/* Message d'erreur */}
        {error && (
          <div
            role="alert"
            className="mb-8 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700"
          >
            <p className="font-semibold">
              Erreur de chargement
            </p>

            <p className="mt-1 text-sm">{error}</p>
          </div>
        )}

        {/* Filtres */}
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
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
              />
            </div>

            <select
              value={category}
              onChange={(event) =>
                setCategory(event.target.value)
              }
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            >
              <option value="all">
                Toutes les catégories
              </option>

              {categories.map((categoryName) => (
                <option
                  key={categoryName}
                  value={categoryName}
                >
                  {categoryName}
                </option>
              ))}
            </select>

            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            >
              <option value="newest">Plus récents</option>
              <option value="price-asc">
                Prix croissant
              </option>
              <option value="price-desc">
                Prix décroissant
              </option>
              <option value="name">Nom de A à Z</option>
            </select>
          </div>
        </div>

        {/* Nombre de résultats */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-500">
            {filteredProducts.length}{" "}
            {filteredProducts.length > 1
              ? "produits trouvés"
              : "produit trouvé"}
          </p>

          {(search ||
            category !== "all" ||
            sort !== "newest") && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-800"
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>

        {/* Chargement */}
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
          /* Aucun produit */
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-4xl">
              🔍
            </div>

            <h2 className="mt-6 text-2xl font-bold text-slate-900">
              Aucun produit trouvé
            </h2>

            <p className="mt-3 text-slate-500">
              {products.length === 0
                ? "Aucun produit n’est actuellement disponible dans la boutique."
                : "Essayez de modifier votre recherche ou vos filtres."}
            </p>

            {(search || category !== "all") && (
              <button
                type="button"
                onClick={resetFilters}
                className="mt-6 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
              >
                Réinitialiser
              </button>
            )}
          </div>
        ) : (
          /* Liste des produits */
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => {
              const stock = Number(product.stock || 0);
              const price = Number(product.price || 0);

              return (
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
                        loading="lazy"
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

                    {stock <= 0 && (
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
                      {product.description ||
                        "Aucune description disponible."}
                    </p>

                    <div className="mt-auto pt-6">
                      <div className="mb-4 flex items-center justify-between gap-4">
                        <span className="text-2xl font-extrabold text-slate-900">
                          {price.toLocaleString("fr-FR", {
                            style: "currency",
                            currency: "EUR",
                          })}
                        </span>

                        <span
                          className={`text-right text-xs font-semibold ${
                            stock > 0
                              ? "text-emerald-600"
                              : "text-red-600"
                          }`}
                        >
                          {stock > 0
                            ? `${stock} en stock`
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
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Shop;