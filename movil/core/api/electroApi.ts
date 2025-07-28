import axios from 'axios';

export const electroApi = axios.create({
    baseURL: process.env.EXPO_PUBLIC_ELECTRO_URL || 'http://190.185.129.113:4000/api/',
});