const prisma = require("../lib/prisma");

async function getAddresses(userId) {
  return prisma.address.findMany({
    where: {
      userId,
    },
    orderBy: [
      {
        isDefault: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
  });
}

async function getAddressById(id, userId) {
  const address = await prisma.address.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!address) {
    const error = new Error("Adresse introuvable");
    error.statusCode = 404;
    throw error;
  }

  return address;
}

async function createAddress(userId, data) {
  return prisma.$transaction(async (tx) => {
    if (data.isDefault) {
      await tx.address.updateMany({
        where: {
          userId,
          type: data.type,
        },
        data: {
          isDefault: false,
        },
      });
    }

    const addressCount = await tx.address.count({
      where: {
        userId,
        type: data.type,
      },
    });

    return tx.address.create({
      data: {
        ...data,
        userId,

        // La première adresse de ce type devient automatiquement principale.
        isDefault: data.isDefault || addressCount === 0,
      },
    });
  });
}

async function updateAddress(id, userId, data) {
  const currentAddress = await getAddressById(id, userId);

  return prisma.$transaction(async (tx) => {
    const finalType = data.type || currentAddress.type;

    if (data.isDefault) {
      await tx.address.updateMany({
        where: {
          userId,
          type: finalType,
          id: {
            not: id,
          },
        },
        data: {
          isDefault: false,
        },
      });
    }

    return tx.address.update({
      where: {
        id,
      },
      data,
    });
  });
}

async function deleteAddress(id, userId) {
  const address = await getAddressById(id, userId);

  await prisma.address.delete({
    where: {
      id,
    },
  });

  if (address.isDefault) {
    const replacement = await prisma.address.findFirst({
      where: {
        userId,
        type: address.type,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (replacement) {
      await prisma.address.update({
        where: {
          id: replacement.id,
        },
        data: {
          isDefault: true,
        },
      });
    }
  }

  return {
    message: "Adresse supprimée avec succès",
  };
}

async function setDefaultAddress(id, userId) {
  const address = await getAddressById(id, userId);

  return prisma.$transaction(async (tx) => {
    await tx.address.updateMany({
      where: {
        userId,
        type: address.type,
      },
      data: {
        isDefault: false,
      },
    });

    return tx.address.update({
      where: {
        id,
      },
      data: {
        isDefault: true,
      },
    });
  });
}

module.exports = {
  getAddresses,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};