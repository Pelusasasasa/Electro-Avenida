import axios from 'axios';

export const electroApi = axios.create({
    baseURL: process.env.EXPO_PUBLIC_ELECTRO_URL,
});