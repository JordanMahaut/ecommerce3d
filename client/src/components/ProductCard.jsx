function ProductCard({ product }) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">

      <img
        src={product.image || "/placeholder.png"}
        alt={product.name}
        className="h-48 w-full rounded-xl object-cover"
      />

      <h2 className="mt-4 text-xl font-bold">
        {product.name}
      </h2>

      <p className="mt-2 text-gray-600">
        {product.description}
      </p>

      <div className="mt-4 flex justify-between items-center">

        <span className="font-bold">
          {product.price} €
        </span>

        <button className="rounded-xl bg-black px-4 py-2 text-white">
          Ajouter
        </button>

      </div>

    </div>
  );
}

export default ProductCard;