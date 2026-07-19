const {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../services/category.service");

const {
  categorySchema,
  updateCategorySchema,
} = require("../validators/category.validator");

async function indexCategories(req, res) {
  try {
    const categories = await getCategories();

    return res.status(200).json({
      categories,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Impossible de récupérer les catégories.",
    });
  }
}

async function showCategory(req, res) {
  try {
    const category = await getCategoryBySlug(req.params.slug);

    return res.status(200).json({
      category,
    });
  } catch (error) {
    if (error.message === "Catégorie introuvable.") {
      return res.status(404).json({
        message: error.message,
      });
    }

    console.error(error);

    return res.status(500).json({
      message: "Impossible de récupérer la catégorie.",
    });
  }
}

async function storeCategory(req, res) {
  try {
    const data = categorySchema.parse(req.body);
    const category = await createCategory(data);

    return res.status(201).json({
      message: "Catégorie créée avec succès.",
      category,
    });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        message: "Données invalides.",
        errors: error.issues,
      });
    }

    if (error.code === "P2002") {
      return res.status(409).json({
        message: "Ce nom ou ce slug est déjà utilisé.",
      });
    }

    console.error(error);

    return res.status(500).json({
      message: "Impossible de créer la catégorie.",
    });
  }
}

async function editCategory(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        message: "Identifiant de catégorie invalide.",
      });
    }

    const data = updateCategorySchema.parse(req.body);

    if (Object.keys(data).length === 0) {
      return res.status(400).json({
        message: "Aucune donnée à modifier.",
      });
    }

    const category = await updateCategory(id, data);

    return res.status(200).json({
      message: "Catégorie modifiée avec succès.",
      category,
    });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        message: "Données invalides.",
        errors: error.issues,
      });
    }

    if (error.code === "P2002") {
      return res.status(409).json({
        message: "Ce nom ou ce slug est déjà utilisé.",
      });
    }

    if (error.code === "P2025") {
      return res.status(404).json({
        message: "Catégorie introuvable.",
      });
    }

    console.error(error);

    return res.status(500).json({
      message: "Impossible de modifier la catégorie.",
    });
  }
}

async function destroyCategory(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        message: "Identifiant de catégorie invalide.",
      });
    }

    await deleteCategory(id);

    return res.status(200).json({
      message: "Catégorie supprimée avec succès.",
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        message: "Catégorie introuvable.",
      });
    }

    if (error.code === "P2003") {
      return res.status(409).json({
        message:
          "Impossible de supprimer cette catégorie car elle contient encore des produits.",
      });
    }

    console.error(error);

    return res.status(500).json({
      message: "Impossible de supprimer la catégorie.",
    });
  }
}

module.exports = {
  indexCategories,
  showCategory,
  storeCategory,
  editCategory,
  destroyCategory,
};