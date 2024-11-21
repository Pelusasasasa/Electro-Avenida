require('dotenv').config();
const URL = process.env.URL ;
const URLML = 'https://api.mercadolibre.com/';

const axios = require('axios');
const { ipcRenderer } = require('electron');
const { obtenerAccessToken, buscarinfoProductoPorId, modificarPrecioYStockPorIdDeProducto, buscarVariacionesProducto } = require('./helpers');



const codigoML = document.getElementById('codigoML');
const codigoInterno = document.getElementById('codigoInterno');
const descripcion = document.getElementById('descripcion');
const precioML = document.getElementById('precioML');
const stockML = document.getElementById('stockML');

const agregar = document.getElementById('agregar');
const modificar = document.getElementById('modificar');
const salir = document.getElementById('salir');

let producto = {};
let tipo = 'agregar'

ipcRenderer.on('informacion',async (e, args) => {
    tipo = args;

    //obtenerAccessToken()

    if (tipo === 'agregar'){
        console.log(modificar)
        modificar.classList.add('none');
        //obtenerAccessToken()
    }else{
        agregar.classList.add('none');

        const ml = (await axios.get(`${URL}mercadoLibre/forCodigo/${args}`)).data;
        codigoML.value = ml.codigoML;
        codigoInterno.value = ml.codProd;
        descripcion.value = ml.descripcion;
        precioML.value = ml.precioML.toFixed(2);
        stockML.value = ml.stockML.toFixed(2);
    }
});

const agregarML = async() => {
    const elem = {};
    
    elem.codigoML = codigoML.value;
    elem.codProd = codigoInterno.value;
    elem.descripcion = descripcion.value;
    elem.precioML = precioML.value;
    elem.stockML = stockML.value;

    const res = (await axios.post(`${URL}mercadoLibre`, elem)).data;
    
    window.close();
};

const listarProducto = (elem) => {
    descripcion.value = elem.descripcion;
};

const modificarML = async() => {
    const producto = {};

    producto.codigoML = codigoML.value;
    producto.codProd = codigoInterno.value;
    producto.descripcion = descripcion.value;
    producto.precioML = precioML.value;
    producto.stockML = stockML.value;

    let autherizacion = (await axios.get(`${URL}tipoVenta`)).data.autorizacionML
    const productoML = await buscarinfoProductoPorId(autherizacion, codigoML.value);

    if (productoML.variations.length !== 0) {
        let variaciones = await buscarVariacionesProducto(autherizacion, codigoML.value);
        
        for(let elem of variaciones) {
            elem.price = producto.precioML;
            elem.available_quantity = producto.stockML;

            
        };
    };
    await modificarPrecioYStockPorIdDeProducto(autherizacion, b.variations[0].user_product_id, precioML.value, stockML.value);

    await axios.put(`${URL}mercadoLibre/forCodigo/${codigoML.value}`, producto);

};

agregar.addEventListener('click', agregarML);

modificar.addEventListener('click', modificarML);

codigoML.addEventListener('keypress', e => {
    if (e.keyCode === 13){
        codigoInterno.focus();
    };
});

codigoInterno.addEventListener('keypress', async e => {
    if (e.keyCode === 13){
        producto = (await axios.get(`${URL}productos/${codigoInterno.value}`)).data;
        listarProducto(producto);

        descripcion.focus();
    };
});

descripcion.addEventListener('keypress', e => {
    if (e.keyCode === 13){
        precioML.focus();
    };
});

precioML.addEventListener('keypress', e => {
    if (e.keyCode === 13){
        stockML.focus();
    };
});

stockML.addEventListener('keypress', e => {
    if (e.keyCode === 13){
        agregar.focus();
    };
});

salir.addEventListener('click', e => {
    window.close();
});