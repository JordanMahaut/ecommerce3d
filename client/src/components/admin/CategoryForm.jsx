import { useState } from "react";

import Input from "../ui/Input";
import Button from "../ui/Button";
import slugify from "../../utils/slugify";

function CategoryForm({ onSubmit, onCancel, loading = false }) {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    isActive: true,
  });

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

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

  function handleSubmit(event) {
  event.preventDefault();

  const categoryData = {
    name: String(formData.name ?? "").trim(),
    slug: String(formData.slug ?? "").trim(),
    description: String(formData.description ?? "").trim() || null,
    isActive: Boolean(formData.isActive),
  };

  console.log("Soumission catégorie :", categoryData);

  onSubmit(categoryData);
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
          rows={4}
          className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200"
        />
      </div>

      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          name="isActive"
          checked={formData.isActive}
          onChange={handleChange}
          className="h-4 w-4 rounded border-slate-300"
        />

        <span className="text-sm font-medium text-slate-700">
          Catégorie active
        </span>
      </label>

      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Annuler
        </Button>

        <Button type="submit" disabled={loading}>
          {loading ? "Création..." : "Créer"}
        </Button>
      </div>
    </form>
  );
}

export default CategoryForm;
