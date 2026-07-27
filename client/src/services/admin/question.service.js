import api from "../../api/axios";

export async function getAdminQuestions() {
  const response = await api.get("/admin/questions");
  return response.data.questions;
}

export async function createAdminQuestion(data) {
  const response = await api.post("/admin/questions", data);
  return response.data.question;
}

export async function updateAdminQuestion(id, data) {
  const response = await api.put(`/admin/questions/${id}`, data);
  return response.data.question;
}

export async function deleteAdminQuestion(id) {
  const response = await api.delete(`/admin/questions/${id}`);
  return response.data.question;
}

export async function reorderAdminQuestions(questionIds) {
  const response = await api.patch("/admin/questions/reorder", {
    questionIds,
  });

  return response.data.questions;
}