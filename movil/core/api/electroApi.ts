import axios from 'axios';

const url = process.env.EXPO_PUBLIC_ELECTRO_URL || 'http://190.185.129.113:4000/api/';
console.log(url);

export const electroApi = axios.create({
    baseURL: url
});