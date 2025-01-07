import axios from 'axios';
const URL = process.env.REACT_APP_URL

export const deleteOnePublicacion = async(codigoML) => {
    const res = (await axios.delete(`${URL}mercadoLibre/forCodigo/${codigoML}`)).data;

    return res
};

export const modificarPublicacion = async(id, precio, stock, unidadPack, tipoVenta) => {

    const res = (await axios.put(`${URL}mercadoLibre/forCodigo/${id}`,{
            precioML: precio,
            stockML: stock,
            unidadPack,
            tipoVenta
    }));

    return res.data

};

export const agregarPublicaciones = async(publicacion) => {
    const res = (await axios.post(`${URL}mercadoLibre`, publicacion)).data;
    const productoRelacionado = (await axios.get(`${URL}productos/${res.codProd}`)).data;
    

    res.costo = parseFloat(productoRelacionado.costo);
    res.costodolar = parseFloat(productoRelacionado.costodolar);
    res.impuesto = parseFloat(productoRelacionado.impuestos);
    
    
    return res;
}

export const traerPublicaciones = async() => {
    const res = (await axios.get(`${URL}mercadoLibre`)).data;
    
    for (let elem of res) {
        const productoRelacionado = (await axios.get(`${URL}productos/${elem.codProd}`)).data;

        elem.costo = parseFloat(productoRelacionado.costo);
        elem.costodolar = parseFloat(productoRelacionado.costodolar);
        elem.impuesto = parseFloat(productoRelacionado.impuestos);
        elem.stock = productoRelacionado.stock - (productoRelacionado.stock * 10 / 100);
    }

    return res
};

export const traerPublicacion = async(id) => {
    const res = (await axios.get(`${URL}mercadoLibre/forCodigo/${id}`)).data;
    if (res) {
        const productoRelacionado = (await axios.get(`${URL}productos/${res.codProd}`)).data;
    
        res.costo = parseFloat(productoRelacionado.costo);
        res.costodolar = parseFloat(productoRelacionado.costodolar);
        res.impuesto = parseFloat(productoRelacionado.impuestos);
    }
    
    return res;

};
