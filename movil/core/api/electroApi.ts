import axios from "axios";

const url =
  process.env.EXPO_PUBLIC_ELECTRO_URL || "http://192.168.0.101:4000/api/";
console.log(url);

export const electroApi = axios.create({
  baseURL: url,
});
