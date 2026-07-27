import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { createProduct } from "@/services/product.service";

export default function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      toast.success(
        data?.message || "Produit créé avec succès.",
      );
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          "Impossible de créer le produit.",
      );
    },
  });
}