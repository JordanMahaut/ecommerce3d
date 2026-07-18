import { useEffect, useState } from "react";

import ProductTable from "../../components/admin/ProductTable";

import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";
import Modal from "../../components/ui/Modal";
import ProductForm from "../../components/admin/ProductForm";

import * as productService from "../../services/product.service";

function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  async function loadProducts() {
    try {
      const data = await productService.getProducts();
      setProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(data) {
    try {
      setSaving(true);

      await productService.createProduct(data);

      setOpen(false);

      loadProducts();
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Produits</h1>

          <p className="text-slate-500 mt-1">Gérez votre catalogue.</p>
        </div>

        <Button onClick={() => setOpen(true)}>+ Ajouter un produit</Button>
      </div>

      <Card>
        <Input
          placeholder="Rechercher un produit..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Card>

      {loading ? (
        <Spinner />
      ) : filteredProducts.length === 0 ? (
        <EmptyState
          title="Aucun produit"
          description="Commencez par créer votre premier produit."
        />
      ) : (
        <ProductTable
          products={filteredProducts}
          onEdit={(product) => console.log(product)}
          onDelete={(product) => console.log(product)}
        />
      )}

      <Modal
        open={open}
        title="Ajouter un produit"
        onClose={() => setOpen(false)}
      >
        <ProductForm
          onSubmit={handleCreate}
          onCancel={() => setOpen(false)}
          loading={saving}
        />
      </Modal>
    </section>
  );
}

export default Products;
