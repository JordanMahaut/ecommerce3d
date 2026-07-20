import { useEffect, useState } from "react";

import Input from "../ui/Input";
import Button from "../ui/Button";

import slugify from "../../utils/slugify";
import { getCategories } from "../../services/category.service";

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  price: "",
  stock: "",
  categoryId: "",
  image: null,
  featured: false,
  isActive: true,
};

function ProductForm({
  product = null,
  onSubmit,
  onCancel,
  loading = false,
}) {
  const [formData, setFormData] = useState(emptyForm);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const isEditing = Boolean(product);

  useEffect(() => {
    async function loadCategories() {
      try {
        setCategoriesLoading(true);
        setCategoriesError("");

        const data = await getCategories();

        setCategories(
          data.filter(
            (category) =>
              category.isActive ||
              category.id === product?.categoryId,
          ),
        );
      } catch (error) {
        console.error(error);
        setCategoriesError("Impossible de charger les catégories.");
      } finally {
        setCategoriesLoading(false);
      }
    }

    loadCategories();
  }, [product]);

  useEffect(() => {
    setFormData(
      product
        ? {
            name: product.name ?? "",
            slug: product.slug ?? "",
            description: product.description ?? "",
            price: product.price != null
              ? String(product.price)
              : "",
            stock: product.stock != null
              ? String(product.stock)
              : "",
            categoryId: product.categoryId != null
              ? String(product.categoryId)
              : "",
            image: null,
            featured: Boolean(product.featured),
            isActive: product.isActive ?? true,
          }
        : emptyForm,
    );

    setImagePreview(product?.image ?? null);
  }, [product]);

  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  function handleChange(event) {
    const { name, value, files, type, checked } = event.target;

    if (name === "image") {
      const file = files?.[0] ?? null;

      setFormData((current) => ({
        ...current,
        image: file,
      }));

      setImagePreview((currentPreview) => {
        if (currentPreview?.startsWith("blob:")) {
          URL.revokeObjectURL(currentPreview);
        }

        return file
          ? URL.createObjectURL(file)
          : product?.image ?? null;
      });

      return;
    }

    setFormData((current) => {
      const updated = {
        ...current,
        [name]: type === "checkbox" ? checked : value,
      };

      if (name === "name") {
        updated.slug = slugify(value);
      }

      return updated;
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const payload = new FormData();

    payload.append("name", formData.name.trim());
    payload.append("slug", String(formData.slug).trim());
    payload.append("description", formData.description.trim());
    payload.append("price", formData.price);
    payload.append("stock", formData.stock);
    payload.append("categoryId", formData.categoryId);
    payload.append("featured", String(formData.featured));
    payload.append("isActive", String(formData.isActive));

    if (formData.image) {
      payload.append("image", formData.image);
    }

    await onSubmit(payload);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Nom"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
      />

      <Input
        label="Slug"
        name="slug"
        value={formData.slug}
        readOnly
        required
        className="bg-slate-100 text-slate-500"
      />

      <div className="space-y-2">
        <label
          htmlFor="categoryId"
          className="block text-sm font-medium text-slate-700"
        >
          Catégorie
        </label>

        <select
          id="categoryId"
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          required
          disabled={categoriesLoading}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:bg-slate-100"
        >
          <option value="">
            {categoriesLoading
              ? "Chargement des catégories..."
              : "Sélectionner une catégorie"}
          </option>

          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        {categoriesError && (
          <p className="text-sm text-red-600">
            {categoriesError}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-slate-700"
        >
          Description
        </label>

        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={5}
          required
          className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Prix (€)"
          name="price"
          type="number"
          min="0.01"
          step="0.01"
          value={formData.price}
          onChange={handleChange}
          required
        />

        <Input
          label="Stock"
          name="stock"
          type="number"
          min="0"
          step="1"
          value={formData.stock}
          onChange={handleChange}
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex items-center gap-3 rounded-xl border border-slate-300 p-4">
          <input
            type="checkbox"
            name="featured"
            checked={formData.featured}
            onChange={handleChange}
          />

          <span className="text-sm font-medium text-slate-700">
            Produit mis en avant
          </span>
        </label>

        <label className="flex items-center gap-3 rounded-xl border border-slate-300 p-4">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
          />

          <span className="text-sm font-medium text-slate-700">
            Produit actif
          </span>
        </label>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="image"
          className="block text-sm font-medium text-slate-700"
        >
          Image du produit
        </label>

        <input
          id="image"
          name="image"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleChange}
          className="block w-full cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white"
        />

        {isEditing && (
          <p className="text-xs text-slate-500">
            Laissez ce champ vide pour conserver l’image actuelle.
          </p>
        )}

        {imagePreview && (
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <img
              src={imagePreview}
              alt="Aperçu du produit"
              className="h-52 w-full object-cover"
            />
          </div>
        )}
      </div>

      <div className="sticky bottom-0 -mx-6 flex justify-end gap-3 border-t border-slate-200 bg-white px-6 py-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Annuler
        </Button>

        <Button type="submit" disabled={loading}>
          {loading
            ? isEditing
              ? "Modification..."
              : "Création..."
            : isEditing
              ? "Modifier"
              : "Créer"}
        </Button>
      </div>
    </form>
  );
}

export default ProductForm;