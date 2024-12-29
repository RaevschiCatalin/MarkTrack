import axios from 'axios';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const api = axios.create({
    baseURL: apiBaseUrl,
    headers: { 'Content-Type': 'application/json' },
});

export const postRequest = async <T>(url: string, data: T) => {
    try {
        const response = await api.post(url, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getRequest = async (url: string) => {
    try {
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        throw error;
    }
};