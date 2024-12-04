const axios = require("axios");
const { ipcRenderer } = require("electron");
require("dotenv").config;
const URL = process.env.URL;

const {
  botonesSalir,
  cerrarVentana,
  verificarUsuarios,
  configAxios,
} = require("../funciones");

const fecha = document.querySelector("#fecha");
const tarjetas = document.querySelector("#tarjetas");
const usuario = document.querySelector("#vendedor");
const importe = document.querySelector("#importe");
const agregar = document.querySelector(".agregar");

const hoy = new Date();
let date = hoy.getDate();
let month = hoy.getMonth() + 1;
let year = hoy.getFullYear();
let hora = hoy.getHours();
let minutos = hoy.getMinutes();
let seg = hoy.getSeconds();

date = date < 10 ? `0${date}` : date;
month = month === 13 ? 1 : month;
month = month < 10 ? `0${month}` : month;

fecha.value = `${year}-${month}-${date}`;

let vendedor;

window.addEventListener("load", async (e) => {
  botonesSalir();
  cerrarVentana();

  const tipoTajertas = (await axios.get(`${URL}tipoTarjetas`, configAxios))
    .data;
  for await (let tipo of tipoTajertas) {
    const option = document.createElement("option");

    option.value = tipo.nombre;
    option.text = tipo.nombre.toUpperCase();

    tarjetas.append(option);
  }
});

ipcRenderer.on("informacion", async (e, args) => {
  const { imp, vendedor: ven } = args ? JSON.parse(args) : "";
  importe.value = imp;
  usuario.value = ven;

  if (!args) {
    vendedor = await verificarUsuarios();
    usuario.value = vendedor.nombre;
  }
});

const sweet = require("sweetalert2");
agregar.addEventListener("click", async (e) => {
  const tarjeta = {};
  tarjeta.vendedor = usuario.value;
  tarjeta.imp = importe.value;
  tarjeta.fecha = new Date(year, month - 1, date, hora, minutos, seg);
  tarjeta.tarjeta = tarjetas.value;
  try {
    await axios.post(`${URL}tarjetas`, tarjeta, configAxios);
    window.close();
  } catch (error) {
    console.log(error);
    sweet.fire({
      title: "No se pudo cargar la tarjeta",
    });
  }
});

fecha.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    tarjetas.focus();
  }
});

importe.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    agregar.focus();
  }
});

tarjetas.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    importe.focus();
  }
});

importe.addEventListener("focus", (e) => {
  importe.select();
});
