import { useQuery } from "@tanstack/react-query";
import { getDashboard } from "@/services/dashboard.service";

export default function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboard,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}