const prisma = require("../lib/prisma");

async function getProducts() {
  return prisma.product.findMany({
    where: {
      isActive: true,
    },
    include: {
      category: true,
    },
    orderBy: {
      id: "desc",
    },
  });
}

async function getProductBySlug(slug) {
  const product = await prisma.product.findUnique({
    where: {
      slug,
    },
    include: {
      category: true,
    },
  });

  if (!product) {
    throw new Error("Produit introuvable.");
  }

  return product;
}

async function createProduct(data) {
  return prisma.product.create({
    data: {
      ...data,
      categoryId: Number(data.categoryId),
    },
    include: {
      category: true,
    },
  });
}

async function updateProduct(id, data) {
  const normalizedData = {
    ...data,
  };

  if (data.categoryId !== undefined) {
    normalizedData.categoryId = Number(data.categoryId);
  }

  return prisma.product.update({
    where: {
      id: Number(id),
    },
    data: normalizedData,
    include: {
      category: true,
    },
  });
}

async function deleteProduct(id) {
  await prisma.product.delete({
    where: {
      id: Number(id),
    },
  });

  return {
    message: "Produit supprimé avec succès.",
  };
}

module.exports = {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
};