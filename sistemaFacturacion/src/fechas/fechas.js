const { ipcRenderer } = require("electron");
const axios = require("axios");
const { configAxios } = require("../funciones");
require("dotenv").config;
const URL = process.env.URL;

const desde = document.querySelector("#desde");
const hasta = document.querySelector("#hasta");
const aceptar = document.querySelector(".aceptar");
const cancelar = document.querySelector(".cancelar");

const date = new Date();

let informacion = "";

ipcRenderer.on("informacion", (e, args) => {
  informacion = args;
});

let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();
let hora = date.getHours();

day = day < 10 ? `0${day}` : day;
month = month < 10 ? `0${month}` : month;
month = month === 13 ? 1 : month;

desde.value = `${year}-${month}-${day}`;
hasta.value = `${year}-${month}-${day}`;

aceptar.addEventListener("click", async (e) => {
  const path = await ipcRenderer.invoke("elegirPath");

  let desdefecha = new Date(desde.value);
  const tickets = (
    await axios.get(`${URL}ventas/${desdefecha}/${hasta.value}`, configAxios)
  ).data;
  const presupuesto = (
    await axios.get(
      `${URL}presupuesto/${desdefecha}/${hasta.value}`,
      configAxios
    )
  ).data;
  const recibos = (
    await axios.get(
      `${URL}recibos/getbetweenDates/${desdefecha}/${hasta.value}`,
      configAxios
    )
  ).data;

  let arreglo = [];

  if (informacion === "porComprobante") {
    arreglo = await porComprobante([...tickets, ...presupuesto, ...recibos]);
  } else {
    arreglo = await porVenta(tickets, presupuesto, recibos);
  }

  ipcRenderer.send("enviar-arreglo-descarga", [arreglo, path, informacion]);

  window.close();
});

//cuando apretamos enter le pasamos el foco a hasta
desde.addEventListener("keypress", (e) => {
  e.preventDefault();
  if (e.key === "Enter") {
    hasta.focus();
  }
});

//cuando apretamos enter le pasamos el foco a aceptar
hasta.addEventListener("keypress", (e) => {
  e.preventDefault();
  if (e.key === "Enter") {
    aceptar.focus();
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

async function porVenta(tickets, presupuesto, recibos) {
  //Sacamos los tickes que se hicieron en el dia y son contados
  let ticketsDelDia = tickets.filter((ticket) => {
    if (
      (ticket.tipo_comp === "Ticket Factura" ||
        ticket.tipo_comp === "Factura A" ||
        ticket.tipo_comp === "Factura B" ||
        ticket.tipo_comp === "Nota Credito") &&
      ticket.tipo_pago === "CD"
    ) {
      return ticket;
    }
  });
  //Sacamos los presupuesto que se hicieron en el dia y son contados
  let presupuestosDelDia = presupuesto.filter((presu) => {
    if (presu.tipo_pago === "CD") {
      return presu;
    }
  });

  let arreglo = [...ticketsDelDia, ...presupuestosDelDia, ...recibos];

  return arreglo;
}

async function porComprobante(arreglo) {
  let arregloFinal = [];

  for await (let venta of arreglo) {
    const movimientos = (
      await axios.get(`${URL}movProductos/${venta.nro_comp}/${venta.tipo_comp}`)
    ).data;
    arregloFinal.push(venta, ...movimientos);
  }

  return arregloFinal;
}
