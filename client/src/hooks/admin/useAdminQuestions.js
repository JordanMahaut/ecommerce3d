import { useCallback, useEffect, useState } from "react";

import {
  createAdminQuestion,
  deleteAdminQuestion,
  getAdminQuestions,
  reorderAdminQuestions,
  updateAdminQuestion,
} from "../../services/admin/question.service";

export default function useAdminQuestions() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadQuestions = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminQuestions();
      setQuestions(data);
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          "Impossible de charger les questions.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  const createQuestion = async (data) => {
    const question = await createAdminQuestion(data);

    setQuestions((current) =>
      [...current, question].sort((a, b) => a.position - b.position),
    );

    return question;
  };

  const updateQuestion = async (id, data) => {
    const updatedQuestion = await updateAdminQuestion(id, data);

    setQuestions((current) =>
      current.map((question) =>
        question.id === id ? updatedQuestion : question,
      ),
    );

    return updatedQuestion;
  };

  const removeQuestion = async (id) => {
    await deleteAdminQuestion(id);

    setQuestions((current) =>
      current.filter((question) => question.id !== id),
    );
  };

  const reorderQuestions = async (questionIds) => {
    const reorderedQuestions =
      await reorderAdminQuestions(questionIds);

    setQuestions(reorderedQuestions);

    return reorderedQuestions;
  };

  return {
    questions,
    loading,
    error,
    loadQuestions,
    createQuestion,
    updateQuestion,
    removeQuestion,
    reorderQuestions,
  };
}