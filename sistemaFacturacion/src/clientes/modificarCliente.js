const { ipcRenderer } = require("electron");

const axios = require("axios");
const { configAxios, verNombrePc } = require("../funciones");
require("dotenv").config;
const URL = process.env.URL;

const nombre = document.querySelector("#nombre");
const localidad = document.querySelector("#localidad");
const direccion = document.querySelector("#direccion");
const telefono = document.querySelector("#telefono");
const provincia = document.querySelector("#provincia");
const cod_postal = document.querySelector("#cod_postal");
const email = document.querySelector("#email");
const dnicuit = document.querySelector("#dnicuit");
const conIva = document.querySelector("#conIva");
const limite = document.querySelector("#limite");
const moroso = document.querySelectorAll('input[name="moroso"]');
const conFact = document.querySelector("#conFact");
const observaciones = document.querySelector("#observaciones");

const modificar = document.querySelector(".modificar");
const guardar = document.querySelector(".guardar");

let _id = "";
let condicion;
let acceso;
let situacion = "blanco";
let vendedor = "";

ipcRenderer.on("datos-clientes", async (e, args) => {
  cliente = (
    await axios.get(`${URL}clientes/id/${JSON.parse(args)[0]}`, configAxios)
  ).data;
  acceso = JSON.parse(args)[1];

  for (let i of moroso) {
    if (i.value === cliente.condicion) {
      condicion = cliente.condicion;
      i.setAttribute("checked", "");
    }
  }
  _id = cliente._id;
  nombre.value = cliente.cliente;
  direccion.value = cliente.direccion;
  localidad.value = cliente.localidad;
  telefono.value = cliente.telefono;
  provincia.value = cliente.provincia;
  email.value = cliente.mail;
  cod_postal.value = cliente.cod_postal;
  dnicuit.value = cliente.cuit;
  moroso.value = condicion;
  conFact.value = cliente.cond_fact;
  observaciones.value = cliente.observacion;
  conIva.value = cliente.cond_iva;
});

ipcRenderer.on("vendedor", (e, args) => {
  vendedor = args;
});

modificar.addEventListener("click", (e) => {
  e.preventDefault();

  modificar.classList.add("none");
  const inputs = document.querySelectorAll("input");
  const select = document.querySelector("#conIva");

  select.toggleAttribute("disabled");

  acceso !== "0"
    ? conFact.setAttribute("disabled", "")
    : conFact.removeAttribute("disabled");

  for (let input of inputs) {
    input.toggleAttribute("disabled");
  }

  nombre.focus();
});

guardar.addEventListener("click", async (e) => {
  const nuevoCliente = {};
  for (let i of moroso) {
    i.checked && (condicion = i.value);
  }
  e.preventDefault();
  nuevoCliente._id = _id;
  nuevoCliente.cliente = nombre.value.toUpperCase();
  nuevoCliente.direccion = direccion.value.toUpperCase();
  nuevoCliente.localidad = localidad.value.toUpperCase();
  nuevoCliente.telefono = telefono.value;
  nuevoCliente.provincia = provincia.value.toUpperCase();
  nuevoCliente.mail = email.value;
  nuevoCliente.cod_postal = cod_postal.value;
  nuevoCliente.cuit = dnicuit.value;
  nuevoCliente.cond_iva = conIva.value;
  nuevoCliente.observacion = observaciones.value.toUpperCase();
  nuevoCliente.condicion = condicion;
  nuevoCliente.cond_fact = conFact.value;
  nuevoCliente.lim_compra = parseFloat(limite.value);
  nuevoCliente.maquina = verNombrePc();
  console.log(vendedor);
  nuevoCliente.vendedor = vendedor;
  await axios.put(
    `${URL}clientes/${nuevoCliente._id}`,
    nuevoCliente,
    configAxios
  );
  window.close();
});

const salir = document.querySelector(".salir");
salir.addEventListener("click", () => {
  window.close();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    window.close();
  }
});

nombre.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    conIva.focus();
  }
});

conIva.addEventListener("keypress", (e) => {
  e.preventDefault();
  if (e.key === "Enter") {
    direccion.focus();
  }
});

localidad.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    provincia.focus();
  }
});

provincia.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    cod_postal.focus();
  }
});
cod_postal.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    dnicuit.focus();
  }
});
direccion.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    localidad.focus();
  }
});

dnicuit.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    email.focus();
  }
});

email.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    telefono.focus();
  }
});

telefono.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    limite.focus();
  }
});

limite.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    conFact.focus();
  }
});
conFact.addEventListener("keypress", (e) => {
  e.preventDefault();
  if (e.key === "Enter") {
    console.log(moroso[0]);
    moroso[0].focus();
  }
});

moroso[0].addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    observaciones.focus();
  }
});

observaciones.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    guardar.focus();
  }
});

nombre.addEventListener("focus", (e) => {
  nombre.select();
});
localidad.addEventListener("focus", (e) => {
  localidad.select();
});
provincia.addEventListener("focus", (e) => {
  provincia.select();
});
cod_postal.addEventListener("focus", (e) => {
  cod_postal.select();
});
direccion.addEventListener("focus", (e) => {
  direccion.select();
});
dnicuit.addEventListener("focus", (e) => {
  dnicuit.select();
});
email.addEventListener("focus", (e) => {
  email.select();
});
telefono.addEventListener("focus", (e) => {
  telefono.select();
});
limite.addEventListener("focus", (e) => {
  limite.select();
});
observaciones.addEventListener("focus", (e) => {
  observaciones.select();
});
