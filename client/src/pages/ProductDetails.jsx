import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getProductBySlug } from "../services/product.service";
import { useCart } from "../context/CartContext";

function ProductDetails() {
  const { slug } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [cartMessage, setCartMessage] = useState("");
  const [cartError, setCartError] = useState("");

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        setError("");

        const data = await getProductBySlug(slug);

        setProduct(data);
        setQuantity(1);
      } catch (error) {
        console.error("Erreur chargement produit :", error);

        setError(
          error.response?.data?.message ||
            "Impossible de charger ce produit.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [slug]);

  function decreaseQuantity() {
    setQuantity((currentQuantity) =>
      Math.max(1, currentQuantity - 1),
    );
  }

  function increaseQuantity() {
    if (!product) {
      return;
    }

    setQuantity((currentQuantity) =>
      Math.min(Number(product.stock), currentQuantity + 1),
    );
  }

  function handleAddToCart() {
    setCartMessage("");
    setCartError("");

    const result = addToCart(product, quantity);

    if (!result?.success) {
      setCartError(
        result?.message || "Impossible d’ajouter ce produit au panier.",
      );

      return;
    }

    setCartMessage(result.message || "Produit ajouté au panier.");
  }

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid animate-pulse gap-12 lg:grid-cols-2">
          <div className="h-[500px] rounded-3xl bg-slate-200" />

          <div className="space-y-6">
            <div className="h-8 w-32 rounded-full bg-slate-200" />
            <div className="h-14 rounded bg-slate-200" />
            <div className="h-24 rounded bg-slate-200" />
            <div className="h-12 w-40 rounded bg-slate-200" />
            <div className="h-14 rounded-xl bg-slate-200" />
          </div>
        </div>
      </section>
    );
  }

  if (error || !product) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-24 text-center">
        <div className="text-6xl">📦</div>

        <h1 className="mt-6 text-3xl font-bold text-slate-900">
          Produit introuvable
        </h1>

        <p className="mt-3 text-slate-500">
          {error || "Ce produit n’existe pas ou n’est plus disponible."}
        </p>

        <Link
          to="/shop"
          className="mt-8 inline-flex rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
        >
          Retour à la boutique
        </Link>
      </section>
    );
  }

  const isOutOfStock = Number(product.stock) <= 0;

  return (
    <section className="bg-slate-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          to="/shop"
          className="mb-8 inline-flex font-semibold text-indigo-600 transition hover:text-indigo-800"
        >
          ← Retour à la boutique
        </Link>

        <div className="grid gap-12 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:grid-cols-2 lg:p-10">
          <div>
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="h-full max-h-[650px] w-full rounded-3xl border border-slate-200 object-cover"
              />
            ) : (
              <div className="flex min-h-[500px] items-center justify-center rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200">
                <div className="text-center">
                  <div className="text-7xl">📦</div>

                  <p className="mt-4 font-medium text-slate-500">
                    Aucune image disponible
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <div className="space-y-6">
              {product.category?.name && (
                <span className="inline-block rounded-full bg-indigo-100 px-4 py-2 text-sm font-semibold text-indigo-700">
                  {product.category.name}
                </span>
              )}

              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                {product.name}
              </h1>

              <p className="text-lg leading-8 text-slate-600">
                {product.description || "Aucune description disponible."}
              </p>

              <div className="text-4xl font-extrabold text-indigo-600">
                {Number(product.price).toLocaleString("fr-FR", {
                  style: "currency",
                  currency: "EUR",
                })}
              </div>

              <div>
                {isOutOfStock ? (
                  <span className="inline-flex rounded-full bg-red-100 px-4 py-2 text-sm font-bold text-red-700">
                    Rupture de stock
                  </span>
                ) : (
                  <span className="inline-flex rounded-full bg-emerald-100 px-4 py-2 text-sm font-bold text-emerald-700">
                    {product.stock} exemplaire
                    {Number(product.stock) > 1 ? "s" : ""} disponible
                    {Number(product.stock) > 1 ? "s" : ""}
                  </span>
                )}
              </div>

              {!isOutOfStock && (
                <div>
                  <p className="mb-3 text-sm font-semibold text-slate-700">
                    Quantité
                  </p>

                  <div className="inline-flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1">
                    <button
                      type="button"
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                      className="flex h-11 w-11 items-center justify-center rounded-lg text-xl font-semibold text-slate-700 transition hover:bg-white hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Diminuer la quantité"
                    >
                      −
                    </button>

                    <span className="w-14 text-center text-lg font-bold text-slate-900">
                      {quantity}
                    </span>

                    <button
                      type="button"
                      onClick={increaseQuantity}
                      disabled={quantity >= Number(product.stock)}
                      className="flex h-11 w-11 items-center justify-center rounded-lg text-xl font-semibold text-slate-700 transition hover:bg-white hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Augmenter la quantité"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {cartError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {cartError}
                </div>
              )}

              {cartMessage && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                  {cartMessage}
                </div>
              )}
            </div>

            <div className="mt-8">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="w-full rounded-xl bg-indigo-600 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
              >
                {isOutOfStock
                  ? "Produit indisponible"
                  : `Ajouter ${quantity > 1 ? `${quantity} articles` : "au panier"}`}
              </button>

              <div className="mt-5 flex items-center justify-center gap-2 text-sm text-slate-500">
                <span>🔒</span>
                <span>Paiement sécurisé</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductDetails;