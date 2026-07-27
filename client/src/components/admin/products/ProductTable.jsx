import Button from "../../ui/Button";
import ProductStockBadge from "./ProductStockBadge";
import { formatPrice } from "../../../utils/formatters";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

function getImageUrl(image) {
  if (!image) {
    return null;
  }

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  if (image.startsWith("/")) {
    return `${API_URL}${image}`;
  }

  return `${API_URL}/${image}`;
}

function ProductTable({
  products = [],
  onEdit = () => {},
  onDelete = () => {},
  deletingId = null,
}) {
  const safeProducts = Array.isArray(products) ? products : [];

  if (safeProducts.length === 0) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                Produit
              </th>

              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                Catégorie
              </th>

              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                Prix
              </th>

              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                Stock
              </th>

              <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {safeProducts.map((product) => {
              const imageUrl = getImageUrl(product.image);

              return (
                <tr
                  key={product.id}
                  className="transition hover:bg-slate-50"
                >
                  <td className="px-6 py-4">
                    <div className="flex min-w-64 items-center gap-4">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={product.name || "Produit"}
                          className="h-14 w-14 rounded-xl border border-slate-200 object-cover"
                          onError={(event) => {
                            event.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-2xl">
                          📦
                        </div>
                      )}

                      <div>
                        <p className="font-semibold text-slate-900">
                          {product.name || "Produit sans nom"}
                        </p>

                        {product.slug && (
                          <p className="mt-1 text-xs text-slate-500">
                            {product.slug}
                          </p>
                        )}

                        {product.featured && (
                          <span className="mt-2 inline-flex rounded-full bg-indigo-100 px-2 py-1 text-xs font-semibold text-indigo-700">
                            Produit vedette
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {product.category?.name || "Sans catégorie"}
                  </td>

                  <td className="px-6 py-4 font-semibold text-slate-900">
                    {formatPrice(product.price)}
                  </td>

                  <td className="px-6 py-4">
                    <ProductStockBadge stock={product.stock} />
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => onEdit(product)}
                      >
                        Modifier
                      </Button>

                      <Button
                        type="button"
                        variant="danger"
                        disabled={deletingId === product.id}
                        onClick={() => onDelete(product)}
                      >
                        {deletingId === product.id
                          ? "Suppression..."
                          : "Supprimer"}
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProductTable;