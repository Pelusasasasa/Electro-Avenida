const {ipcRenderer} = require('electron');
const axios = require('axios');
const { configAxios } = require('../funciones');
require('dotenv').config
const URL = process.env.URL;

const puntoVenta = document.querySelector('#puntoVenta');
const numero = document.querySelector('#numero');

const aceptar = document.querySelector('.aceptar');
const cancelar = document.querySelector('.cancelar');

aceptar.addEventListener('click',async e=>{
    let punto = puntoVenta.value.padStart(4,'0');
    let numeroVenta = numero.value.padStart(8,'0');
    const comprobante = punto + "-" + numeroVenta;
    let tipoVenta = ""
    let venta;
    let cliente;
    if (punto === "0001" || punto === "0002" || punto === "0003" ) {
        tipoVenta = "Presupuesto";
        venta = (await axios.get(`${URL}presupuesto/${comprobante}`,configAxios)).data;
        console.log(venta.cliente)
        cliente = (await axios.get(`${URL}clientes/id/${venta.cliente}`,configAxios)).data;
    }else if(punto === "0004"){
        tipoVenta = "Recibos_P";
        venta = (await axios.get(`${URL}recibos/forNro_comp/${comprobante}`)).data;
        cliente = (await axios.get(`${URL}clientes/id/${venta.codigo}`,configAxios)).data;
    }else if(punto === "0007"){
        tipoVenta = "Prestamo";
        venta = (await axios.get(`${URL}prestamos/forNumber/${comprobante}`,configAxios)).data;
        cliente = (await axios.get(`${URL}clientes/id/${venta.codigo}`,configAxios)).data;
    };
    const movimientos  = (await axios.get(`${URL}movProductos/${comprobante}/${tipoVenta}`)).data;;
    ipcRenderer.send('imprimir-venta',[venta,cliente,false,1,"imprimir-comprobante","valorizado",movimientos])
});

puntoVenta.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
        numero.focus();
    }
});

numero.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
        aceptar.focus();
    }
});

cancelar.addEventListener('click',e=>{
    window.close();
});

document.addEventListener('keyup',e=>{
    if (e.keyCode === 27) {
        window.close();
    }
});