import axios from 'axios';
const URL = process.env.REACT_APP_URL

export const deleteOnePublicacion = async(codigoML) => {
    const res = (await axios.delete(`${URL}mercadoLibre/forCodigo/${codigoML}`)).data;

    return res
};

export const modificarPublicacion = async(id, precio, stock) => {

    const res = (await axios.put(`${URL}mercadoLibre/forCodigo/${id}`,{
            precioML: precio,
            stockML: stock
    }));

    return res.data

};

export const traerPublicaciones = async() => {
    const res = (await axios.get(`${URL}mercadoLibre`)).data;

    for (let elem of res) {
        const productoRelacionado = (await axios.get(`${URL}productos/${elem.codProd}`)).data;
    
        elem.costo = productoRelacionado.costodolar !== 0 ? productoRelacionado.costodolar : parseFloat(productoRelacionado.costo);
        elem.impuesto = parseFloat(productoRelacionado.impuestos);
    }

    return res
};

export const traerPublicacion = async(id) => {
    const res = (await axios.get(`${URL}mercadoLibre/forCodigo/${id}`)).data;
    const productoRelacionado = (await axios.get(`${URL}productos/${res.codProd}`)).data;
    
    res.costo = productoRelacionado.costodolar !== 0 ? productoRelacionado.costodolar : parseFloat(productoRelacionado.costo);
    res.impuesto = parseFloat(productoRelacionado.impuestos);
    
    return res;

};
