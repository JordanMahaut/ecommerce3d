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
    <div className="space-y-24">
      {/* HERO */}
      <section className="rounded-3xl bg-gradient-to-r from-indigo-700 to-blue-600 px-8 py-24 text-center text-white">
        <h1 className="text-5xl font-extrabold">
          Impression 3D & Services Web
        </h1>

        <p className="mx-auto mt-6 max-w-3xl text-xl text-indigo-100">
          Fabrication de pièces 3D sur mesure, objets personnalisés, prototypes
          et développement de solutions web modernes.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <Link
            to="/shop"
            className="rounded-xl bg-white px-8 py-4 font-semibold text-indigo-700 transition hover:scale-105"
          >
            Découvrir la boutique
          </Link>

          <Link
            to="/contact"
            className="rounded-xl border border-white px-8 py-4 font-semibold transition hover:bg-white hover:text-indigo-700"
          >
            Demander un devis
          </Link>
        </div>
      </section>

      {/* AVANTAGES */}
      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border p-8 text-center shadow-sm">
          <div className="text-5xl">🚀</div>

          <h3 className="mt-4 text-xl font-bold">Fabrication rapide</h3>

          <p className="mt-3 text-slate-600">
            Impression rapide avec un contrôle qualité avant expédition.
          </p>
        </div>

        <div className="rounded-2xl border p-8 text-center shadow-sm">
          <div className="text-5xl">⭐</div>

          <h3 className="mt-4 text-xl font-bold">Qualité professionnelle</h3>

          <p className="mt-3 text-slate-600">
            Des impressions précises réalisées avec des matériaux de qualité.
          </p>
        </div>

        <div className="rounded-2xl border p-8 text-center shadow-sm">
          <div className="text-5xl">📦</div>

          <h3 className="mt-4 text-xl font-bold">Livraison</h3>

          <p className="mt-3 text-slate-600">
            Expédition dans toute la France avec suivi.
          </p>
        </div>
      </section>

      {/* PRODUITS */}
      <section>
        <div className="mb-10 flex items-center justify-between">
          <h2 className="text-3xl font-bold">Produits populaires</h2>

          <Link
            to="/shop"
            className="font-semibold text-indigo-600 hover:underline"
          >
            Voir toute la boutique →
          </Link>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {loading ? (
            <p className="col-span-full text-center text-slate-500">
              Chargement des produits...
            </p>
          ) : products.length === 0 ? (
            <p className="col-span-full text-center text-slate-500">
              Aucun produit disponible pour le moment.
            </p>
          ) : (
            products.map((product) => (
              <article
                key={product.id}
                className="overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
              >
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-56 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-56 items-center justify-center bg-slate-200 text-slate-500">
                    Aucune image
                  </div>
                )}

                <div className="space-y-3 p-5">
                  {product.category?.name && (
                    <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                      {product.category.name}
                    </p>
                  )}

                  <h3 className="font-bold">{product.name}</h3>

                  <p className="line-clamp-2 text-sm text-slate-500">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xl font-bold">
                      {Number(product.price).toFixed(2)} €
                    </span>

                    <Link
                      to={`/products/${product.slug}`}
                      className="rounded-lg bg-indigo-600 px-4 py-2 text-white transition hover:bg-indigo-700"
                    >
                      Voir
                    </Link>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-3xl bg-slate-900 px-10 py-20 text-center text-white">
        <h2 className="text-4xl font-bold">Une pièce personnalisée ?</h2>

        <p className="mx-auto mt-6 max-w-2xl text-slate-300">
          Envoyez-nous votre idée ou votre fichier STL et nous réalisons votre
          projet.
        </p>

        <Link
          to="/quote"
          className="mt-10 inline-block rounded-xl bg-indigo-600 px-8 py-4 font-semibold hover:bg-indigo-700"
        >
          Demander un devis
        </Link>
      </section>
    </div>
  );
}

export default Home;
