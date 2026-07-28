import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from "@/services/question.service";

export function useCreateQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createQuestion,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["questions"],
      });

      toast.success("Question créée avec succès");
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message ??
          "Impossible de créer la question",
      );
    },
  });
}

export function useUpdateQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, question }) => updateQuestion(id, question),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["questions"],
      });

      toast.success("Question modifiée avec succès");
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message ??
          "Impossible de modifier la question",
      );
    },
  });
}

export function useDeleteQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteQuestion,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["questions"],
      });

      toast.success("Question supprimée");
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message ??
          "Impossible de supprimer la question",
      );
    },
  });
}