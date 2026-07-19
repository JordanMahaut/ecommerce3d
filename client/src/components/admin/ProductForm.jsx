import { useEffect, useState } from "react";

import Input from "../ui/Input";
import Button from "../ui/Button";

import slugify from "../../utils/slugify";
import { getCategories } from "../../services/category.service";

function ProductForm({ onSubmit, onCancel, loading = false }) {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    image: null,
  });

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    async function loadCategories() {
      try {
        setCategoriesLoading(true);
        setCategoriesError("");

        const data = await getCategories();

        setCategories(
          data.filter((category) => category.isActive)
        );
      } catch (error) {
        console.error(error);
        setCategoriesError(
          "Impossible de charger les catégories."
        );
      } finally {
        setCategoriesLoading(false);
      }
    }

    loadCategories();
  }, []);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  function handleChange(event) {
    const { name, value, files } = event.target;

    if (name === "image") {
      const file = files?.[0] ?? null;

      setFormData((current) => ({
        ...current,
        image: file,
      }));

      setImagePreview((currentPreview) => {
        if (currentPreview) {
          URL.revokeObjectURL(currentPreview);
        }

        return file ? URL.createObjectURL(file) : null;
      });

      return;
    }

    setFormData((current) => {
      const updated = {
        ...current,
        [name]: value,
      };

      if (name === "name") {
        updated.slug = slugify(value);
      }

      return updated;
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    const payload = new FormData();

    payload.append("name", formData.name);
    payload.append("slug", formData.slug);
    payload.append("description", formData.description);
    payload.append("price", formData.price);
    payload.append("stock", formData.stock);
    payload.append("categoryId", formData.categoryId);

    if (formData.image) {
      payload.append("image", formData.image);
    }

    onSubmit(payload);
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
            <option
              key={category.id}
              value={category.id}
            >
              {category.name}
            </option>
          ))}
        </select>

        {categoriesError && (
          <p className="text-sm text-red-600">
            {categoriesError}
          </p>
        )}

        {!categoriesLoading &&
          !categoriesError &&
          categories.length === 0 && (
            <p className="text-sm text-amber-600">
              Aucune catégorie active disponible.
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
          className="block w-full cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-slate-700"
        />

        <p className="text-xs text-slate-500">
          Formats acceptés : JPG, PNG et WebP. Taille maximale : 5 Mo.
        </p>

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

      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Annuler
        </Button>

        <Button
          type="submit"
          disabled={
            loading ||
            categoriesLoading ||
            categories.length === 0
          }
        >
          {loading ? "Création..." : "Créer"}
        </Button>
      </div>
    </form>
  );
}

export default ProductForm;