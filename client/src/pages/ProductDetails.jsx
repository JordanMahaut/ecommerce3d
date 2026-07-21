import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getProductBySlug } from "../services/product.service";
import { useCart } from "../context/CartContext";

function ProductDetails() {
  const { slug } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    async function loadProduct() {
      try {
        const data = await getProductBySlug(slug);
        setProduct(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [slug]);

  if (loading) {
    return <div className="py-20 text-center">Chargement...</div>;
  }

  if (!product) {
    return <div className="py-20 text-center">Produit introuvable.</div>;
  }

  return (
    <section className="grid gap-12 lg:grid-cols-2">
      <div>
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full rounded-3xl border object-cover"
          />
        ) : (
          <div className="flex h-[500px] items-center justify-center rounded-3xl bg-slate-200">
            Aucune image
          </div>
        )}
      </div>

      <div className="space-y-6">
        {product.category && (
          <span className="inline-block rounded-full bg-indigo-100 px-4 py-2 text-sm font-semibold text-indigo-700">
            {product.category.name}
          </span>
        )}

        <h1 className="text-5xl font-bold">{product.name}</h1>

        <p className="text-lg text-slate-600">{product.description}</p>

        <div className="text-4xl font-bold text-indigo-600">
          {Number(product.price).toFixed(2)} €
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="rounded-lg border px-3 py-2"
          >
            -
          </button>

          <span className="w-10 text-center font-bold">{quantity}</span>

          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="rounded-lg border px-3 py-2"
          >
            +
          </button>
        </div>

        <p>
          Stock :<span className="ml-2 font-bold">{product.stock}</span>
        </p>

        <button
          onClick={() => addToCart(product, quantity)}
          className="rounded-xl bg-indigo-600 px-8 py-4 text-lg font-semibold text-white hover:bg-indigo-700"
        >
          Ajouter au panier
        </button>
      </div>
    </section>
  );
}

export default ProductDetails;
