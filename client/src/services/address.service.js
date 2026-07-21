import api from "../api/axios";

export async function getAddresses() {
  const { data } = await api.get("/addresses");
  return data;
}

export async function createAddress(address) {
  const { data } = await api.post("/addresses", address);
  return data;
}

export async function updateAddress(id, address) {
  const { data } = await api.put(`/addresses/${id}`, address);
  return data;
}

export async function deleteAddress(id) {
  await api.delete(`/addresses/${id}`);
}

export async function setDefaultAddress(id) {
  const { data } = await api.patch(`/addresses/${id}/default`);
  return data;
}