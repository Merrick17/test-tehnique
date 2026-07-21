import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  distributeLead,
  getLead,
  listRoutingHistory,
  simulateRouting,
} from "@/services/routing.service";
import type { LeadInput } from "@/types";

const useRoutingApi = () => {
  const queryClient = useQueryClient();

  const simulateMutation = useMutation({
    mutationFn: (input: LeadInput) => simulateRouting(input),
    onError: (error) => {
      toast.error((error as Error).message);
    },
  });

  const distributeMutation = useMutation({
    mutationFn: (input: LeadInput) => distributeLead(input),
    onSuccess: () => {
      toast.success("Lead distributed");
      queryClient.invalidateQueries({ queryKey: ["routing-history"] });
    },
    onError: (error) => {
      toast.error((error as Error).message);
    },
  });

  return { simulateMutation, distributeMutation };
};

const useRoutingHistoryApi = (page = 1, limit = 10, status?: string) => {
  return useQuery({
    queryKey: ["routing-history", page, limit, status],
    queryFn: () => listRoutingHistory(page, limit, status),
  });
};

const useLeadApi = (id: string) => {
  return useQuery({
    queryKey: ["lead", id],
    queryFn: () => getLead(id),
    enabled: !!id,
  });
};

export { useRoutingApi, useRoutingHistoryApi, useLeadApi };
