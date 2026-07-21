import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProducts } from "../services/product.service";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts();
        setProducts(data.slice(0, 4));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  return (
    <div className="bg-slate-50">
      <div className="mx-auto max-w-7xl space-y-24 px-4 py-10 sm:px-6 lg:px-8">

        {/* HERO */}
        <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-700 via-blue-600 to-cyan-500 px-6 py-20 text-center text-white shadow-2xl shadow-blue-200 sm:px-12 lg:py-28">
          <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-cyan-300/20 blur-3xl" />

          <div className="relative mx-auto max-w-4xl">
            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur">
              Créations 3D et solutions web sur mesure
            </span>

            <h1 className="mt-8 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Donnez vie à vos idées
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-blue-50 sm:text-xl">
              Impression 3D personnalisée, prototypes, objets décoratifs et
              développement de solutions web modernes.
            </p>

            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                to="/shop"
                className="rounded-xl bg-white px-8 py-4 font-bold text-indigo-700 shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
              >
                Découvrir la boutique
              </Link>

              <Link
                to="/quote"
                className="rounded-xl border border-white/70 bg-white/10 px-8 py-4 font-bold text-white backdrop-blur transition hover:bg-white hover:text-indigo-700"
              >
                Demander un devis
              </Link>
            </div>
          </div>
        </section>

        {/* AVANTAGES */}
        <section>
          <div className="mb-10 text-center">
            <p className="font-semibold text-indigo-600">
              Pourquoi nous choisir ?
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              Un service pensé pour vos projets
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <article className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm transition hover:-translate-y-2 hover:shadow-xl">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 text-3xl">
                🚀
              </div>

              <h3 className="mt-6 text-xl font-bold text-slate-900">
                Fabrication rapide
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                Impression rapide avec un contrôle qualité avant chaque
                expédition.
              </p>
            </article>

            <article className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm transition hover:-translate-y-2 hover:shadow-xl">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-3xl">
                ⭐
              </div>

              <h3 className="mt-6 text-xl font-bold text-slate-900">
                Qualité professionnelle
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                Des impressions précises réalisées avec des matériaux
                sélectionnés.
              </p>
            </article>

            <article className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm transition hover:-translate-y-2 hover:shadow-xl">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-3xl">
                📦
              </div>

              <h3 className="mt-6 text-xl font-bold text-slate-900">
                Livraison suivie
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                Expédition dans toute la France avec emballage soigné et suivi.
              </p>
            </article>
          </div>
        </section>

        {/* PRODUITS */}
        <section>
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="font-semibold text-indigo-600">
                Nos créations
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                Produits populaires
              </h2>

              <p className="mt-3 text-slate-500">
                Découvrez une sélection de nos dernières impressions 3D.
              </p>
            </div>

            <Link
              to="/shop"
              className="font-semibold text-indigo-600 transition hover:text-indigo-800"
            >
              Voir toute la boutique →
            </Link>
          </div>

          {loading ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="animate-pulse overflow-hidden rounded-3xl border border-slate-200 bg-white"
                >
                  <div className="h-56 bg-slate-200" />

                  <div className="space-y-4 p-5">
                    <div className="h-5 rounded bg-slate-200" />
                    <div className="h-4 rounded bg-slate-200" />
                    <div className="h-10 rounded bg-slate-200" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <p className="text-lg font-semibold text-slate-700">
                Aucun produit disponible
              </p>

              <p className="mt-2 text-slate-500">
                De nouvelles créations seront bientôt ajoutées.
              </p>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <article
                  key={product.id}
                  className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-2 hover:shadow-2xl"
                >
                  <Link
                    to={`/products/${product.slug}`}
                    className="block overflow-hidden bg-slate-100"
                  >
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-56 items-center justify-center text-5xl text-slate-400">
                        📦
                      </div>
                    )}
                  </Link>

                  <div className="p-5">
                    {product.category?.name && (
                      <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                        {product.category.name}
                      </p>
                    )}

                    <Link
                      to={`/products/${product.slug}`}
                      className="mt-2 block"
                    >
                      <h3 className="text-lg font-bold text-slate-900 transition group-hover:text-indigo-600">
                        {product.name}
                      </h3>
                    </Link>

                    <p className="mt-3 line-clamp-2 min-h-10 text-sm leading-6 text-slate-500">
                      {product.description}
                    </p>

                    <div className="mt-6 flex items-center justify-between gap-4">
                      <span className="text-2xl font-extrabold text-slate-900">
                        {Number(product.price).toFixed(2)} €
                      </span>

                      <Link
                        to={`/products/${product.slug}`}
                        className="rounded-xl bg-indigo-600 px-4 py-2.5 font-semibold text-white transition hover:bg-indigo-700"
                      >
                        Voir
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* CTA */}
        <section className="overflow-hidden rounded-[2rem] bg-slate-900 px-6 py-20 text-center text-white shadow-2xl sm:px-12">
          <div className="mx-auto max-w-3xl">
            <p className="font-semibold text-indigo-300">
              Projet personnalisé
            </p>

            <h2 className="mt-3 text-4xl font-bold">
              Une pièce unique à réaliser ?
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Envoyez-nous votre idée ou votre fichier STL. Nous étudions votre
              projet et vous proposons une solution adaptée.
            </p>

            <Link
              to="/quote"
              className="mt-10 inline-flex rounded-xl bg-indigo-600 px-8 py-4 font-bold text-white shadow-lg shadow-indigo-950/40 transition hover:-translate-y-1 hover:bg-indigo-500"
            >
              Demander un devis
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;