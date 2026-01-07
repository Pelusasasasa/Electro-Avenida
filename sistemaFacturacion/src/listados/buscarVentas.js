const sweet = require('sweetalert2');
const axios = require('axios');
const { configAxios, fechaUTC } = require('../funciones');
require('dotenv').config;
const URL = process.env.URL;

const seleccion = document.querySelectorAll('input[name="seleccionar"]');
const seleccionar = document.querySelector('.seleccionar');

const primerNumero = document.querySelector('#primerNumero');
const segundoNumero = document.querySelector('#segundoNumero');
const nombre = document.querySelector('.nombre');
const razon = document.getElementById('razon');
const tbody = document.querySelector('.tbody');
let seleccionado = document.querySelector('#porNumero');

const tipoComp = document.querySelector('#tipoComp');
const codComp = document.querySelector('#codComp');

const hoy = new Date();
let dia = hoy.getDate();
let mes = hoy.getMonth() + 1;

if (dia < 10) {
  dia = `0${dia}`;
}
if (mes < 10) {
  mes = `0${mes}`;
}

const fechaDeHoy = `${hoy.getFullYear()}-${mes}-${dia}`;
const buscar = document.querySelector('.buscar');
const desde = document.querySelector('#desde');
const hasta = document.querySelector('#hasta');

let ventas = [];
let cliente;

const buscarVentaPorRazon = async (razon) => {
  try {
    const { data: ventas } = await axios.get(`${URL}ventas/forRazon/${razon}/${desde.value}/${hasta.value}`);
    const { data: presupuestos } = await axios.get(`${URL}presupuesto/forRazon/${razon}/${desde.value}/${hasta.value}`);
    listarVentas([...ventas.ventas, ...presupuestos.presupuestos]);
  } catch (error) {
    console.log(error);
  }
};

const traerVentasPorNumero = async () => {
  const numero = `${primerNumero.value.padStart(4, '0')}-${segundoNumero.value.padStart(8, '0')}`;
  const { data: ventas } = await axios.get(`${URL}ventas/${numero}`);
  console.log(URL);
  console.log(ventas);
  // listarVentas([...ventas])
};

const cargarPagina = async () => {
  const ahora = new Date().toLocaleString().slice(0, 9).split('/');
  desde.value = `${ahora[2].padStart(4, '0')}-${ahora[1].padStart(2, '0')}-${ahora[0].padStart(2, '0')}`;
  hasta.value = `${ahora[2].padStart(4, '0')}-${ahora[1].padStart(2, '0')}-${ahora[0].padStart(2, '0')}`;
};

