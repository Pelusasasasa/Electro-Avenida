const sweet = require("sweetalert2");
const select = document.querySelector("#marca");
const porcentajeInput = document.querySelector("#porcentaje");
const modificar = document.querySelector(".modificar");

const axios = require("axios");
const { cerrarVentana, configAxios, verNombrePc } = require("../funciones");
const { ipcRenderer } = require("electron");
require("dotenv").config;
const URL = process.env.URL;

let marcas;
let dolar;
let vendedor = "";

window.addEventListener("load", async (e) => {
  cerrarVentana();
  dolar = parseFloat(
    (await axios.get(`${URL}tipoVenta`, configAxios)).data.dolar
  );
  marcas = await axios(`${URL}productos`, configAxios);
  marcas = marcas.data;
  marcas.sort();
  marcas.forEach((marca) => {
    const option = document.createElement("option");
    option.text = marca;
    option.value = marca;
    select.appendChild(option);
  });
});

ipcRenderer.on("vendedor", (e, args) => {
  vendedor = JSON.parse(args);
});

modificar.addEventListener("click", async (e) => {
  let marca = select.value;
  let porcentaje = parseFloat(porcentajeInput.value);
  let productos = await axios.get(
    `${URL}productos/marcas/${marca}`,
    configAxios
  );
  productos = productos.data;
  await productos.forEach(async (producto) => {
    if (producto.costodolar === 0) {
      producto.costo = (
        parseFloat(producto.costo) +
        (parseFloat(producto.costo) * porcentaje) / 100
      ).toFixed(2);
      producto.impuestos =
        producto.iva === "N"
          ? (parseFloat(producto.costo) * 26) / 100
          : (parseFloat(producto.costo) * 15) / 100;
      producto.precio_venta =
        ((parseFloat(producto.costo) + parseFloat(producto.impuestos)) *
          parseFloat(producto.utilidad)) /
          100 +
        (parseFloat(producto.costo) + parseFloat(producto.impuestos));
      producto.impuestos = producto.impuestos.toFixed(2);
      producto.precio_venta = producto.precio_venta.toFixed(2);
    } else {
      producto.costodolar = (
        parseFloat(producto.costodolar) +
        (parseFloat(producto.costodolar) * porcentaje) / 100
      ).toFixed(2);
      producto.impuestos = parseFloat(
        (producto.iva === "N"
          ? (parseFloat(producto.costodolar) * 26) / 100
          : (parseFloat(producto.costodolar) * 15) / 100
        ).toFixed(2)
      );
      const costoIva = Math.round(
        (parseFloat(producto.costodolar) + parseFloat(producto.impuestos)) *
          dolar
      );
      const utilidad = Math.round((costoIva * producto.utilidad) / 100);
      producto.precio_venta = Math.round(utilidad + costoIva).toFixed(2);
    }
    producto.vendedor = vendedor.nombre;
    producto.maquina = verNombrePc();

    await axios.put(`${URL}productos/${producto._id}`, producto, configAxios);
    sweet
      .fire({ title: `Se Modifico el precio de los productos ${select.value}` })
      .then(() => {
        location.reload();
      });
  });
});

select.addEventListener("keypress", (e) => {
  if (e.keyCode === 13) {
    e.preventDefault();
    porcentaje.focus();
  }
});

porcentaje.addEventListener("keypress", (e) => {
  if (e.keyCode === 13) {
    modificar.focus();
  }
});
