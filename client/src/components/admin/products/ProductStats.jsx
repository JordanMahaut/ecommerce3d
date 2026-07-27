import Card from "../../ui/Card";
import { formatPrice } from "../../../utils/formatters";

function ProductStats({ products = [] }) {
  const safeProducts = Array.isArray(products) ? products : [];

  const totalProducts = safeProducts.length;

  const totalStock = safeProducts.reduce(
    (total, product) => total + (Number(product.stock) || 0),
    0,
  );

  const lowStockProducts = safeProducts.filter((product) => {
    const stock = Number(product.stock) || 0;

    return stock > 0 && stock <= 5;
  }).length;

  const outOfStockProducts = safeProducts.filter(
    (product) => (Number(product.stock) || 0) <= 0,
  ).length;

  const stockValue = safeProducts.reduce((total, product) => {
    const price = Number(product.price) || 0;
    const stock = Number(product.stock) || 0;

    return total + price * stock;
  }, 0);

  const stats = [
    {
      label: "Produits",
      value: totalProducts,
      icon: "📦",
    },
    {
      label: "Unités en stock",
      value: totalStock,
      icon: "🏭",
    },
    {
      label: "Stock faible",
      value: lowStockProducts,
      icon: "⚠️",
    },
    {
      label: "Ruptures",
      value: outOfStockProducts,
      icon: "🚫",
    },
    {
      label: "Valeur du stock",
      value: formatPrice(stockValue),
      icon: "💶",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">
                {stat.label}
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {stat.value}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-2xl">
              {stat.icon}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

export default ProductStats;