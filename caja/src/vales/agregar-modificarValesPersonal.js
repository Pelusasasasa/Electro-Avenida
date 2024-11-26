const axios = require("axios");
const { ipcRenderer } = require("electron");
require("dotenv").config();
const URL = process.env.URL;

const sweet = require("sweetalert2");
const fs = require("fs");

const {
  cerrarVentana,
  redondear,
  configAxios,
} = require("../assets/js/globales");
const { CLIENT_RENEG_LIMIT } = require("tls");

const fecha = document.getElementById("fecha");
const nro_comp = document.getElementById("nro_comp");
const rSocial = document.getElementById("rSocial");
const concepto = document.getElementById("concepto");
const imp = document.getElementById("imp");

const agregar = document.querySelector(".agregar");
const modificar = document.querySelector(".modificar");
const salir = document.querySelector(".salir");

window.addEventListener("load", async (e) => {
  cerrarVentana();
  const date = new Date();

  let day = date.getDate();
  let month = date.getMonth() + 1;

  let year = date.getFullYear();

  month = month === 13 ? 1 : month;
  day = day < 10 ? `0${day}` : day;
  month = month < 10 ? `0${month}` : month;

  fecha.value = `${year}-${month}-${day}`;

  const vendedores = (await axios.get(`${URL}usuarios`, configAxios)).data;
  ponerPersonal(vendedores);
});

const ponerPersonal = (lista) => {
  lista.sort((a, b) => {
    if (a > b) {
      return 1;
    } else if (a < b) {
      return -1;
    }
    return 0;
  });

  for (let elem of lista) {
    const option = document.createElement("option");
    option.value = elem.nombre;
    option.text = elem.nombre;

    rSocial.appendChild(option);
  }
};

agregar.addEventListener("click", async (e) => {
  const vale = {};

  vale.fecha = fecha.value;
  vale.nro_comp = nro_comp.value;
  vale.rsoc = rSocial.value;
  vale.concepto = concepto.value.toUpperCase();
  vale.imp = imp.value;
  vale.tipo = "P";

  try {
    await axios.post(`${URL}vales`, vale, configAxios);
    window.close();
  } catch (error) {
    console.log(error);
    await sweet.fire({
      title: "No se pudo cargar el Vale",
    });
  }
});

modificar.addEventListener("click", async (e) => {
  const vale = {};
  vale.fecha = fecha.value;
  vale.nro_comp = nro_comp.value;
  vale.rsoc = rSocial.value;
  vale.concepto = concepto.value;
  vale.imp = imp.value;
  vale.tipo = "P";

  try {
    await axios.put(`${URL}vales/id/${modificar.id}`, vale, configAxios);
    window.close();
  } catch (error) {
    await sweet.fire({
      title: "No se pudo modifcar el vale",
    });
  }
});

nro_comp.addEventListener("keypress", (e) => {
  if (e.keyCode === 13) {
    rSocial.focus();
  }
});

rSocial.addEventListener("keypress", (e) => {
  if (e.keyCode === 13) {
    console.log("a");
    e.preventDefault();
    concepto.focus();
  }
});

concepto.addEventListener("keypress", (e) => {
  if (e.keyCode === 13) {
    imp.focus();
  }
});

imp.addEventListener("keypress", (e) => {
  if (e.keyCode === 13) {
    if (agregar.classList.contains("none")) {
      modificar.focus();
    } else {
      agregar.focus();
    }
  }
});

salir.addEventListener("click", (e) => {
  window.close();
});

ipcRenderer.on("recibir-informacion", async (e, args) => {
  const vale = (await axios.get(`${URL}vales/id/${args}`, configAxios)).data;
  modificar.classList.remove("none");
  modificar.id = args;
  agregar.classList.add("none");
  fecha.disabled = false;
  llenarInputs(vale);
});

const llenarInputs = (vale) => {
  nro_comp.value = vale.nro_comp;
  rSocial.value = vale.rsoc;
  concepto.value = vale.concepto;
  imp.value = redondear(vale.imp, 2);
};

nro_comp.addEventListener("focus", (e) => {
  nro_comp.select();
});

concepto.addEventListener("focus", (e) => {
  concepto.select();
});

// imp.addEventListener('focus',e=>{
//     imp.select();
// });
