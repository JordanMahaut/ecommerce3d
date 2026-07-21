import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Cart() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    totalItems,
    totalPrice,
  } = useCart();

  if (cart.length === 0) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-24 text-center">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-indigo-100 text-5xl">
          🛒
        </div>

        <h1 className="mt-8 text-4xl font-bold text-slate-900">
          Votre panier est vide
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-lg text-slate-500">
          Découvrez nos impressions 3D et ajoutez vos produits préférés.
        </p>

        <Link
          to="/shop"
          className="mt-8 inline-flex rounded-xl bg-indigo-600 px-8 py-4 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-1 hover:bg-indigo-700"
        >
          Découvrir la boutique
        </Link>
      </section>
    );
  }

  return (
    <section className="bg-slate-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="font-semibold text-indigo-600">
            Votre sélection
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
            Mon panier
          </h1>

          <p className="mt-3 text-slate-500">
            {totalItems} article{totalItems > 1 ? "s" : ""} dans votre panier
          </p>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_390px]">
          <div className="space-y-5">
            {cart.map((item) => {
              const itemTotal = Number(item.price) * item.quantity;

              return (
                <article
                  key={item.id}
                  className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-lg"
                >
                  <div className="flex flex-col gap-5 sm:flex-row">
                    <Link
                      to={`/products/${item.slug}`}
                      className="shrink-0 overflow-hidden rounded-2xl bg-slate-100"
                    >
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-44 w-full object-cover transition duration-300 group-hover:scale-105 sm:w-44"
                        />
                      ) : (
                        <div className="flex h-44 w-full items-center justify-center text-4xl text-slate-400 sm:w-44">
                          📦
                        </div>
                      )}
                    </Link>

                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          {item.category?.name && (
                            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-indigo-600">
                              {item.category.name}
                            </p>
                          )}

                          <Link
                            to={`/products/${item.slug}`}
                            className="text-xl font-bold text-slate-900 transition hover:text-indigo-600"
                          >
                            {item.name}
                          </Link>

                          <p className="mt-2 text-sm text-slate-500">
                            Prix unitaire : {Number(item.price).toFixed(2)} €
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                          aria-label={`Supprimer ${item.name}`}
                          title="Supprimer"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="mt-auto flex flex-col gap-4 pt-6 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                          <p className="mb-2 text-sm font-medium text-slate-600">
                            Quantité
                          </p>

                          <div className="inline-flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="flex h-9 w-9 items-center justify-center rounded-lg text-lg font-semibold text-slate-700 transition hover:bg-white hover:shadow-sm"
                              aria-label="Diminuer la quantité"
                            >
                              −
                            </button>

                            <span className="w-10 text-center font-bold text-slate-900">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              disabled={
                                item.stock !== undefined &&
                                item.quantity >= item.stock
                              }
                              className="flex h-9 w-9 items-center justify-center rounded-lg text-lg font-semibold text-slate-700 transition hover:bg-white hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-40"
                              aria-label="Augmenter la quantité"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="text-left sm:text-right">
                          <p className="text-sm text-slate-500">
                            Sous-total
                          </p>

                          <p className="mt-1 text-2xl font-bold text-slate-900">
                            {itemTotal.toFixed(2)} €
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}

            <Link
              to="/shop"
              className="inline-flex items-center gap-2 font-semibold text-indigo-600 transition hover:text-indigo-700"
            >
              ← Continuer mes achats
            </Link>
          </div>

          <aside className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/60 lg:sticky lg:top-28">
            <h2 className="text-2xl font-bold text-slate-900">
              Résumé de la commande
            </h2>

            <div className="mt-7 space-y-4 text-slate-600">
              <div className="flex justify-between">
                <span>
                  Sous-total ({totalItems} article{totalItems > 1 ? "s" : ""})
                </span>

                <span className="font-semibold text-slate-900">
                  {totalPrice.toFixed(2)} €
                </span>
              </div>

              <div className="flex justify-between">
                <span>Livraison</span>

                <span className="font-semibold text-emerald-600">
                  Calculée à l’étape suivante
                </span>
              </div>

              <div className="border-t border-slate-200 pt-5">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-lg font-bold text-slate-900">
                      Total
                    </p>

                    <p className="text-xs text-slate-400">
                      Taxes incluses
                    </p>
                  </div>

                  <span className="text-3xl font-extrabold text-slate-900">
                    {totalPrice.toFixed(2)} €
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="mt-8 w-full rounded-xl bg-indigo-600 px-6 py-4 text-lg font-bold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700"
            >
              Passer la commande
            </button>

            <div className="mt-5 flex items-center justify-center gap-2 text-sm text-slate-500">
              <span>🔒</span>
              <span>Paiement sécurisé</span>
            </div>

            <div className="mt-6 rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-700">
                Besoin d’une création sur mesure ?
              </p>

              <Link
                to="/quote"
                className="mt-2 inline-block text-sm font-semibold text-indigo-600 hover:underline"
              >
                Demander un devis →
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

export default Cart;