import { postApi } from "@/lib/apiHelpers";
const loginUser = async (email: string, password: string) => {
  const response = await postApi("/auth/login", { email, password });
  return response;
};

export { loginUser };
