const { ipcRenderer } = require('electron');

const axios = require('axios');
const { configAxios, verNombrePc } = require('../funciones');
require('dotenv').config;
const URL = process.env.URL;

const codigo = document.querySelector('#codigo');
const descripcion = document.querySelector('#descripcion');
const stock = document.querySelector('#stock');
const compra = document.querySelector('#Compra');
const suma = document.querySelector('#Suma');
const resta = document.querySelector('#Resta');
const tipoOperacion = document.querySelectorAll('input[name="operacion"]');
const cantidad = document.querySelector('#cantidad');
const nuevoStock = document.querySelector('#nuevoStock');
const aceptar = document.querySelector('.aceptar');
const volver = document.querySelector('.volver');
let movProducto = {};
let vendedor;

ipcRenderer.on('movimiento-producto-abrir', async (e, args) => {
  const [id, usuario] = JSON.parse(args);
  let producto = (await axios.get(`${URL}productos/${id}`, configAxios)).data;
  codigo.value = producto._id;
  descripcion.value = producto.descripcion;
  stock.value = producto.stock;
  vendedor = usuario;
});

let operacion = 'Compra';
function verTipoDeOperacion(tipo) {
  tipo.forEach((e) => {
    e.checked && (operacion = e.value);
  });
}

cantidad.addEventListener('blur', (e) => {
  if (cantidad.value === '') {
    cantidad.value = '0.00';
  }
  verTipoDeOperacion(tipoOperacion);

  if (operacion === 'Compra' || operacion === 'Suma') {
    nuevoStock.value = (parseFloat(cantidad.value) + parseFloat(stock.value)).toFixed(2);
  } else {
    nuevoStock.value = (parseFloat(stock.value) - parseFloat(cantidad.value)).toFixed(2);
  }
});

aceptar.addEventListener('click', async (e) => {
  movProducto.codProd = codigo.value;
  movProducto.descripcion = descripcion.value;
  if (operacion === 'Compra') {
    movProducto.tipo_comp = 'C';
  } else if (operacion === 'Suma') {
    movProducto.tipo_comp = '+';
  } else {
    movProducto.tipo_comp = '-';
  }
  operacion === 'Resta' ? (movProducto.egreso = cantidad.value) : (movProducto.ingreso = cantidad.value);
  movProducto.stock = nuevoStock.value !== '' ? nuevoStock.value : stock.value;
  movProducto.vendedor = vendedor;
  movProducto.maquina = verNombrePc();
  await axios.post(`${URL}movProductos`, [movProducto], configAxios);
  let producto = (await axios.get(`${URL}productos/${movProducto.codProd}`, configAxios)).data;
  producto.stock = movProducto.stock;
  producto.vendedor = vendedor;
  producto.maquina = movProducto.maquina;
  await axios.put(`${URL}productos/${movProducto.codProd}`, producto, configAxios);
  ipcRenderer.send('productoModificado', producto);
  window.close();
});

codigo.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    descripcion.focus();
  }
});

descripcion.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    compra.focus();
  }
});

compra.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    suma.focus();
  }
});

suma.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    resta.focus();
  }
});

resta.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    cantidad.focus();
  }
});

cantidad.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    aceptar.focus();
  }
});

volver.addEventListener('click', (e) => {
  window.close();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    window.close();
  }
});
