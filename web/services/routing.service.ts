import { getApi, postApi } from "@/lib/apiHelpers";
import type { LeadInput } from "@/types";

const simulateRouting = async (input: LeadInput) => {
  return postApi("/routing/simulate", input);
};

const distributeLead = async (input: LeadInput) => {
  return postApi("/routing/distribute", input);
};

const listRoutingHistory = async (page = 1, limit = 10, status?: string) => {
  const statusParam = status ? `&status=${status}` : "";
  return getApi(`/routing/history?page=${page}&limit=${limit}${statusParam}`);
};

const getLead = async (id: string) => {
  return getApi(`/routing/leads/${id}`);
};

export { simulateRouting, distributeLead, listRoutingHistory, getLead };
