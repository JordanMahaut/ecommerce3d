import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { updateProduct } from "@/services/product.service";

export default function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, formData }) =>
      updateProduct(id, formData),

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      toast.success(
        data?.message || "Produit modifié avec succès.",
      );
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          "Impossible de modifier le produit.",
      );
    },
  });
}