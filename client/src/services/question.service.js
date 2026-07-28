import api from "@/api/axios";

export async function getQuestions() {
  try {
    const { data } = await api.get("/questions");
    console.log("Réponse questions :", data);

    return data.questions ?? data.data ?? data ?? [];
  } catch (error) {
    console.error("Erreur questions :", {
      url: error.config?.baseURL + error.config?.url,
      status: error.response?.status,
      response: error.response?.data,
    });

    throw error;
  }
}

export async function getQuestion(id) {
  const { data } = await api.get(`/questions/${id}`);
  return data;
}

export async function createQuestion(question) {
  const { data } = await api.post("/questions", question);
  return data;
}

export async function updateQuestion(id, question) {
  const { data } = await api.put(`/questions/${id}`, question);
  return data;
}

export async function deleteQuestion(id) {
  const { data } = await api.delete(`/questions/${id}`);
  return data;
}

export async function reorderQuestions(questionIds) {
  const { data } = await api.patch("/questions/reorder", {
    questionIds,
  });

  return data;
}