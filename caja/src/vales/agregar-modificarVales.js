const axios = require("axios");
const { ipcRenderer } = require("electron");
require("dotenv").config();
const URL = process.env.URL;

const sweet = require("sweetalert2");
const { cerrarVentana, configAxios } = require("../assets/js/globales");

const h1 = document.querySelector("h1");

const fecha = document.getElementById("fecha");
const nro_comp = document.getElementById("nro_comp");
const rSocial = document.getElementById("rSocial");
const concepto = document.getElementById("concepto");
const imp = document.getElementById("imp");

const agregar = document.querySelector(".agregar");
const modificar = document.querySelector(".modificar");
const salir = document.querySelector(".salir");

window.addEventListener("load", (e) => {
  cerrarVentana();

  const date = new Date();

  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  day = day < 10 ? `0${day}` : day;
  month = month === 13 ? 1 : month;
  month = month < 10 ? `0${month}` : month;

  fecha.value = `${year}-${month}-${day}`;
});

nro_comp.addEventListener("keyup", (e) => {
  if (e.keyCode === 13) {
    rSocial.focus();
  }
  if (nro_comp.value.length === 5 && e.key !== "-" && e.keyCode !== 8) {
    nro_comp.value = nro_comp.value + "-";
  }
});

agregar.addEventListener("click", async (e) => {
  if (!imp.value) return await sweet.fire("Poner un importe al vale");

  const vale = {};
  vale.nro_comp = nro_comp.value;
  vale.rsoc = rSocial.value.toUpperCase();
  vale.concepto = concepto.value.toUpperCase();
  vale.imp = imp.value;
  vale.tipo = "C";

  try {
    await axios.post(`${URL}vales`, vale, configAxios);
    window.close();
  } catch (error) {
    await sweet.fire({
      title: "No se pudo cargar la venta",
    });
    console.log(error);
  }
});

modificar.addEventListener("click", async (e) => {
  const vale = {};
  vale.fecha = fecha.value;
  vale.rsoc = rSocial.value;
  vale.concepto = concepto.value;
  vale.imp = imp.value;
  vale.tipo = "C";

  try {
    await axios.put(`${URL}vales/id/${modificar.id}`, vale, configAxios);
    window.close();
  } catch (error) {
    await sweet.fire({
      title: "No se pudo modificar el vale",
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
  llenarInputs(vale);
});

const llenarInputs = async (vale) => {
  agregar.classList.add("none");
  modificar.classList.remove("none");
  modificar.id = vale._id;
  h1.innerHTML = "Modificar Vales";

  const date = vale.fecha.slice(0, 10).split("-", 3);
  fecha.value = `${date[0]}-${date[1]}-${date[2]}`;
  nro_comp.value = vale.nro_comp;
  concepto.value = vale.concepto;
  rSocial.value = vale.rsoc;
  imp.value = vale.imp;
};

nro_comp.addEventListener("focus", (e) => {
  nro_comp.focus();
});

rSocial.addEventListener("focus", (e) => {
  rSocial.focus();
});

concepto.addEventListener("focus", (e) => {
  concepto.focus();
});

imp.addEventListener("focus", (e) => {
  imp.focus();
});
