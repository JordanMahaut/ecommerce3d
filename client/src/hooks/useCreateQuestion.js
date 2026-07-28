import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { createQuestion } from "@/services/question.service";

export default function useCreateQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createQuestion,

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["questions"],
      });

      toast.success(
        data.message || "Question créée avec succès."
      );
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          "Impossible de créer la question."
      );
    },
  });
}