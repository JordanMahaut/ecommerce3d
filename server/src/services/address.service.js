import prisma from "../lib/prisma.js";

export async function getUserAddresses(userId) {
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

export async function getUserAddressById(addressId, userId) {
  return prisma.address.findFirst({
    where: {
      id: addressId,
      userId,
    },
  });
}

export async function createUserAddress(userId, data) {
  return prisma.$transaction(async (transaction) => {
    const addressCount = await transaction.address.count({
      where: {
        userId,
        type: data.type,
      },
    });

    // La première adresse d'un type devient automatiquement celle par défaut.
    const shouldBeDefault = data.isDefault || addressCount === 0;

    if (shouldBeDefault) {
      await transaction.address.updateMany({
        where: {
          userId,
          type: data.type,
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      });
    }

    return transaction.address.create({
      data: {
        type: data.type,
        firstname: data.firstname,
        lastname: data.lastname,
        company: normalizeOptionalString(data.company),
        street: data.street,
        street2: normalizeOptionalString(data.street2),
        postalCode: data.postalCode,
        city: data.city,
        country: data.country || "France",
        phone: normalizeOptionalString(data.phone),
        isDefault: shouldBeDefault,
        userId,
      },
    });
  });
}

export async function updateUserAddress(addressId, userId, data) {
  return prisma.$transaction(async (transaction) => {
    const existingAddress = await transaction.address.findFirst({
      where: {
        id: addressId,
        userId,
      },
    });

    if (!existingAddress) {
      return null;
    }

    const nextType = data.type || existingAddress.type;
    const shouldBeDefault =
      data.isDefault === true ||
      (existingAddress.isDefault && nextType === existingAddress.type);

    if (shouldBeDefault) {
      await transaction.address.updateMany({
        where: {
          userId,
          type: nextType,
          isDefault: true,
          id: {
            not: addressId,
          },
        },
        data: {
          isDefault: false,
        },
      });
    }

    const updateData = {
      ...data,
    };

    if ("company" in updateData) {
      updateData.company = normalizeOptionalString(updateData.company);
    }

    if ("street2" in updateData) {
      updateData.street2 = normalizeOptionalString(updateData.street2);
    }

    if ("phone" in updateData) {
      updateData.phone = normalizeOptionalString(updateData.phone);
    }

    /*
     * On empêche une adresse par défaut de devenir simplement "non définie"
     * sans qu'une autre adresse du même type soit choisie.
     */
    if (
      existingAddress.isDefault &&
      data.isDefault === false &&
      nextType === existingAddress.type
    ) {
      delete updateData.isDefault;
    }

    return transaction.address.update({
      where: {
        id: addressId,
      },
      data: updateData,
    });
  });
}

export async function setDefaultUserAddress(addressId, userId) {
  return prisma.$transaction(async (transaction) => {
    const address = await transaction.address.findFirst({
      where: {
        id: addressId,
        userId,
      },
    });

    if (!address) {
      return null;
    }

    await transaction.address.updateMany({
      where: {
        userId,
        type: address.type,
        isDefault: true,
      },
      data: {
        isDefault: false,
      },
    });

    return transaction.address.update({
      where: {
        id: addressId,
      },
      data: {
        isDefault: true,
      },
    });
  });
}

export async function deleteUserAddress(addressId, userId) {
  return prisma.$transaction(async (transaction) => {
    const address = await transaction.address.findFirst({
      where: {
        id: addressId,
        userId,
      },
    });

    if (!address) {
      return null;
    }

    await transaction.address.delete({
      where: {
        id: addressId,
      },
    });

    /*
     * Si l'adresse supprimée était celle par défaut,
     * on choisit automatiquement l'adresse la plus récente du même type.
     */
    if (address.isDefault) {
      const replacementAddress = await transaction.address.findFirst({
        where: {
          userId,
          type: address.type,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      if (replacementAddress) {
        await transaction.address.update({
          where: {
            id: replacementAddress.id,
          },
          data: {
            isDefault: true,
          },
        });
      }
    }

    return address;
  });
}

function normalizeOptionalString(value) {
  if (typeof value !== "string") {
    return value || null;
  }

  const trimmedValue = value.trim();

  return trimmedValue.length > 0 ? trimmedValue : null;
}