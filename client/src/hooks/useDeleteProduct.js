import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { deleteProduct } from "@/services/product.service";

export default function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      toast.success(
        data?.message || "Produit supprimé avec succès.",
      );
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          "Impossible de supprimer le produit.",
      );
    },
  });
}