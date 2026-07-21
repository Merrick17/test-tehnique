 import { loginUser } from "@/services/auth.service";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import axios from "axios";
const useAuthApi = () => {
    const router = useRouter();
    const loginMutation = useMutation({
        mutationFn: async ({ email, password }: { email: string; password: string }) => {
            const response = await loginUser(email, password);
            return response;
        },
        onSuccess: (data) => {
            localStorage.setItem("token", data.token);
            axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
            router.replace("/dashboard");
        },
        onError: (error) => {
            toast.error((error as Error).message);
        },
    });

    const logout = () => {
        localStorage.removeItem("token");
        delete axios.defaults.headers.common["Authorization"];
        router.replace("/login");
    };

    return { loginMutation, logout };
};
export default useAuthApi;
