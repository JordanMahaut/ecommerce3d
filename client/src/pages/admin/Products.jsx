import { useMemo, useState } from "react";
import { toast } from "sonner";

import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";
import Modal from "../../components/ui/Modal";

import ProductForm from "../../components/admin/ProductForm";
import ProductStats from "../../components/admin/products/ProductStats";
import ProductFilters from "../../components/admin/products/ProductFilters";
import ProductTable from "../../components/admin/products/ProductTable";

import useProducts from "../../hooks/useProducts";
import useCreateProduct from "../../hooks/useCreateProduct";
import useUpdateProduct from "../../hooks/useUpdateProduct";
import useDeleteProduct from "../../hooks/useDeleteProduct";

import { useQuery } from "@tanstack/react-query";
import * as categoryService from "../../services/category.service";

import { normalizeProductsResponse } from "../../utils/formatters";

function Products() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [stockFilter, setStockFilter] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const {
    data: productsResponse,
    isLoading: productsLoading,
    isError: productsError,
    error: productsRequestError,
  } = useProducts();

  const {
    data: categoriesResponse,
    isLoading: categoriesLoading,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: categoryService.getCategories,
  });

  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  const products = useMemo(
    () => normalizeProductsResponse(productsResponse),
    [productsResponse],
  );

  const categories = useMemo(() => {
    if (Array.isArray(categoriesResponse)) {
      return categoriesResponse;
    }

    if (Array.isArray(categoriesResponse?.categories)) {
      return categoriesResponse.categories;
    }

    if (Array.isArray(categoriesResponse?.data)) {
      return categoriesResponse.data;
    }

    return [];
  }, [categoriesResponse]);

  const loading = productsLoading || categoriesLoading;
  const saving =
    createMutation.isPending || updateMutation.isPending;

  function openCreateModal() {
    setSelectedProduct(null);
    setModalOpen(true);
  }

  function openEditModal(product) {
    setSelectedProduct(product);
    setModalOpen(true);
  }

  function closeModal() {
    if (saving) {
      return;
    }

    setModalOpen(false);
    setSelectedProduct(null);
  }

  function handleSubmit(formData) {
    if (selectedProduct) {
      updateMutation.mutate(
        {
          id: selectedProduct.id,
          formData,
        },
        {
          onSuccess: () => {
            setModalOpen(false);
            setSelectedProduct(null);
          },
        },
      );

      return;
    }

    createMutation.mutate(formData, {
      onSuccess: () => {
        setModalOpen(false);
        setSelectedProduct(null);
      },
    });
  }

  function handleDelete(product) {
    const confirmed = window.confirm(
      `Voulez-vous vraiment supprimer « ${product.name} » ?`,
    );

    if (!confirmed) {
      return;
    }

    deleteMutation.mutate(product.id, {
      onError: (error) => {
        toast.error(
          error.response?.data?.message ||
            "Impossible de supprimer le produit.",
        );
      },
    });
  }

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return products.filter((product) => {
      const productName = String(
        product.name || "",
      ).toLowerCase();

      const productSlug = String(
        product.slug || "",
      ).toLowerCase();

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

  if (productsError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
        {productsRequestError?.response?.data?.message ||
          "Impossible de charger les produits."}
      </div>
    );
  }

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
          deletingId={
            deleteMutation.isPending
              ? deleteMutation.variables
              : null
          }
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