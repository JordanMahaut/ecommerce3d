import api from "../api/axios";

export async function getCategories() {
  const response = await api.get("/categories");

  return response.data.categories ?? response.data;
}

export async function createCategory(data) {
  const response = await api.post("/categories", {
    name: data.name,
    slug: data.slug,
    description: data.description,
    isActive: data.isActive,
  });

  return response.data;
}

export async function updateCategory(id, data) {
  const response = await api.put(`/categories/${id}`, {
    name: data.name,
    slug: data.slug,
    description: data.description,
    isActive: data.isActive,
  });

  return response.data;
}

export async function deleteCategory(id) {
  const response = await api.delete(`/categories/${id}`);

  return response.data;
}