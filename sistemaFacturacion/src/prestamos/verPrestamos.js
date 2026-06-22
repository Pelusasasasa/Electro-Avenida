const axios = require('axios');
const sweet = require('sweetalert2');
const { ipcRenderer } = require('electron');
const { configAxios } = require('../funciones');
require('dotenv');
const apiUrl = process.env.URL;

const table = document.querySelector('.table');
const tbody = document.querySelector('tbody');
const detallesProducto = document.querySelector('.detallesProducto');
const buscar = document.getElementById('buscar');
const detalle = document.getElementById('detalle');

const ordenarFecha = document.getElementById('ordenarFecha');

const botonFacturar = document.getElementById('botonFacturar');

/* Variables */
let seleccionado = '';
let subSeleccionado = '';

window.addEventListener('load', async (e) => {
  const hoy = new Date();
  const { data: prestamos } = await axios.get(`${apiUrl}prestamos/noAnulados`);

  prestamos.sort((a, b) => {
    if (a.observaciones > b.observaciones) {
      return 1;
    } else if (a.observaciones < b.observaciones) {
      return -1;
    }
    return 0;
  });

  listarPrestamos(prestamos);
});

buscar.addEventListener('change', filtrarPrestamos);
tbody.addEventListener('click', mostrarDetalleProducto);
exportar.addEventListener('click', exportarPrestamos);
botonFacturar.addEventListener('click', facturarPrestamos);

async function filtrarPrestamos(){
  const {data: prestamos} = await axios.get(`${apiUrl}prestamos/noAnulados`);
  
  const prestamosFiltrados = prestamos.filter((elem) => {
    return elem.observaciones.includes(buscar.value.toUpperCase()) || elem.nro_comp.toString().includes(buscar.value);
  });

  listarPrestamos(prestamosFiltrados);
}

async function exportarPrestamos() {
  const {data: prestamos} = await axios.get(`${apiUrl}prestamos/con-movimientos`);


  const XLSX = require('xlsx');
  let path = await ipcRenderer.invoke('elegirPath');
  
  const wb = XLSX.utils.book_new();
  wb.props = {
    title: "Listado de Prestamos",
    subject: "test",
    Author: "Electro Avenida"
  };

  const datosAExportar = prestamos.map(prestamo => ({
    fecha: prestamo.fecha.slice(0, 10).split('-', 3),
    cliente: prestamo.cliente,
    nro_comp: prestamo.nro_comp,
    observaciones: prestamo.observaciones
  }));

  const movimientosAExportar = prestamos.flatMap(prestamo => 
    prestamo.movimientos.map(movimiento => ({
      fecha: prestamo.fecha.slice(0, 10).split('-', 3),
      cliente: prestamo.cliente,
      nro_comp: prestamo.nro_comp,
      observaciones: prestamo.observaciones,
      codigo_producto: movimiento.codProd,
      descripcion: movimiento.descripcion,
      cantidad: movimiento.egreso,
      precio_unitario: movimiento.precio_unitario
    }))
  );

  const datosFinales = [...datosAExportar, ...movimientosAExportar];

  datosFinales.sort((a, b) => {
    if(a.nro_comp > b.nro_comp) return 1;
    if(a.nro_comp < b.nro_comp) return -1;
    return 0;
  });

  let newWS = XLSX.utils.json_to_sheet(datosFinales, {
    header: ['fecha', 'cliente', 'nro_comp', 'observaciones']
  });

  XLSX.utils.book_append_sheet(wb, newWS, 'Prestamos');
  XLSX.writeFile(wb, path + '.' + 'xlsx');

  sweet.fire({
    title: 'Prestamos',
    text: 'Prestamos Exportados',
    icon: 'success'
  })
  

  
  
}

//Listamos los prestamos traidos
async function listarPrestamos(lista) {
  tbody.innerText = '';
  for (let elem of lista) {
    const tr = document.createElement('tr');
    tr.id = elem.nro_comp;

    const fecha = elem.fecha.slice(0, 10).split('-', 3);

    const tdFecha = document.createElement('td');
    const tdCodigo = document.createElement('td');
    const tdCliente = document.createElement('td');
    const tdNroComp = document.createElement('td');
    const tdObservaciones = document.createElement('td');
    const tdFacturar = document.createElement('td');

    const inputAnular = document.createElement('input');
    inputAnular.setAttribute('type', 'checkbox');
    inputAnular.id = elem.nro_comp;

    tdFecha.innerText = `${fecha[2]}/${fecha[1]}/${fecha[0]}`;
    tdCodigo.innerText = elem.codigo;
    tdCliente.innerText = elem.cliente;
    tdNroComp.innerText = elem.nro_comp;
    tdObservaciones.innerText = elem.observaciones;

    tdFacturar.appendChild(inputAnular);

    tr.appendChild(tdFecha);
    tr.appendChild(tdCodigo);
    tr.appendChild(tdCliente);
    tr.appendChild(tdNroComp);
    tr.appendChild(tdObservaciones);
    tr.appendChild(tdFacturar);

    tbody.appendChild(tr);
  }
}

