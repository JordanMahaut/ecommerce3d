import Card from "../../ui/Card";
import Input from "../../ui/Input";

function ProductFilters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  stockStatus,
  onStockStatusChange,
  categories = [],
}) {
  const safeCategories = Array.isArray(categories) ? categories : [];

  return (
    <Card>
      <div className="grid gap-4 md:grid-cols-3">
        <Input
          placeholder="Rechercher un produit..."
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />

        <select
          value={category}
          onChange={(event) => onCategoryChange(event.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        >
          <option value="">Toutes les catégories</option>

          {safeCategories.map((item) => (
            <option key={item.id} value={String(item.id)}>
              {item.name}
            </option>
          ))}
        </select>

        <select
          value={stockStatus}
          onChange={(event) => onStockStatusChange(event.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        >
          <option value="">Tous les stocks</option>
          <option value="IN_STOCK">En stock</option>
          <option value="LOW_STOCK">Stock faible</option>
          <option value="OUT_OF_STOCK">Rupture de stock</option>
        </select>
      </div>
    </Card>
  );
}

export default ProductFilters;