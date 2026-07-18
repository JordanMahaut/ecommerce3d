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

async function listProducts(req, res) {
  try {
    const products = await getProducts();

    return res.status(200).json(products);
  } catch (error) {
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
        ? `${req.protocol}://${req.get("host")}/uploads/products/${req.file.filename}`
        : null,
    };

    const data = productSchema.parse(body);
    const product = await createProduct(data);

    return res.status(201).json({
      message: "Produit créé avec succès.",
      product,
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
        message: "Ce slug est déjà utilisé.",
      });
    }

    console.error(error);

    return res.status(500).json({
      message: "Impossible de créer le produit.",
    });
  }
}

async function editProduct(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        message: "Identifiant de produit invalide.",
      });
    }

    const body = {
      ...req.body,
    };

    if (req.file) {
      body.image = `${req.protocol}://${req.get("host")}/uploads/products/${req.file.filename}`;
    }

    const data = updateProductSchema.parse(body);

    if (Object.keys(data).length === 0) {
      return res.status(400).json({
        message: "Aucune donnée à modifier.",
      });
    }

    const product = await updateProduct(id, data);

    return res.status(200).json({
      message: "Produit modifié avec succès.",
      product,
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
        message: "Ce slug est déjà utilisé.",
      });
    }

    if (error.code === "P2025") {
      return res.status(404).json({
        message: "Produit introuvable.",
      });
    }

    console.error(error);

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
