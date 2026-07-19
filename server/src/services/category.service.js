const prisma = require("../lib/prisma");

async function getCategories() {
  return prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
  });
}

async function getCategoryBySlug(slug) {
  return prisma.category.findUnique({
    where: {
      slug,
    },
    include: {
      products: true,
    },
  });
}

async function createCategory(data) {
  return prisma.category.create({
    data,
  });
}

async function updateCategory(id, data) {
  return prisma.category.update({
    where: {
      id,
    },
    data,
  });
}

async function deleteCategory(id) {
  return prisma.category.delete({
    where: {
      id,
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