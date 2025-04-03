const axios = require('axios');
require('dotenv').config();

const gananciaML = 30;
const porcentajeDescuentoML = 0.71;
const envio = 28000;
const primerCostoFijo = 12000;
const segundoCostoFijo = 28000;
const valorPrimerCostoFijo = 900;
const valorSegundoCostoFijo = 1800;

const { devolveDireccion, obtenerInformacionUsuario, buscarIDDeProductoPorSKU, buscarMilItems, buscarinfoProductoPorId, modificarPrecioPorIdDeProducto, modificarPrecioYStockPorIdDeProducto, filtrarPorTitle, obtenerAccessToken } = require('./helpers');
const { ipcRenderer } = require('electron');
const URL = process.env.URL;

const client_id = '8351426981367452';
const aux = 'https://api.mercadolibre.com/';
const client_secret = 'n03VlrPoBnTyRmGDtDusOQwuu7qaNpHv';
const code = 'TG-670e5faf324be700011ea691-231090073'
const refresh_token = "TG-670e60957e88f500012c13e8-231090073"
const redirect_uri = 'https://www.electro-avenida.com.ar/';

let autherizacion = "APP_USR-8351426981367452-110710-f9931ad7fab07741a3fe89b74841d393-231090073";
const id = 231090073;

let productos = [];
let seleccionado;
let subSeleccionado;
let autorizacion = '';

const buscador = document.getElementById('buscador');
const agregar = document.getElementById('agregar');
const modificar = document.getElementById('modificar');
const eliminar = document.getElementById('eliminar');

const tbody = document.getElementById('tbody');

let publicaciones = [];

const calcularPrecioSujerido = (product, dolar) => {
  let conIva = product.costodolar !== 0 ? parseFloat(product.impuestos) + product.costodolar * dolar : parseFloat(product.costo) + parseFloat(product.impuestos);
  let total = parseFloat((conIva).toFixed(2));
  let precioML = 0;

  let utilidad = total + (total * gananciaML / 100);
  let descuentoML = (utilidad / porcentajeDescuentoML) - utilidad;
  let costoEnvio = 0;
  let costoFijo = 0;

  //Vemos cuanto nos cobran del envio en mercado libre dependiendo de la utilidad
  if (utilidad > envio) {
    costoEnvio = 6779
  } else {
    costoEnvio = 0;
  };

  //Vemos cuanto nos descuentan por el costo fijo dependiendo de el valor de la utilidad
  if (utilidad < primerCostoFijo) {
    costoFijo = valorPrimerCostoFijo;
  } else if (utilidad < segundoCostoFijo) {
    costoFijo = valorSegundoCostoFijo;
  } else {
    costoFijo = 0;
  };

  precioML = utilidad + descuentoML + costoEnvio + costoFijo;
  return precioML.toFixed(2);
};

const cargarPagina = async () => {
  const numeros = (await axios.get(`${URL}tipoVenta`)).data;
  autorizacion = numeros.autorizacionML;

  const res = await obtenerInformacionUsuario(autorizacion);

  if (!res) {
    numeros.autorizacionML = await obtenerAccessToken();
    autorizacion = numeros.autorizacionML
    await axios.put(`${URL}tipoVenta`, numeros);
  }


  publicaciones = (await axios.get(`${URL}mercadoLibre`)).data;
  console.log(publicaciones)
  listarProductos(publicaciones.filter(elem => elem.esCatalogo));
};

const clickEnTBody = (e) => {
  if (e.target.nodeName === 'TD') {
    seleccionado && seleccionado.classList.remove('seleccionado');
    subSeleccionado && subSeleccionado.classList.remove('subSeleccionado');

    seleccionado = e.target.parentNode;
    subSeleccionado = e.target;

    seleccionado.classList.add('seleccionado');
    subSeleccionado.classList.add('subSeleccionado');
  }
};

const deleteProduct = async (e) => {
  if (seleccionado) {
    const res = (await axios.delete(`${URL}mercadoLibre/forCodigo/${seleccionado.id}`)).data;
    tbody.removeChild(seleccionado)
    seleccionado = '';
  };
};

