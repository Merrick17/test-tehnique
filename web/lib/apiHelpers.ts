import { AxiosError } from "axios";
import axios from "axios";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

const postApi = async <T>(url: string, data: T) => {
    try {
        const response = await axios.post(url, data);
        return response.data;
    } catch (error: unknown) {
        if (error instanceof AxiosError && error.response) {
            throw new Error(`PATCH ${url} failed with status ${error.response.status}: ${error.response.statusText}`);
        }
        throw error;
    }
}

const getApi = async (url: string) => {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error: unknown) {
        if (error instanceof AxiosError && error.response) {
            throw new Error(`PATCH ${url} failed with status ${error.response.status}: ${error.response.statusText}`);
        }
        throw error;
    }
}
const putApi = async (url: string, data: any) => {
    try {
        const response = await axios.put(url, data);
        return response.data;
    } catch (error: unknown) {
        if (error instanceof AxiosError && error.response) {
            throw new Error(`PATCH ${url} failed with status ${error.response.status}: ${error.response.statusText}`);
        }
        throw error;
    }
}

const deleteApi = async (url: string) => {
    try {
        const response = await axios.delete(url);
        return response.data;
    } catch (error: any) {
        if (error instanceof AxiosError && error.response) {
            throw new Error(`PATCH ${url} failed with status ${error.response.status}: ${error.response.statusText}`);
        }
        throw error;
    }
}

const patchApi = async (url: string, data: any) => {
    try {
        const response = await axios.patch(url, data);
        return response.data;
    } catch (error: unknown) {
        if (error instanceof AxiosError && error.response) {
            throw new Error(`PATCH ${url} failed with status ${error.response.status}: ${error.response.statusText}`);
        }
        throw error;
    }
}

export { postApi, getApi, putApi, deleteApi, patchApi };
