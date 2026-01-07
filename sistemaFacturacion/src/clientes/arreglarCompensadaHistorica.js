const axios = require('axios');
const { copiar, botonesSalir, redondear, cerrarVentana, configAxios } = require('../funciones');
require('dotenv').config;
const URL = process.env.URL;

const sweet = require('sweetalert2');

const h1 = document.querySelector('h1');

const codigo = document.getElementById('codigo');
const cliente = document.getElementById('cliente');
const puntoVenta = document.getElementById('puntoVenta');
const numero = document.getElementById('numero');

const tipoComp = document.getElementById('tipoComp');
const observaciones = document.getElementById('observaciones');
const importe = document.getElementById('importe');
const pagado = document.getElementById('pagado');
const saldo = document.getElementById('saldo');

const modificar = document.querySelector('.modificar');
const salir = document.querySelector('.salir');

let seleccionado;
let compensada = {};

window.addEventListener('click', (e) => {
  // copiar();
  botonesSalir();
  cerrarVentana();
});

codigo.addEventListener('change', traerCliente);

puntoVenta.addEventListener('keypress', (e) => {
  if (e.keyCode === 13) {
    numero.focus();
  }
});

numero.addEventListener('change', async (e) => {
  const nro_comp = puntoVenta.value.padStart(4, '0') + '-' + numero.value.padStart(8, '0');
  compensada = (await axios.get(`${URL}cuentaComp/numeroYCliente/${nro_comp}/${codigo.value.toUpperCase()}`, configAxios)).data;
  if (compensada) {
    await llenarInputsCuentas(compensada);
    tipoComp.focus();
  } else {
    await sweet.fire({
      title: 'Compensada no encontrada ara ese cliente',
    });
    numero.value = '';
    puntoVenta.value = '';
  }
});

modificar.addEventListener('click', modificarCompensada);

async function traerCliente(e) {
  const clienteTraido = (await axios.get(`${URL}clientes/id/${codigo.value.toUpperCase()}`, configAxios)).data;
  if (clienteTraido) {
    cliente.value = clienteTraido.cliente;
    puntoVenta.focus();
  } else {
    sweet.fire({
      title: 'Cliente no encontrado',
    });
    codigo.value = '';
  }
}

async function llenarInputsCuentas(cuenta) {
  tipoComp.value = cuenta.tipo_comp;
  importe.value = cuenta.importe.toFixed(2);
  pagado.value = cuenta.pagado.toFixed(2);
  saldo.value = cuenta.saldo.toFixed(2);
  observaciones.value = cuenta.observaciones;
  console.log(tipoComp);
  console.log(cuenta.tipo_comp);
}

async function modificarCompensada() {
  compensada.codigo = codigo.value.toUpperCase();
  compensada.cliente = cliente.value.toUpperCase();
  compensada.tipo_comp = tipoComp.value;
  compensada.importe = importe.value;
  compensada.pagado = pagado.value;
  compensada.saldo = saldo.value;
  compensada.observaciones = observaciones.value.toUpperCase();

  const { isConfirmed } = await sweet.fire({
    title: 'La cuenta modificada solo modifica esa cuenta en la base de datos',
    icon: 'info',
    confirmButtonText: 'Aceptar Modificacion',
    showCancelButton: true,
  });
  if (isConfirmed) {
    await axios.put(`${URL}cuentaComp/numeroYCliente/${compensada.nro_comp}/${codigo.value.toUpperCase()}`, compensada, configAxios);
    await sweet.fire({
      title: 'Cuenta Modificada',
      icon: 'success',
      timer: 1000,
      showConfirmButton: false,
    });
    location.reload();
  }
}

tipoComp.addEventListener('keypress', (e) => {
  if (e.keyCode === 13) {
    importe.focus();
  }
});

importe.addEventListener('keypress', (e) => {
  if (e.keyCode === 13) {
    pagado.focus();
  }
});

pagado.addEventListener('keypress', (e) => {
  if (e.keyCode === 13) {
    saldo.focus();
  }
});

saldo.addEventListener('keypress', (e) => {
  if (e.keyCode === 13) {
    observaciones.focus();
  }
});

observaciones.addEventListener('keypress', (e) => {
  if (e.keyCode === 13) {
    modificar.focus();
  }
});
