const fs = require("fs");

const {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../services/product.service");

const {
  productSchema,
  updateProductSchema,
} = require("../validators/product.validator");

function deleteUploadedFile(file) {
  if (!file?.path) {
    return;
  }

  fs.unlink(file.path, (error) => {
    if (error && error.code !== "ENOENT") {
      console.error(
        "Impossible de supprimer le fichier uploadé :",
        error,
      );
    }
  });
}

function formatZodErrors(error) {
  return error.issues.reduce((errors, issue) => {
    const field = issue.path.join(".") || "general";

    if (!errors[field]) {
      errors[field] = [];
    }

    errors[field].push(issue.message);

    return errors;
  }, {});
}

async function listProducts(req, res) {
  try {
    const products = await getProducts();

    return res.status(200).json(products);
  } catch (error) {
    console.error("Erreur récupération produits :", error);

    return res.status(500).json({
      message: "Impossible de récupérer les produits.",
    });
  }
}

async function showProduct(req, res) {
  try {
    const product = await getProductBySlug(req.params.slug);

    return res.status(200).json(product);
  } catch (error) {
    return res.status(404).json({
      message: error.message,
    });
  }
}

async function storeProduct(req, res) {
  try {
    const body = {
      ...req.body,

      image: req.file
        ? `${req.protocol}://${req.get(
            "host",
          )}/uploads/products/${req.file.filename}`
        : null,
    };

    console.log("Données produit reçues :", body);

    const validation = productSchema.safeParse(body);

    if (!validation.success) {
      deleteUploadedFile(req.file);

      console.error(
        "Erreurs validation produit :",
        validation.error.issues,
      );

      return res.status(400).json({
        message: "Données invalides.",
        errors: formatZodErrors(validation.error),
        received: body,
      });
    }

    const product = await createProduct(validation.data);

    return res.status(201).json({
      message: "Produit créé avec succès.",
      product,
    });
  } catch (error) {
    deleteUploadedFile(req.file);

    if (error.code === "P2002") {
      return res.status(409).json({
        message: "Ce slug est déjà utilisé.",
      });
    }

    if (error.code === "P2003") {
      return res.status(400).json({
        message: "La catégorie sélectionnée est invalide.",
      });
    }

    console.error("Erreur création produit :", error);

    return res.status(500).json({
      message: "Impossible de créer le produit.",
    });
  }
}

async function editProduct(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      deleteUploadedFile(req.file);

      return res.status(400).json({
        message: "Identifiant de produit invalide.",
      });
    }

    const body = {
      ...req.body,
    };

    if (req.file) {
      body.image = `${req.protocol}://${req.get(
        "host",
      )}/uploads/products/${req.file.filename}`;
    }

    console.log("Données modification reçues :", body);

    const validation = updateProductSchema.safeParse(body);

    if (!validation.success) {
      deleteUploadedFile(req.file);

      console.error(
        "Erreurs validation modification :",
        validation.error.issues,
      );

      return res.status(400).json({
        message: "Données invalides.",
        errors: formatZodErrors(validation.error),
        received: body,
      });
    }

    if (Object.keys(validation.data).length === 0) {
      deleteUploadedFile(req.file);

      return res.status(400).json({
        message: "Aucune donnée à modifier.",
      });
    }

    const product = await updateProduct(
      id,
      validation.data,
    );

    return res.status(200).json({
      message: "Produit modifié avec succès.",
      product,
    });
  } catch (error) {
    deleteUploadedFile(req.file);

    if (error.code === "P2002") {
      return res.status(409).json({
        message: "Ce slug est déjà utilisé.",
      });
    }

    if (error.code === "P2003") {
      return res.status(400).json({
        message: "La catégorie sélectionnée est invalide.",
      });
    }

    if (error.code === "P2025") {
      return res.status(404).json({
        message: "Produit introuvable.",
      });
    }

    console.error("Erreur modification produit :", error);

    return res.status(500).json({
      message: "Impossible de modifier le produit.",
    });
  }
}

async function destroyProduct(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        message: "Identifiant de produit invalide.",
      });
    }

    const result = await deleteProduct(id);

    return res.status(200).json(result);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        message: "Produit introuvable.",
      });
    }

    if (error.code === "P2003") {
      return res.status(409).json({
        message:
          "Ce produit est lié à une commande et ne peut pas être supprimé.",
      });
    }

    console.error("Erreur suppression produit :", error);

    return res.status(500).json({
      message: "Impossible de supprimer le produit.",
    });
  }
}

module.exports = {
  listProducts,
  showProduct,
  storeProduct,
  editProduct,
  destroyProduct,
};