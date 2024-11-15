const { ipcRenderer } = require("electron");
const sweet = require("sweetalert2");
const codigo = document.querySelector("#codigo");
const nuevoCodigo = document.querySelector("#nuevoCodigo");
const aceptar = document.querySelector(".aceptar");
const cancelar = document.querySelector(".cancelar");
const diescripcion = document.querySelector("#descripcion");

const axios = require("axios");
const { configAxios, verNombrePc } = require("../funciones");
require("dotenv").config;
const URL = process.env.URL;

let vendedor = "";

codigo.addEventListener("keydown", async (e) => {
  if (e.key === "Enter" || e.key === "Tab") {
    let producto = await axios.get(
      `${URL}productos/${codigo.value}`,
      configAxios
    );
    producto = producto.data;
    if (producto.descripcion) {
      descripcion.value = producto.descripcion;
      nuevoCodigo.focus();
    } else {
      await sweet.fire({ title: "Producto no existe" });
      codigo.value = "";
    }
  } else if (
    (codigo.value.length === 3 || codigo.value.length === 7) &&
    e.key !== "-" &&
    e.key !== "Backspace"
  ) {
    codigo.value = codigo.value + "-";
  }
});

ipcRenderer.on("vendedor", (e, args) => {
  vendedor = JSON.parse(args).nombre;
});

nuevoCodigo.addEventListener("keydown", async (e) => {
  if (e.key === "Enter") {
    let productoYaExistente = await axios.get(
      `${URL}productos/${e.target.value}`,
      configAxios
    );
    productoYaExistente = productoYaExistente.data;
    if (productoYaExistente.length !== 0) {
      await sweet.fire({ title: "codigo ya utilizado" });
      nuevoCodigo.value = "";
    } else {
      aceptar.focus();
    }
  }
});

aceptar.addEventListener("click", async (e) => {
  const productos = await axios.get(
    `${URL}productos/${codigo.value}`,
    configAxios
  );
  const nuevoProducto = productos.data;
  nuevoProducto._id = nuevoCodigo.value;
  nuevoProducto.maquina = verNombrePc();
  nuevoProducto.vendedor = vendedor;
  await axios.post(`${URL}productos`, nuevoProducto, configAxios);
  await axios.delete(
    `${URL}productos/${codigo.value}`,
    {
      data: {
        vendedor,
        maquina: verNombrePc(),
        producto: descripcion.value,
      },
    },
    configAxios
  );
  location.reload();
});

cancelar.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    window.close();
  }
});

cancelar.addEventListener("click", (e) => {
  window.close();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    window.close();
  }
});
