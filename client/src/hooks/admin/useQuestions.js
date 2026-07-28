import { useQuery } from "@tanstack/react-query";
import { getQuestions } from "@/services/question.service";

export function useQuestions() {
  return useQuery({
    queryKey: ["questions"],
    queryFn: getQuestions,
  });
}