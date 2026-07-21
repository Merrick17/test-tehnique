import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  createClient,
  deleteClient,
  getClient,
  listClients,
  updateClient,
} from "@/services/client.service";
import type { ClientInput } from "@/types";

const useClientsApi = (page = 1, limit = 10) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const clientsQuery = useQuery({
    queryKey: ["clients", page, limit],
    queryFn: () => listClients(page, limit),
  });

  const createMutation = useMutation({
    mutationFn: (input: ClientInput) => createClient(input),
    onSuccess: () => {
      toast.success("Client created");
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      router.push("/dashboard/clients");
    },
    onError: (error) => {
      toast.error((error as Error).message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<ClientInput> }) =>
      updateClient(id, input),
    onSuccess: () => {
      toast.success("Client updated");
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      router.push("/dashboard/clients");
    },
    onError: (error) => {
      toast.error((error as Error).message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteClient(id),
    onSuccess: () => {
      toast.success("Client deleted");
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
    onError: (error) => {
      toast.error((error as Error).message);
    },
  });

  return { clientsQuery, createMutation, updateMutation, deleteMutation };
};

const useClientApi = (id: string) => {
  return useQuery({
    queryKey: ["client", id],
    queryFn: () => getClient(id),
    enabled: !!id,
  });
};

export { useClientsApi, useClientApi };
