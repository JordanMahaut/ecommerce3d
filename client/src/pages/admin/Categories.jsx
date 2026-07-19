import { useEffect, useMemo, useState } from "react";

import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Modal from "../../components/ui/Modal";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";

import CategoryForm from "../../components/admin/CategoryForm";
import CategoryTable from "../../components/admin/CategoryTable";

import { getCategories, createCategory } from "../../services/category.service";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      setLoading(true);
      setError("");

      const data = await getCategories();

      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erreur chargement catégories :", error);

      setError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Impossible de charger les catégories.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(categoryData) {
  console.log("handleCreate reçu :", categoryData);

  try {
    setSaving(true);
    setError("");
    setSuccess("");

    const result = await createCategory(categoryData);

    console.log("Réponse création :", result);

    setOpen(false);
    setSuccess("La catégorie a bien été créée.");

    await loadCategories();
  } catch (error) {
    console.error("Erreur création catégorie :", error);

    setError(
      error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Impossible de créer la catégorie.",
    );
  } finally {
    setSaving(false);
  }
}

  function handleOpenModal() {
    setError("");
    setSuccess("");
    setOpen(true);
  }

  function handleCloseModal() {
    if (!saving) {
      setOpen(false);
    }
  }

  const filteredCategories = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return categories;
    }

    return categories.filter((category) => {
      const name = category.name?.toLowerCase() || "";
      const slug = category.slug?.toLowerCase() || "";

      return name.includes(normalizedSearch) || slug.includes(normalizedSearch);
    });
  }, [categories, search]);

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Gestion des catégories
          </h1>

          <p className="mt-1 text-slate-500">
            Gérez les catégories de votre boutique.
          </p>
        </div>

        <Button onClick={handleOpenModal}>+ Ajouter une catégorie</Button>
      </div>

      {success && (
        <div
          role="status"
          className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
        >
          {success}
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <Input
        placeholder="Rechercher par nom ou par slug..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : filteredCategories.length === 0 ? (
        <EmptyState
          title={search ? "Aucun résultat" : "Aucune catégorie"}
          description={
            search
              ? "Aucune catégorie ne correspond à votre recherche."
              : "Ajoutez votre première catégorie."
          }
        />
      ) : (
        <CategoryTable
          categories={filteredCategories}
          onEdit={() => {}}
          onDelete={() => {}}
        />
      )}

      <Modal open={open} onClose={handleCloseModal} title="Nouvelle catégorie">
        <CategoryForm
          onSubmit={handleCreate}
          onCancel={handleCloseModal}
          loading={saving}
        />
      </Modal>
    </section>
  );
}

export default Categories;
