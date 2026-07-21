import { getApi } from "@/lib/apiHelpers";

const listVerticals = async () => {
  return getApi("/verticals");
};

export { listVerticals };
