import api from "@/api/axios";

export async function getDashboard() {
  try {
    const { data } = await api.get("/dashboard");

    return data.stats;
  } catch (error) {
    console.error("Erreur lors du chargement du dashboard :", error);

    throw error;
  }
}