//si se hace un click en el prestamo se traen los moviminetos de producto
async function mostrarDetalleProducto(e) {
  detallesProducto.classList.remove('none');

  seleccionado && seleccionado.classList.remove('seleccionado');
  subSeleccionado && subSeleccionado.classList.remove('subSeleccionado');

  seleccionado = e.target.nodeName === 'TD' ? e.target.parentNode : e.target.parentNode.parentNode;
  subSeleccionado = e.target.nodeName === 'TD' ? e.target : e.target.parentNode;

  seleccionado.classList.add('seleccionado');
  subSeleccionado.classList.add('subSeleccionado');

  //achicamos el tamaño de la tabla de prestamos
  table.style.height = '40vh';

  seleccionado.scrollIntoView({
    block: 'center',
    behavior: 'smooth',
  });

  /*Traer movimientos*/ 
  const movimientos = (await axios.get(`${apiUrl}movProductos/${seleccionado.id}/Prestamo`, configAxios)).data;
  listarMovimientos(movimientos);
}

//Listamos los movimientos de productos
async function listarMovimientos(lista) {
  detalle.innerText = '';
  for (let elem of lista) {
    const tr = document.createElement('tr');
    tr.id = elem._id;

    const tdCodigo = document.createElement('td');
    const tdDescripcion = document.createElement('td');
    const tdCantidad = document.createElement('td');
    const tdStock = document.createElement('td');
    const tdPrecio = document.createElement('td');

    tdCodigo.innerText = elem.codProd;
    tdDescripcion.innerText = elem.descripcion;
    tdCantidad.innerText = elem.egreso.toFixed(2);
    tdStock.innerText = elem.stock.toFixed(2);
    tdPrecio.innerText = elem.precio_unitario;

    tdCantidad.classList.add('text-end');
    tdStock.classList.add('text-end');
    tdPrecio.classList.add('text-end');

    tr.appendChild(tdCodigo);
    tr.appendChild(tdDescripcion);
    tr.appendChild(tdCantidad);
    tr.appendChild(tdStock);
    tr.appendChild(tdPrecio);

    detalle.appendChild(tr);
  }
}

//Cerramos el section de detalle si apretamos escape o hacemos click en la cruz
function closeDetalle() {
  detallesProducto.classList.add('none');
}

//Anulamos el prestamo
async function facturarPrestamos() {
  const inputs = document.querySelectorAll('input[type=checkbox]');
  const arrayAFacturar = [];

  inputs.forEach((elem) => {
    elem.checked && arrayAFacturar.push(elem.id);
  });
  location.href = `../emitirComprobante/emitirComprobante.html?facturarPrestamo=${true}&arregloPrestamo=${JSON.stringify(arrayAFacturar)}&observaciones=${seleccionado.children[4].innerText}`;
  //   ipcRenderer.send('facturar-prestamos',JSON.stringify(arrayAFacturar));
}

function clickDerecho(e) {
  seleccionado && seleccionado.classList.remove('seleccionado');
  subSeleccionado && subSeleccionado.classList.remove('subSeleccionado');

  if (e.target.nodeName === 'TD') {
    seleccionado = e.target.parentNode;
    subSeleccionado = e.target;
  }

  subSeleccionado.classList.add('subSeleccionado');
  seleccionado.classList.add('seleccionado');

  const cordenadas = {
    x: e.clientX,
    y: e.clientY,
    ventana: 'VerPrestamos',
  };
  ipcRenderer.send('mostrar-menu', cordenadas);
}

async function imprimirPrestamo() {
  const venta = (await axios.get(`${apiUrl}prestamos/forNumber/${seleccionado.id}`, configAxios)).data;
  const cliente = (await axios.get(`${apiUrl}clientes/id/${venta.codigo}`, configAxios)).data;
  const movimientos = (await axios.get(`${apiUrl}movProductos/${venta.nro_comp}/${venta.tipo_comp}`, configAxios)).data;
  ipcRenderer.send('imprimir-venta', [venta, cliente, false, 1, 'imprimir-comprobante', 'valorizado', movimientos]);
}

async function cambiarObservacion() {
  const prestamo = (await axios.get(`${apiUrl}prestamos/forNumber/${seleccionado.id}`, configAxios)).data;
  const { value, isConfirmed } = await sweet.fire({
    title: 'Cambiar Observacion',
    input: 'text',
    showCancelButton: true,
    confirmButtonText: 'Aceptar',
  });
  if (isConfirmed) {
    prestamo.observaciones = value.toUpperCase();
    await axios.put(`${apiUrl}prestamos/forNumber/${prestamo.nro_comp}`, prestamo, configAxios);
    seleccionado.children[4].innerText = value.toUpperCase();
  }
}

ipcRenderer.on('reImprimir', imprimirPrestamo);
ipcRenderer.on('cambiarObservacion', cambiarObservacion);

tbody.addEventListener('contextmenu', clickDerecho);
document.addEventListener('keyup', (e) => {
  if (e.keyCode === 27) {
    if (!detallesProducto.classList.contains('none')) {
      detallesProducto.classList.add('none');
      table.style.height = '80vh';
    } else {
      location.href = '../index.html';
    }
  }
});

ordenarFecha.addEventListener('click', async () => {
  const { data: prestamos } = await axios.get(`${apiUrl}prestamos/noAnulados`);
  prestamos.sort((a, b) => {
    if (a.fecha > b.fecha) return 1;
    if (a.fecha < b.fecha) return -1;
    return 0;
  });
  console.log(prestamos[0]);
  listarPrestamos(prestamos);
});
