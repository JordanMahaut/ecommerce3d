import api from "../api/axios";

/**
 * Récupérer toutes les adresses de l'utilisateur
 */
export async function getAddresses() {
  const { data } = await api.get("/addresses");
  return data;
}

/**
 * Récupérer une adresse
 */
export async function getAddress(id) {
  const { data } = await api.get(`/addresses/${id}`);
  return data;
}

/**
 * Ajouter une adresse
 */
export async function createAddress(address) {
  const { data } = await api.post("/addresses", address);
  return data;
}

/**
 * Modifier une adresse
 */
export async function updateAddress(id, address) {
  const { data } = await api.put(`/addresses/${id}`, address);
  return data;
}

/**
 * Supprimer une adresse
 */
export async function deleteAddress(id) {
  const { data } = await api.delete(`/addresses/${id}`);
  return data;
}

/**
 * Définir une adresse par défaut
 */
export async function setDefaultAddress(id) {
  const { data } = await api.patch(`/addresses/${id}/default`);
  return data;
}