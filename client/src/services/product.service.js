import api from "@/api/axios";

export async function getProducts() {
  const { data } = await api.get("/products");

  return data;
}

export async function getProductBySlug(slug) {
  const { data } = await api.get(`/products/${slug}`);

  return data;
}

export async function createProduct(formData) {
  const { data } = await api.post("/products", formData);

  return data;
}

export async function updateProduct(id, formData) {
  const { data } = await api.put(`/products/${id}`, formData);

  return data;
}

export async function deleteProduct(id) {
  const { data } = await api.delete(`/products/${id}`);

  return data;
}