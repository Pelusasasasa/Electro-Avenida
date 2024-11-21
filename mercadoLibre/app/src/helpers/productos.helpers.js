import axios from 'axios';
const URL = process.env.REACT_APP_URL;

export const getProducto = async( id ) => {
    const res = (await axios.get(`${URL}productos/${id}`)).data;
    return res;
};