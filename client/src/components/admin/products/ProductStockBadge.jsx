function ProductStockBadge({ stock }) {
  const numericStock = Number(stock) || 0;

  if (numericStock <= 0) {
    return (
      <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
        Rupture
      </span>
    );
  }

  if (numericStock <= 5) {
    return (
      <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
        Stock faible : {numericStock}
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
      En stock : {numericStock}
    </span>
  );
}

export default ProductStockBadge;