import { API_URL, API_URL_LOCAL } from "@/config/app";

export type CustomHeaders = {
    'x-mdj-device-token'?: string | null;
    'x-mdj-platform'?: string;
}

export default class API {
    static async fetch(endpoint: string, options: RequestInit, headers: CustomHeaders): Promise<any> {
        const apiUrl = process.env.NODE_ENV === 'development' ? API_URL_LOCAL : API_URL;
        const url = `${apiUrl}/${endpoint}`;

        const validHeaders: Record<string, string> = {
            "Content-Type": "application/json",
        };

        if (headers) {
            Object.entries(headers).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    validHeaders[key] = value;
                }
            });
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers: validHeaders,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`); // TODO: Handle HTTP errors
            }
            return response.json();
        } catch (error) {
            throw error;
        }
    }

    static async get(endpoint: string, options: RequestInit, headers: CustomHeaders) {
        return this.fetch(endpoint, {
            method: 'GET',
            ...options,
        }, headers);
    }

    static async post(endpoint: string, options: RequestInit, headers: CustomHeaders) {
        return this.fetch(endpoint, {
            method: 'POST',
            ...options,
        }, headers);
    }

    static async put(endpoint: string, options: RequestInit, headers: CustomHeaders) {
        return this.fetch(endpoint, {
            method: 'PUT',
            ...options,
        }, headers);
    }

    static async delete(endpoint: string, options: RequestInit, headers: CustomHeaders) {
        return this.fetch(endpoint, {
            method: 'DELETE',
            ...options,
        }, headers);
    }
    static async download(endpoint: string): Promise<any> {
        const response = await this.fetch(endpoint, {
            method: 'GET',
        }, {});

        const blob = await response.blob();
        return URL.createObjectURL(blob);
    }
}