const listarVentas = async (ventas) => {
  tbody.innerHTML = '';

  //Ordenamos
  ventas.sort((a, b) => {
    if (a.fecha > b.fecha) {
      return 1;
    }

    if (a.fecha < b.fecha) {
      return -1;
    }

    return 0;
  });

  for (let elem of ventas) {
    let total = 0;

    const trCliente = document.createElement('tr');

    trCliente.classList.add('border', 'border-black');

    const tdTodigo = document.createElement('td');
    const tdNombre = document.createElement('td');
    const tdTipoComp = document.createElement('td');
    const tdVacio = document.createElement('td');

    tdTodigo.classList.add('border', 'border-black');
    tdNombre.classList.add('border', 'border-black');
    tdTipoComp.classList.add('border', 'border-black');

    tdTodigo.innerText = elem.cliente;
    tdNombre.innerText = elem.nombreCliente;
    tdTipoComp.innerText = elem.tipo_comp;

    trCliente.appendChild(tdVacio);
    trCliente.appendChild(tdTodigo);
    trCliente.appendChild(tdNombre);
    trCliente.appendChild(tdTipoComp);

    tbody.appendChild(trCliente);

    const { data: movimientos } = await axios.get(`${URL}movProductos/${elem.nro_comp}/${elem.tipo_comp}`);

    for (let mov of movimientos) {
      const tr = document.createElement('tr');
      tr.id = mov._id;

      const tdFecha = document.createElement('td');
      const tdCodigo = document.createElement('td');
      const tdDescripcion = document.createElement('td');
      const tdNro = document.createElement('td');
      const tdCantidad = document.createElement('td');
      const tdPrecio = document.createElement('td');
      const tdTotal = document.createElement('td');
      const tdTipoPago = document.createElement('td');

      tdFecha.classList.add('border', 'border-black');
      tdCodigo.classList.add('border', 'border-black');
      tdDescripcion.classList.add('border', 'border-black');
      tdNro.classList.add('border', 'border-black');
      tdCantidad.classList.add('border', 'border-black');
      tdPrecio.classList.add('border', 'border-black');
      tdTotal.classList.add('border', 'border-black');
      tdTipoPago.classList.add('border', 'border-black');

      tdFecha.innerText = mov.fecha.slice(0, 10).split('-', 3).reverse().join('/') + ' - ' + mov.fecha.slice(11, 19);
      tdCodigo.innerText = mov.codProd;
      tdDescripcion.innerText = mov.descripcion.slice(0, 35);
      tdNro.innerText = mov.nro_comp;
      tdCantidad.innerText = mov.egreso.toFixed(2);
      tdPrecio.innerText = mov.precio_unitario;
      tdTotal.innerText = (mov.egreso * mov.precio_unitario).toFixed(2);
      tdTipoPago.innerText = elem.tipo_pago;

      tdCantidad.classList.add('text-right');

      tr.appendChild(tdFecha);
      tr.appendChild(tdCodigo);
      tr.appendChild(tdDescripcion);
      tr.appendChild(tdNro);
      tr.appendChild(tdCantidad);
      tr.appendChild(tdPrecio);
      tr.appendChild(tdTotal);
      tr.appendChild(tdTipoPago);

      tbody.appendChild(tr);

      total += mov.egreso * mov.precio_unitario;
    }

    const tr = document.createElement('tr');
    let numColumnas = 8;

    for (let i = 0; i < numColumnas - 2; i++) {
      // numColumnas es el número de th en el thead
      const tdVacio = document.createElement('td');
      tr.appendChild(tdVacio);
    }

    tr.classList.add('border', 'border-black');

    const tdTotalText = document.createElement('td');
    const tdTotal = document.createElement('td');

    tdTotalText.classList.add('border', 'border-black');
    tdTotalText.classList.add('text-bold');

    tdTotal.classList.add('text-bold');
    tdTotal.classList.add('text-right');
    tdTotal.classList.add('border', 'border-black');

    tdTotalText.innerText = 'Total Venta: ';
    tdTotal.innerText = '$' + total.toFixed(2);

    tr.appendChild(tdTotalText);
    tr.appendChild(tdTotal);

    tbody.appendChild(tr);
  }
};

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    window.close();
  }
});

primerNumero.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    segundoNumero.focus();
  }
});

segundoNumero.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    traerVentasPorNumero();
  }
});

segundoNumero.addEventListener('focus', (e) => {
  segundoNumero.select();
});

seleccionar.addEventListener('click', (e) => {
  seleccion.forEach((e) => {
    e.checked && (seleccionado = e);
  });

  const desde = document.querySelector('.desde');
  const hasta = document.querySelector('.hasta');
  const hastafecha = document.querySelector('#hasta');
  const desdeFecha = document.querySelector('#desde');

  desdeFecha.value = fechaDeHoy;
  hastafecha.value = fechaDeHoy;

  const porNumero = document.querySelector('.porNumero');

  if (seleccionado.id === 'razonSocial') {
    porNumero.classList.add('none');
    desde.classList.remove('none');
    hasta.classList.remove('none');
    nombre.classList.remove('none');
    tipoComp.parentNode.classList.add('none');
    codComp.parentNode.classList.add('none');
  } else {
    porNumero.classList.remove('none');
    desde.classList.add('none');
    hasta.classList.add('none');
    nombre.classList.add('none');
    tipoComp.parentNode.classList.remove('none');
    codComp.parentNode.classList.remove('none');
  }
});

primerNumero.addEventListener('focus', (e) => {
  primerNumero.select();
});

razon.addEventListener('keypress', (e) => {
  if (e.keyCode === 13) {
    buscarVentaPorRazon(e.target.value);
    desde.focus();
  }
});

desde.addEventListener('keypress', (e) => {
  if (e.keyCode === 13) {
    hasta.focus();
  }
});

hasta.addEventListener('keypress', (e) => {
  if (e.keyCode === 13) {
    buscarVentaPorRazon(razon.value);
  }
});

window.addEventListener('load', cargarPagina);
