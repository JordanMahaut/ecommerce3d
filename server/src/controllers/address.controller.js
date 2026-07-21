const addressService = require("../services/address.service");
const {
  addressSchema,
  updateAddressSchema,
} = require("../validators/address.validator");

function getAuthenticatedUserId(req) {
  return req.user.id || req.user.userId;
}

async function getAddresses(req, res, next) {
  try {
    const userId = getAuthenticatedUserId(req);

    const addresses = await addressService.getAddresses(userId);

    return res.status(200).json(addresses);
  } catch (error) {
    next(error);
  }
}

async function getAddressById(req, res, next) {
  try {
    const userId = getAuthenticatedUserId(req);
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        message: "Identifiant invalide",
      });
    }

    const address = await addressService.getAddressById(id, userId);

    return res.status(200).json(address);
  } catch (error) {
    next(error);
  }
}

async function createAddress(req, res, next) {
  try {
    const userId = getAuthenticatedUserId(req);
    const data = addressSchema.parse(req.body);

    const address = await addressService.createAddress(userId, data);

    return res.status(201).json(address);
  } catch (error) {
    next(error);
  }
}

async function updateAddress(req, res, next) {
  try {
    const userId = getAuthenticatedUserId(req);
    const id = Number(req.params.id);
    const data = updateAddressSchema.parse(req.body);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        message: "Identifiant invalide",
      });
    }

    const address = await addressService.updateAddress(id, userId, data);

    return res.status(200).json(address);
  } catch (error) {
    next(error);
  }
}

async function deleteAddress(req, res, next) {
  try {
    const userId = getAuthenticatedUserId(req);
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        message: "Identifiant invalide",
      });
    }

    const result = await addressService.deleteAddress(id, userId);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

async function setDefaultAddress(req, res, next) {
  try {
    const userId = getAuthenticatedUserId(req);
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        message: "Identifiant invalide",
      });
    }

    const address = await addressService.setDefaultAddress(id, userId);

    return res.status(200).json(address);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAddresses,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};