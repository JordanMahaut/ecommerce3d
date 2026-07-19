const prisma = require("../lib/prisma");

async function getCategories() {
  return prisma.category.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

async function getCategoryBySlug(slug) {
  const category = await prisma.category.findUnique({
    where: {
      slug,
    },
    include: {
      products: {
        where: {
          isActive: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!category) {
    throw new Error("Catégorie introuvable.");
  }

  return category;
}

async function createCategory(data) {
  return prisma.category.create({
    data,
  });
}

async function updateCategory(id, data) {
  return prisma.category.update({
    where: {
      id: Number(id),
    },
    data,
  });
}

async function deleteCategory(id) {
  return prisma.category.delete({
    where: {
      id: Number(id),
    },
  });
}

module.exports = {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
};