const handleSearch = async (text) => {
  productos = [];
  const ids = await filtrarPorTitle(id, autherizacion, text);

  for await (let id of ids.results) {
    const pro = await buscarinfoProductoPorId(autherizacion, id);
    productos.push(pro);
  };

  listarProductos(productos);
};

const listarProductos = async (lista) => {
  tbody.innerHTML = '';

  lista.sort((a, b) => {
    if (a.descripcion < b.descripcion) {
      return -1;
    };

    if (a.descripcion > b.descripcion) {
      return 1;
    };

    return 0;
  });

  for await (let elem of lista) {

    const tr = document.createElement('tr');
    tr.id = elem.codigoML;

    const tdCodigo = document.createElement('td');
    const tdDescripcion = document.createElement('td');
    const tdCostoIva = document.createElement('td');
    const tdPrecio = document.createElement('td');
    const tdStock = document.createElement('td');
    const tdPrecioML = document.createElement('td');
    const tdStockML = document.createElement('td');

    const dolar = (await axios.get(`${URL}tipoVenta`)).data.dolar;
    const pro = (await axios.get(`${URL}productos/${elem.codProd}`)).data;
    const costoIva = pro.costodolar === 0 ? (parseFloat(pro.costo) + parseFloat(pro.impuestos)) : ((pro.costodolar + (pro.costodolar * parseFloat(pro.impuestos) / 100)) * dolar);
    const precio = calcularPrecioSujerido(pro, dolar);
    tdPrecio.innerText = precio;
    tdCostoIva.innerText = costoIva.toFixed(2);
    tdStock.innerText = pro.stock;

    tdCodigo.innerText = elem.codigoML;
    tdDescripcion.innerText = elem.descripcion.slice(0, 35).toUpperCase();
    tdPrecioML.innerText = elem.precioML.toFixed(2);
    tdStockML.innerText = elem.stockML.toFixed(2);

    tdCodigo.classList.add('border');
    tdDescripcion.classList.add('border');
    tdCostoIva.classList.add('border');
    tdPrecioML.classList.add('border');
    tdStock.classList.add('border');
    tdPrecio.classList.add('border');
    tdStockML.classList.add('border');

    tdCostoIva.classList.add('text-end');
    tdPrecioML.classList.add('text-end');
    tdStock.classList.add('text-end');
    tdPrecio.classList.add('text-end');
    tdStockML.classList.add('text-end');

    tdPrecioML.classList.add('text-bold');
    tdStockML.classList.add('text-bold');

    tr.appendChild(tdCodigo);
    tr.appendChild(tdDescripcion);
    tr.appendChild(tdCostoIva);
    tr.appendChild(tdPrecio);
    tr.appendChild(tdStock);
    tr.appendChild(tdPrecioML);
    tr.appendChild(tdStockML);

    tbody.appendChild(tr);

  }
};

const producto = async (e) => {
  ipcRenderer.send('abrir-ventana-argumentos', {
    path: 'mercadoLibre/producto.html',
    width: 1200,
    heigth: 900,
    informacion: e.target.id === 'agregar' ? 'agregar' : seleccionado.id
  })
};

// agregar.addEventListener('click', producto);
// modificar.addEventListener('click', producto);
// eliminar.addEventListener('click', deleteProduct);
tbody.addEventListener('click', clickEnTBody);

buscador.addEventListener('keypress', async e => {
  if (e.keyCode === 13) {
    await handleSearch(e.target.value);
  }
});

window.addEventListener('load', cargarPagina);

document.addEventListener('keyup', e => {
  if (e.keyCode === 27) {
    location.href = '../index.html';
  }
});

// obtenerAccessToken();
// obtenerInformacionUsuario(autherizacion)
// devolveDireccion(id, autherizacion)
// buscarMilItems(id, autherizacion);
// buscarIDDeProductoPorSKU(id, autherizacion, '210-115');
// buscarinfoProductoPorId(autherizacion, 'MLA1434872357');
// modificarPrecioPorIdDeProducto(autherizacion, 'MLA1434872357', 16300);

async function permitirUsuario() {

  const url = `https://auth.mercadolibre.com.ar/authorization?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}`;

  window.location.href = url;
};


