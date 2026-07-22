import api from "../api/axios";

/**
 * Récupérer toutes les commandes de l'utilisateur connecté
 */
export async function getOrders() {
  const { data } = await api.get("/orders");
  return data;
}

/**
 * Récupérer une commande
 */
export async function getOrder(id) {
  const { data } = await api.get(`/orders/${id}`);
  return data;
}

/**
 * Créer une commande
 */
export async function createOrder(payload) {
  const { data } = await api.post("/orders", payload);
  return data;
}

/**
 * Annuler une commande
 */
export async function cancelOrder(id) {
  const { data } = await api.patch(`/orders/${id}/cancel`);
  return data;
}