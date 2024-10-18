const axios = require('axios');
require('dotenv').config();

const gananciaML = 30;
const porcentajeDescuentoML = 0.79;
const envio = 28000;
const primerCostoFijo = 12000;
const segundoCostoFijo = 28000;
const valorPrimerCostoFijo = 900;
const valorSegundoCostoFijo = 1800;


const { devolveDireccion, obtenerInformacionUsuario, buscarIDDeProductoPorSKU,buscarMilItems, buscarinfoProductoPorId, modificarPrecioPorIdDeProducto, modificarPrecioYStockPorIdDeProducto } = require('./helpers');
const aux = 'https://api.mercadolibre.com/';
const URL = process.env.URL;
const client_id = '8351426981367452';
const client_secret = 'n03VlrPoBnTyRmGDtDusOQwuu7qaNpHv';
const redirect_uri = 'https://www.electro-avenida.com.ar/';
const code = 'TG-670e5faf324be700011ea691-231090073'
const refresh_token = "TG-670e60957e88f500012c13e8-231090073"
const autherizacion = "APP_USR-8351426981367452-101609-9d645b5a9f465fb331065019cae633ca-231090073"
const id = 231090073;


//Modificar Producto
const seccionModificar = document.getElementById('seccionModificar');

const sku = document.getElementById('sku');
const codigo = document.getElementById('codigo');
const costoIva = document.getElementById('costoIva');
const precioSujerido = document.getElementById('precioSujerido');
const stockSujerido = document.getElementById('stockSujerido');

const nombre = document.getElementById('nombre');

const precio = document.getElementById('precio');
const stock = document.getElementById('stock');

//Modificar Varios
const tbody = document.getElementById('tbody');

const agregarProducto = document.getElementById('agregarProducto');
const modificarProducto = document.getElementById('modificarProducto');
const actualizarVarios = document.getElementById('actualizarVarios');

const generarCodigo = document.getElementById('generarCodigo');
const guardarCambios = document.getElementById('guardarCambios');

let busquedaId = [];
let productos = [];
let producto;

const calcularPrecioSujerido = (product, dolar) => {
    let conIva = product.costodolar !== 0 ? parseFloat(product.impuestos) + product.costodolar : product.costo + parseFloat(product.impuestos);
    let total = parseFloat((conIva * dolar).toFixed(2));

    costoIva.value = total;

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

const habilitarModificacion = () => {
  seccionModificar.classList.toggle('none')
};

//llenamos los inputs con llos valores del producto
const listarProducto = () => {
  nombre.value = producto.title;
  codigo.value = producto.id;
  precio.value = producto.price;
  stock.value = producto.available_quantity;
};

//Vamos a guardar los cambios en mercado libre
const guardarCambiosML = async() => {
 await modificarPrecioYStockPorIdDeProducto(autherizacion, codigo.value, precio.value, stock.value);
  
  location.reload();
};

const listarProductos = async(lista) => {
  for await(let producto of lista){
    let tr = document.createElement('tr');
    
    const tdSKU = document.createElement('td');
    const tdId = document.createElement('td');
    const tdTitle = document.createElement('td');
    const tdCostoIva = document.createElement('td');
    const tdPrecioSujerido = document.createElement('td');
    const tdStockSujerido = document.createElement('td');
    

    tdSKU.classList.add('border');
    tdId.classList.add('border');
    tdTitle.classList.add('border');
    tdCostoIva.classList.add('border');
    tdPrecioSujerido.classList.add('border');

    let aux = producto.attributes.find(elem => elem.id === 'SELLER_SKU');
    let elem;

    if (aux){
      elem = (await axios.get(`${URL}productos/${aux.value_name}`)).data;
      const dolar = parseFloat((await axios.get(`${URL}tipoVenta`)).data.dolar);

      tdCostoIva.innerText = traerCostoIva(elem).toFixed(2);
      tdPrecioSujerido.innerText = calcularPrecioSujerido(elem, dolar);

    };
  
    tdSKU.innerText = aux ? aux.value_name : '';
    tdId.innerText = producto.id;
    tdTitle.innerText = producto.title;
    

    tr.appendChild(tdSKU);
    tr.appendChild(tdId);
    tr.appendChild(tdTitle);
    tr.appendChild(tdCostoIva);
    tr.appendChild(precioSujerido);
    
    tbody.appendChild(tr);
  }
};

//actualizar varios porductos en mercado libre 
const actualizarVariosProductosML = async() => {
  busquedaId = (await buscarMilItems()).results;
  for await(let id of busquedaId){
      let pro = await buscarinfoProductoPorId(autherizacion, id);

      productos.push(pro)
      
  };
  listarProductos(productos)

  
};

const traerCostoIva = (elem) => {
  if (elem.costodolar !== 0){
    return elem.costodolar + parseFloat(elem.impuestos);
  }else{
    return elem.costo + parseFloat(elem.impuestos);
  }
};

//Usamos para traer el producto de mercado lbre por el codigo interno que tenemos en el sistema
sku.addEventListener('keypress', async(e) => {
  if (e.keyCode === 13) {
    //Traemos de Mercado Libre
    const codigoML = await buscarIDDeProductoPorSKU(id, autherizacion, sku.value);
    producto = await buscarinfoProductoPorId(autherizacion, codigoML);
    
    //Traemos del sistema
    let product = (await axios.get(`${URL}productos/${sku.value}`)).data;
    const dolar = parseFloat((await axios.get(`${URL}tipoVenta`)).data.dolar);

    precioSujerido.value = calcularPrecioSujerido(product, dolar);;
    stockSujerido.value = product.stock
    
    listarProducto();
    guardarCambios.disabled = false;

    precio.focus();
  }
});

modificarProducto.addEventListener('click', habilitarModificacion);

generarCodigo.addEventListener('click', obtenerAccessToken)

//Hacemos click nen el botono y mandamos a modificar en ML
guardarCambios.addEventListener('click', guardarCambiosML);


//modificar Producto
precio.addEventListener('keypress', e => {
  if (e.keyCode === 13) {
    stock.focus();
  }
});

stock.addEventListener('keypress', e => {
  if (e.keyCode === 13) {
    guardarCambios.focus();
  }
});

precio.addEventListener('focus', () => {
  precio.select()
});

stock.addEventListener('focus', () => {
  stock.select()
});

document.addEventListener('keyup', e => {

  if (e.keyCode === 113){
    seccionModificar.classList.toggle('none');
    sku.focus();
  };

});

//modificar Varios

actualizarVarios.addEventListener('click', actualizarVariosProductosML);




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

// obtenerAccessToken();


// obtenerInformacionUsuario(autherizacion)
// devolveDireccion(id, autherizacion)
// buscarMilItems(id, autherizacion);
// buscarIDDeProductoPorSKU(id, autherizacion, '210-115');
// buscarinfoProductoPorId(autherizacion, 'MLA1434872357');
// modificarPrecioPorIdDeProducto(autherizacion, 'MLA1434872357', 16300);