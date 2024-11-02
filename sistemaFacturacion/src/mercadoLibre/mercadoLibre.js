const axios = require('axios');
require('dotenv').config();

const gananciaML = 30;
const porcentajeDescuentoML = 0.79;
const envio = 28000;
const primerCostoFijo = 12000;
const segundoCostoFijo = 28000;
const valorPrimerCostoFijo = 900;
const valorSegundoCostoFijo = 1800;


const { devolveDireccion, obtenerInformacionUsuario, buscarIDDeProductoPorSKU,buscarMilItems, buscarinfoProductoPorId, modificarPrecioPorIdDeProducto, modificarPrecioYStockPorIdDeProducto, filtrarPorTitle } = require('./helpers');
const aux = 'https://api.mercadolibre.com/';
const URL = process.env.URL;
const client_id = '8351426981367452';
const client_secret = 'n03VlrPoBnTyRmGDtDusOQwuu7qaNpHv';
const redirect_uri = 'https://www.electro-avenida.com.ar/';
const code = 'TG-670e5faf324be700011ea691-231090073'
const refresh_token = "TG-670e60957e88f500012c13e8-231090073"
let autherizacion = "";
const id = 231090073;

let productos = [];

const buscador = document.getElementById('buscador');

const tbody = document.getElementById('tbody');

const calcularPrecioSujerido = (product, dolar) => {
    let conIva = product.costodolar !== 0 ? parseFloat(product.impuestos) + product.costodolar : product.costo + parseFloat(product.impuestos);
    let total = parseFloat((conIva * dolar).toFixed(2));

    let precioML = 0;

    let utilidad  = total + (total * gananciaML / 100);
    let descuentoML = (utilidad / porcentajeDescuentoML) - utilidad;
    let costoEnvio = 0;
    let costoFijo = 0;

    //Vemos cuanto nos cobran del envio en mercado libre dependiendo de la utilidad
    if (utilidad > envio){
      costoEnvio = 5767.19
    }else{
      costoEnvio = 0;
    };

    //Vemos cuanto nos descuentan por el costo fijo dependiendo de el valor de la utilidad
    if (utilidad < primerCostoFijo){
      costoFijo = valorPrimerCostoFijo;
    }else if (utilidad < segundoCostoFijo){
      costoFijo = valorSegundoCostoFijo;
    }else{
      costoFijo = 0;
    };

    precioML = utilidad + descuentoML + costoEnvio + costoFijo;

    return precioML.toFixed(2);
};

const cargarPagina = async() => {

  autherizacion = (await axios.get(`${URL}mercadoLibre/autherizacion`)).data.autherizacion; //Traemos la authorizacion desde la base de datos

  const ids = await buscarMilItems(id, autherizacion);//Buscamos los primeros items

  //En el caso de que no busque los items renueva el codigo de authorizacion
  if (ids.response?.data.message === 'invalid_token'){
    
    const res = await obtenerAccessToken();

    autherizacion = (await axios.put(`${URL}mercadoLibre/autherizacion`, {res}));
    // location.reload();
  }
  
  for await(let id of ids.results){
    const pro = await buscarinfoProductoPorId(autherizacion, id);
    productos.push(pro);
  };

  listarProductos(productos);
};

const handleSearch = async(text) => {
  productos = [];
  const ids = await filtrarPorTitle(id, autherizacion, text);
  
  for await(let id of ids.results){
    const pro = await buscarinfoProductoPorId(autherizacion, id);
    productos.push(pro);
  };

  listarProductos(productos);
};

const listarProductos = async(lista) => {
  tbody.innerHTML = '';

  lista.sort( (a,b) => {
    if (a.title < b.title){
      return -1;
    };

    if (a.title > b.title){
      return 1;
    };

    return 0;
  })

  for await(let elem of lista){
    
    const tr = document.createElement('tr');
    tr.id = elem.id;


    const tdSKU = document.createElement('td');
    const tdCodigo = document.createElement('td');
    const tdDescripcion = document.createElement('td');
    const tdCostoIva = document.createElement('td');
    const tdPrecioML = document.createElement('td');
    const tdStock = document.createElement('td');
    const tdPrecio = document.createElement('td');
    const tdStockML = document.createElement('td');

        const _id = elem.attributes.find(attr => attr.id === 'SELLER_SKU')?.value_name
    if (_id){

      const dolar = (await axios.get(`${URL}tipoVenta`)).data.dolar;
      const pro = (await axios.get(`${URL}productos/${_id}`)).data;

      const costoIva = pro.costodolar === 0 ? pro.costo + (pro.costo * pro.impuestos / 100) : pro.costodolar + (pro.costodolar * pro.impuestos / 100) * dolar;
      const precioML = calcularPrecioSujerido(pro, dolar);
      tdPrecioML.innerText = precioML;
      tdCostoIva.innerText = costoIva.toFixed(2);
      tdStock.innerText = pro.stock;

    };

    tdSKU.innerText = elem.attributes.find(attr => attr.id === 'SELLER_SKU')?.value_name;
    tdCodigo.innerText = elem.id;
    tdDescripcion.innerText = elem.title.slice(0,35).toUpperCase();
    tdPrecio.innerText = elem.price.toFixed(2);
    tdStockML.innerText = elem.available_quantity.toFixed(2);

    tdSKU.classList.add('border');
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

    tdPrecio.classList.add('text-bold');
    tdStockML.classList.add('text-bold');

    tr.appendChild(tdSKU);
    tr.appendChild(tdCodigo);
    tr.appendChild(tdDescripcion);
    tr.appendChild(tdCostoIva);
    tr.appendChild(tdPrecioML);
    tr.appendChild(tdStock);
    tr.appendChild(tdPrecio);
    tr.appendChild(tdStockML);

    tbody.appendChild(tr);

  }
};

async function permitirUsuario() {

  const url = `https://auth.mercadolibre.com.ar/authorization?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}`;

  window.location.href = url;
};

 async function obtenerAccessToken() {
  
   try {
     const respuesta = await axios.post(`${aux}oauth/token`, {
      grant_type: 'refresh_token',
      client_id,
      client_secret,
      redirect_uri,
      refresh_token,
      code,
    });
    console.log(respuesta.data)
    console.log('Access Token:', respuesta.data.access_token);
    return respuesta.data.access_token;
  } catch (error) {
    console.error('Error obteniendo el token:', error.response.data);
  }
};

buscador.addEventListener('keypress',async e => {
  if(e.keyCode === 13){
    await handleSearch(e.target.value);
  }
});

window.addEventListener('load', cargarPagina);

// obtenerAccessToken();


// obtenerInformacionUsuario(autherizacion)
// devolveDireccion(id, autherizacion)
// buscarMilItems(id, autherizacion);
// buscarIDDeProductoPorSKU(id, autherizacion, '210-115');
// buscarinfoProductoPorId(autherizacion, 'MLA1434872357');
// modificarPrecioPorIdDeProducto(autherizacion, 'MLA1434872357', 16300);


document.addEventListener('keyup', e => {
  if (e.keyCode === 27){
    location.href = '../index.html';
  }
});