import { useQuery } from "@tanstack/react-query";
import { listVerticals } from "@/services/vertical.service";

const useVerticalsApi = () => {
  return useQuery({
    queryKey: ["verticals"],
    queryFn: () => listVerticals(),
  });
};

export { useVerticalsApi };
