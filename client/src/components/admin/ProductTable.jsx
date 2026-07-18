import Table from "../ui/Table";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

import { Pencil, Trash2 } from "lucide-react";

function ProductTable({
  products,
  onEdit,
  onDelete,
}) {
  if (!products.length) {
    return (
      <div className="rounded-xl border border-dashed p-10 text-center text-slate-500">
        Aucun produit.
      </div>
    );
  }

  return (
    <Table>
      <thead className="bg-slate-100">

        <tr>

          <th className="px-5 py-4 text-left">
            Image
          </th>

          <th className="px-5 py-4 text-left">
            Produit
          </th>

          <th className="px-5 py-4 text-left">
            Prix
          </th>

          <th className="px-5 py-4 text-left">
            Stock
          </th>

          <th className="px-5 py-4 text-left">
            Statut
          </th>

          <th className="px-5 py-4 text-center">
            Actions
          </th>

        </tr>

      </thead>

      <tbody>

        {products.map((product) => (

          <tr
            key={product.id}
            className="border-t"
          >

            <td className="px-5 py-4">

              {product.image ? (

                <img
                  src={product.image}
                  alt={product.name}
                  className="h-14 w-14 rounded-lg object-cover"
                />

              ) : (

                <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-slate-200">
                  📦
                </div>

              )}

            </td>

            <td className="px-5 py-4 font-medium">
              {product.name}
            </td>

            <td className="px-5 py-4">
              {product.price.toFixed(2)} €
            </td>

            <td className="px-5 py-4">
              {product.stock}
            </td>

            <td className="px-5 py-4">

              <Badge
                color={product.isActive ? "green" : "red"}
              >
                {product.isActive ? "Actif" : "Inactif"}
              </Badge>

            </td>

            <td className="px-5 py-4">

              <div className="flex justify-center gap-2">

                <Button
                  variant="secondary"
                  onClick={() => onEdit(product)}
                >
                  <Pencil size={18} />
                </Button>

                <Button
                  variant="danger"
                  onClick={() => onDelete(product)}
                >
                  <Trash2 size={18} />
                </Button>

              </div>

            </td>

          </tr>

        ))}

      </tbody>

    </Table>
  );
}

export default ProductTable;