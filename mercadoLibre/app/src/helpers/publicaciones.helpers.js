import axios from 'axios';
const URL = process.env.REACT_APP_URL

export const traerPublicaciones = async() => {
    const res = (await axios.get(`${URL}mercadoLibre`)).data;
    return res
};

export const traerPublicacion = async(id) => {
    const res = (await axios.get(`${URL}mercadoLibre/forCodigo/${id}`)).data;

    return res;

};


export const modificarPublicacion = async(id, precio, stock) => {

    const res = (await axios.put(`${URL}mercadoLibre/forCodigo/${id}`,{
            precioML: precio,
            stockML: stock
    }));

    return res.data

};