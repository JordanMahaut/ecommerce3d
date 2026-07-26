import {
  createAddressSchema,
  updateAddressSchema,
  addressIdSchema,
} from "../validators/address.validator.js";

import {
  getUserAddresses,
  createUserAddress,
  updateUserAddress,
  deleteUserAddress,
  setDefaultUserAddress,
} from "../services/address.service.js";

export async function indexAddresses(req, res) {
  try {
    const addresses = await getUserAddresses(req.user.id);

    return res.status(200).json({
      success: true,
      addresses,
    });
  } catch (error) {
    console.error("Erreur indexAddresses :", error);

    return res.status(500).json({
      success: false,
      message: "Impossible de récupérer les adresses.",
    });
  }
}

export async function storeAddress(req, res) {
  try {
    const validation = createAddressSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Les informations de l'adresse sont invalides.",
        errors: validation.error.flatten().fieldErrors,
      });
    }

    const address = await createUserAddress(
      req.user.id,
      validation.data,
    );

    return res.status(201).json({
      success: true,
      message: "L'adresse a été ajoutée.",
      address,
    });
  } catch (error) {
    console.error("Erreur storeAddress :", error);

    return res.status(500).json({
      success: false,
      message: "Impossible d'ajouter l'adresse.",
    });
  }
}

export async function editAddress(req, res) {
  try {
    const paramsValidation = addressIdSchema.safeParse(req.params);

    if (!paramsValidation.success) {
      return res.status(400).json({
        success: false,
        message: "L'identifiant de l'adresse est invalide.",
      });
    }

    const bodyValidation = updateAddressSchema.safeParse(req.body);

    if (!bodyValidation.success) {
      return res.status(400).json({
        success: false,
        message: "Les informations de l'adresse sont invalides.",
        errors: bodyValidation.error.flatten().fieldErrors,
      });
    }

    const address = await updateUserAddress(
      paramsValidation.data.id,
      req.user.id,
      bodyValidation.data,
    );

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Adresse introuvable.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "L'adresse a été modifiée.",
      address,
    });
  } catch (error) {
    console.error("Erreur editAddress :", error);

    return res.status(500).json({
      success: false,
      message: "Impossible de modifier l'adresse.",
    });
  }
}

export async function destroyAddress(req, res) {
  try {
    const validation = addressIdSchema.safeParse(req.params);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "L'identifiant de l'adresse est invalide.",
      });
    }

    const address = await deleteUserAddress(
      validation.data.id,
      req.user.id,
    );

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Adresse introuvable.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "L'adresse a été supprimée.",
    });
  } catch (error) {
    console.error("Erreur destroyAddress :", error);

    return res.status(500).json({
      success: false,
      message: "Impossible de supprimer l'adresse.",
    });
  }
}

export async function makeDefaultAddress(req, res) {
  try {
    const validation = addressIdSchema.safeParse(req.params);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "L'identifiant de l'adresse est invalide.",
      });
    }

    const address = await setDefaultUserAddress(
      validation.data.id,
      req.user.id,
    );

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Adresse introuvable.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "L'adresse a été définie par défaut.",
      address,
    });
  } catch (error) {
    console.error("Erreur makeDefaultAddress :", error);

    return res.status(500).json({
      success: false,
      message: "Impossible de définir l'adresse par défaut.",
    });
  }
}