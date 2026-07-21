import { deleteApi, getApi, postApi, putApi } from "@/lib/apiHelpers";
import type { ClientInput } from "@/types";

const listClients = async (page = 1, limit = 10) => {
  return getApi(`/clients?page=${page}&limit=${limit}`);
};

const getClient = async (id: string) => {
  return getApi(`/clients/${id}`);
};

const createClient = async (input: ClientInput) => {
  return postApi("/clients", input);
};

const updateClient = async (id: string, input: Partial<ClientInput>) => {
  return putApi(`/clients/${id}`, input);
};

const deleteClient = async (id: string) => {
  return deleteApi(`/clients/${id}`);
};

export { listClients, getClient, createClient, updateClient, deleteClient };
