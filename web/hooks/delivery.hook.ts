import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  createDelivery,
  deleteDelivery,
  getDelivery,
  listDeliveries,
  updateDelivery,
} from "@/services/delivery.service";
import type { DeliveryInput } from "@/types";

const useDeliveriesApi = (page = 1, limit = 10) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const deliveriesQuery = useQuery({
    queryKey: ["deliveries", page, limit],
    queryFn: () => listDeliveries(page, limit),
  });

  const createMutation = useMutation({
    mutationFn: (input: DeliveryInput) => createDelivery(input),
    onSuccess: () => {
      toast.success("Delivery created");
      queryClient.invalidateQueries({ queryKey: ["deliveries"] });
      router.push("/dashboard/deliveries");
    },
    onError: (error) => {
      toast.error((error as Error).message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: Partial<DeliveryInput>;
    }) => updateDelivery(id, input),
    onSuccess: () => {
      toast.success("Delivery updated");
      queryClient.invalidateQueries({ queryKey: ["deliveries"] });
      router.push("/dashboard/deliveries");
    },
    onError: (error) => {
      toast.error((error as Error).message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteDelivery(id),
    onSuccess: () => {
      toast.success("Delivery deleted");
      queryClient.invalidateQueries({ queryKey: ["deliveries"] });
    },
    onError: (error) => {
      toast.error((error as Error).message);
    },
  });

  return { deliveriesQuery, createMutation, updateMutation, deleteMutation };
};

const useDeliveryApi = (id: string) => {
  return useQuery({
    queryKey: ["delivery", id],
    queryFn: () => getDelivery(id),
    enabled: !!id,
  });
};

export { useDeliveriesApi, useDeliveryApi };
