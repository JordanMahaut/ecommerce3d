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
  const [selectedProduct, setSelectedProduct] = useState(null);

  async function loadProducts() {
    try {
      setLoading(true);

      const data = await productService.getProducts();

      setProducts(data);
    } catch (error) {
      console.error(
        "Erreur chargement produits :",
        error.response?.data || error,
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(data) {
    try {
      setSaving(true);

      if (selectedProduct) {
        await productService.updateProduct(
          selectedProduct.id,
          data,
        );
      } else {
        await productService.createProduct(data);
      }

      await loadProducts();

      setOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      const response = error.response?.data;

      console.error(
        selectedProduct
          ? "Erreur modification produit :"
          : "Erreur création produit :",
        response || error,
      );

      if (response?.errors) {
        response.errors.forEach((issue) => {
          console.error(
            `${issue.path?.join(".") || "champ"} : ${issue.message}`,
          );
        });
      }
    } finally {
      setSaving(false);
    }
  }

  function handleCloseModal() {
    if (saving) return;

    setOpen(false);
    setSelectedProduct(null);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name
      .toLowerCase()
      .includes(search.trim().toLowerCase()),
  );

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Produits
          </h1>

          <p className="mt-1 text-slate-500">
            Gérez votre catalogue.
          </p>
        </div>

        <Button
          type="button"
          onClick={() => {
            setSelectedProduct(null);
            setOpen(true);
          }}
        >
          + Ajouter un produit
        </Button>
      </div>

      <Card>
        <Input
          placeholder="Rechercher un produit..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
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
          onEdit={(product) => {
            setSelectedProduct(product);
            setOpen(true);
          }}
          onDelete={(product) => console.log(product)}
        />
      )}

      <Modal
        open={open}
        title={
          selectedProduct
            ? "Modifier le produit"
            : "Ajouter un produit"
        }
        onClose={handleCloseModal}
      >
        <ProductForm
          product={selectedProduct}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          loading={saving}
        />
      </Modal>
    </section>
  );
}

export default Products;