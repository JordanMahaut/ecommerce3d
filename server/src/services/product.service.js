const prisma = require("../lib/prisma");

async function getProducts() {
  return prisma.product.findMany({
    where: {
      isActive: true,
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

async function getProductBySlug(slug) {
  const product = await prisma.product.findFirst({
    where: {
      slug,
      isActive: true,
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
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
      name: data.name,
      slug: data.slug,
      description: data.description,
      price: data.price,
      stock: data.stock,
      image: data.image || null,
      gallery: data.gallery || null,
      featured: data.featured ?? false,
      isActive: data.isActive ?? true,
      categoryId: data.categoryId || null,
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });
}

async function updateProduct(id, data) {
  return prisma.product.update({
    where: {
      id,
    },
    data: {
      ...(data.name !== undefined && {
        name: data.name,
      }),

      ...(data.slug !== undefined && {
        slug: data.slug,
      }),

      ...(data.description !== undefined && {
        description: data.description,
      }),

      ...(data.price !== undefined && {
        price: data.price,
      }),

      ...(data.stock !== undefined && {
        stock: data.stock,
      }),

      ...(data.image !== undefined && {
        image: data.image,
      }),

      ...(data.gallery !== undefined && {
        gallery: data.gallery,
      }),

      ...(data.featured !== undefined && {
        featured: data.featured,
      }),

      ...(data.isActive !== undefined && {
        isActive: data.isActive,
      }),

      ...(data.categoryId !== undefined && {
        categoryId: data.categoryId || null,
      }),
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });
}

async function deleteProduct(id) {
  await prisma.product.delete({
    where: {
      id,
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