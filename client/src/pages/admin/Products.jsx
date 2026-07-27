import { useEffect, useMemo, useState } from "react";

import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";
import Modal from "../../components/ui/Modal";

import ProductForm from "../../components/admin/ProductForm";
import ProductStats from "../../components/admin/products/ProductStats";
import ProductFilters from "../../components/admin/products/ProductFilters";
import ProductTable from "../../components/admin/products/ProductTable";

import * as productService from "../../services/product.service";
import * as categoryService from "../../services/category.service";

import { normalizeProductsResponse } from "../../utils/formatters";

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [stockFilter, setStockFilter] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadProducts() {
    try {
      const data = await productService.getProducts();

      setProducts(normalizeProductsResponse(data));
    } catch (requestError) {
      console.error(
        "Erreur chargement produits :",
        requestError.response?.data || requestError,
      );

      setProducts([]);

      setError(
        requestError.response?.data?.message ||
          "Impossible de charger les produits.",
      );
    }
  }

  async function loadCategories() {
    try {
      const data = await categoryService.getCategories();

      const categoryList = Array.isArray(data)
        ? data
        : Array.isArray(data?.categories)
          ? data.categories
          : Array.isArray(data?.data)
            ? data.data
            : [];

      setCategories(categoryList);
    } catch (requestError) {
      console.error(
        "Erreur chargement catégories :",
        requestError.response?.data || requestError,
      );

      setCategories([]);
    }
  }

  async function loadPageData() {
    try {
      setLoading(true);
      setError("");

      await Promise.all([loadProducts(), loadCategories()]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPageData();
  }, []);

  function openCreateModal() {
    setSelectedProduct(null);
    setModalOpen(true);
    setMessage("");
    setError("");
  }

  function openEditModal(product) {
    setSelectedProduct(product);
    setModalOpen(true);
    setMessage("");
    setError("");
  }

  function closeModal() {
    if (saving) {
      return;
    }

    setModalOpen(false);
    setSelectedProduct(null);
  }

  async function handleSubmit(formData) {
    try {
      setSaving(true);
      setMessage("");
      setError("");

      if (selectedProduct) {
        await productService.updateProduct(
          selectedProduct.id,
          formData,
        );

        setMessage("Le produit a été modifié avec succès.");
      } else {
        await productService.createProduct(formData);

        setMessage("Le produit a été ajouté avec succès.");
      }

      await loadProducts();

      setModalOpen(false);
      setSelectedProduct(null);
    } catch (requestError) {
      const response = requestError.response?.data;

      console.error(
        selectedProduct
          ? "Erreur modification produit :"
          : "Erreur création produit :",
        response || requestError,
      );

      setError(
        response?.message ||
          "Impossible d'enregistrer le produit.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(product) {
    const confirmed = window.confirm(
      `Voulez-vous vraiment supprimer « ${product.name} » ?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(product.id);
      setMessage("");
      setError("");

      await productService.deleteProduct(product.id);

      setMessage("Le produit a été supprimé avec succès.");

      await loadProducts();
    } catch (requestError) {
      console.error(
        "Erreur suppression produit :",
        requestError.response?.data || requestError,
      );

      setError(
        requestError.response?.data?.message ||
          "Impossible de supprimer le produit.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  const filteredProducts = useMemo(() => {
    const safeProducts = Array.isArray(products) ? products : [];
    const normalizedSearch = search.trim().toLowerCase();

    return safeProducts.filter((product) => {
      const productName = String(product.name || "").toLowerCase();
      const productSlug = String(product.slug || "").toLowerCase();

      const matchesSearch =
        normalizedSearch.length === 0 ||
        productName.includes(normalizedSearch) ||
        productSlug.includes(normalizedSearch);

      const productCategoryId = String(
        product.categoryId ?? product.category?.id ?? "",
      );

      const matchesCategory =
        categoryFilter === "" ||
        productCategoryId === categoryFilter;

      const stock = Number(product.stock) || 0;

      let matchesStock = true;

      if (stockFilter === "IN_STOCK") {
        matchesStock = stock > 5;
      }

      if (stockFilter === "LOW_STOCK") {
        matchesStock = stock > 0 && stock <= 5;
      }

      if (stockFilter === "OUT_OF_STOCK") {
        matchesStock = stock <= 0;
      }

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, search, categoryFilter, stockFilter]);

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Produits
          </h1>

          <p className="mt-1 text-slate-500">
            Gérez les produits, les prix et les stocks de votre
            catalogue.
          </p>
        </div>

        <Button type="button" onClick={openCreateModal}>
          + Ajouter un produit
        </Button>
      </div>

      {message && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700">
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      <ProductStats products={products} />

      <ProductFilters
        search={search}
        onSearchChange={setSearch}
        category={categoryFilter}
        onCategoryChange={setCategoryFilter}
        stockStatus={stockFilter}
        onStockStatusChange={setStockFilter}
        categories={categories}
      />

      {loading ? (
        <div className="flex min-h-64 items-center justify-center">
          <Spinner />
        </div>
      ) : filteredProducts.length === 0 ? (
        <EmptyState
          title={
            products.length === 0
              ? "Aucun produit"
              : "Aucun résultat"
          }
          description={
            products.length === 0
              ? "Commencez par créer votre premier produit."
              : "Aucun produit ne correspond aux filtres sélectionnés."
          }
        />
      ) : (
        <ProductTable
          products={filteredProducts}
          onEdit={openEditModal}
          onDelete={handleDelete}
          deletingId={deletingId}
        />
      )}

      <Modal
        open={modalOpen}
        title={
          selectedProduct
            ? "Modifier le produit"
            : "Ajouter un produit"
        }
        onClose={closeModal}
      >
        <ProductForm
          product={selectedProduct}
          categories={categories}
          onSubmit={handleSubmit}
          onCancel={closeModal}
          loading={saving}
        />
      </Modal>
    </section>
  );
}

export default Products;