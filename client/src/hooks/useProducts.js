import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/services/product.service";

export default function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });
}