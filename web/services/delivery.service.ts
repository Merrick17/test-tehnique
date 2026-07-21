import { deleteApi, getApi, postApi, putApi } from "@/lib/apiHelpers";
import type { DeliveryInput } from "@/types";

const listDeliveries = async (page = 1, limit = 10) => {
  return getApi(`/deliveries?page=${page}&limit=${limit}`);
};

const getDelivery = async (id: string) => {
  return getApi(`/deliveries/${id}`);
};

const createDelivery = async (input: DeliveryInput) => {
  return postApi("/deliveries", input);
};

const updateDelivery = async (id: string, input: Partial<DeliveryInput>) => {
  return putApi(`/deliveries/${id}`, input);
};

const deleteDelivery = async (id: string) => {
  return deleteApi(`/deliveries/${id}`);
};

export {
  listDeliveries,
  getDelivery,
  createDelivery,
  updateDelivery,
  deleteDelivery,
};
