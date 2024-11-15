const { ipcRenderer } = require("electron");
const sweet = require("sweetalert2");
const axios = require("axios");
const { configAxios } = require("../funciones");
require("dotenv").config;
const URL = process.env.URL;

const nombre = document.querySelector(".nombre");
const direccion = document.querySelector(".direccion");
const telefono = document.querySelector(".telefono");
const buscador = document.querySelector("#buscador");
const tbody = document.querySelector(".tbody");
const imprimir = document.querySelector(".imprimir");
const desde = document.querySelector("#desde");
const ocultar = document.querySelector(".buscador");

const saldoImprimir = document.querySelector(".saldoImprimir");
const nombreCliente = document.querySelector("#nombreCliente");

const volver = document.querySelector(".volver");

const dateNow = new Date();
let day = dateNow.getDate();
let month = dateNow.getMonth() + 1;
let year = dateNow.getFullYear();

day = day < 10 ? `0${day}` : day;
month = month < 10 ? `0${month}` : month;

const date = `${year}-${month}-01`;
desde.value = date;

let situacion = "blanco";
let listaVentas = [];
let saldo = "saldo";
let cliente = {};
saldoAnterior_P = 0;
saldoAnterior = 0;

desde.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    buscador.focus();
  }
});

buscador.addEventListener("keypress", async (e) => {
  if (e.key === "Enter") {
    if (buscador.value === "") {
      ipcRenderer.send("abrir-ventana-clientesConSaldo", situacion);
    } else {
      cliente = (
        await axios.get(
          `${URL}clientes/clienteConSaldo/${buscador.value.toUpperCase()}`,
          configAxios
        )
      ).data;
      if (cliente !== "") {
        buscador.value = cliente._id;
        nombreCliente.value = cliente.cliente;
        ponerDatos(cliente);
      } else {
        await sweet.fire({
          title: "Cliente No encontrado",
        });
      }
    }
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Alt") {
    document.addEventListener("keydown", (e) => {
      if (e.key === "F9" && situacion === "blanco") {
        mostrarNegro();
        situacion = "negro";
        saldo = "saldo_p";
        listarVentas(listaVentas, situacion, saldoAnterior, saldoAnterior_P);
      } else if (e.key === "F8" && situacion === "negro") {
        ocultarNegro();
        situacion = "blanco";
        saldo = "saldo";
        listarVentas(listaVentas, situacion, saldoAnterior, saldoAnterior_P);
      }
    });
  }
});

const ocultarNegro = () => {
  const body = document.querySelector(".seccionResumeCuenta");
  body.classList.remove("mostrarNegro");
  ocultar.classList.remove("mostrarNegro");
  volver.classList.remove("mostrarNegro");
};

const mostrarNegro = () => {
  const body = document.querySelector(".seccionResumeCuenta");
  body.classList.add("mostrarNegro");
  ocultar.classList.add("mostrarNegro");
  volver.classList.add("mostrarNegro");
};

const ponerDatos = async (cliente) => {
  nombre.innerHTML =
    cliente.cliente +
    "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp" +
    cliente._id;
  direccion.innerHTML = `${cliente.direccion}-${cliente.localidad}`;
  telefono.innerHTML = cliente.telefono;

  let cuentas = (
    await axios.get(`${URL}cuentaHisto/cliente/${cliente._id}`, configAxios)
  ).data;
  let ventasAnteriores = cuentas.filter((e) => e.fecha < desde.value);
  //Aca vemos si ya debia algo del progama viejo
  ventasAnteriores = ventasAnteriores.reverse();
  const primerHistoP = ventasAnteriores.find(
    (venta) =>
      venta.tipo_comp === "Presupuesto" || venta.tipo_comp === "Recibos_P"
  );
  const primerHisto = ventasAnteriores.find(
    (venta) =>
      venta.tipo_comp === "Ticket Factura" ||
      venta.tipo_comp === "Recibos" ||
      venta.tipo_comp === "Nota Credito" ||
      venta.tipo_comp === "Factura B" ||
      venta.tipo_comp === "Factura A"
  );
  saldoAnterior_P = primerHistoP ? primerHistoP.saldo : 0;
  console.log(primerHisto);
  saldoAnterior = primerHisto ? primerHisto.saldo : 0;
  listaVentas = cuentas.filter((e) => {
    return e.fecha >= desde.value;
  });
  nuevaLista = [];

  listarVentas(listaVentas, situacion, saldoAnterior, saldoAnterior_P);
};

ipcRenderer.on("mando-el-cliente", async (e, args) => {
  cliente = (await axios.get(`${URL}clientes/id/${args}`, configAxios)).data;
  ponerDatos(cliente);
});

function listarVentas(ventas, situacion, saldoAnterior, saldoAnterior_P) {
  tbody.innerHTML = "";

  ventas.sort((a, b) => {
    if (a.fecha > b.fecha) {
      return 1;
    } else if (b.fecha > a.fecha) {
      return -1;
    }
    return 0;
  });

  let aux;

  if (situacion === "negro") {
    aux = "Presupuesto";
  } else {
    cliente.cond_iva === "Inscripto"
      ? (aux = "Factura A")
      : (aux = "Factura B");
  }

  let listaAux = ventas;
  if (aux === "Presupuesto") {
    listaAux = listaAux.filter((e) => {
      return e.tipo_comp === aux || e.tipo_comp === "Recibos_P";
    });
  } else {
    listaAux = listaAux.filter((e) => {
      return (
        e.tipo_comp === aux ||
        e.tipo_comp === "Recibos" ||
        e.tipo_comp === "Nota Credito" ||
        e.tipo_comp === "Ticket Factura"
      );
    });
  }

  let saldoAnteriorFinal =
    situacion === "blanco" ? saldoAnterior : saldoAnterior_P;
  tbody.innerHTML += `<tr><td></td><td></td><td></td><td></td><td>Saldo Anterior</td><td>${saldoAnteriorFinal.toFixed(
    2
  )}</td></tr>`;
  listaAux =
    situacion === "negro"
      ? listaAux.filter(
          (venta) => venta.tipo_comp !== "Recibos_P" || venta.haber !== 0
        )
      : listaAux.filter(
          (venta) => venta.tipo_comp !== "Recibos" || venta.haber !== 0
        );
  listaAux.forEach((venta) => {
    const fecha = venta.fecha.slice(0, 10).split("-", 3);
    const dia = fecha[2];
    const mes = fecha[1];
    const anio = fecha[0];
    let comprobante = venta.tipo_comp;

    if (venta.tipo_comp === "Ticket Factura") {
      comprobante =
        cliente.cond_iva === "Inscripto" ? "Factura A" : "Factura B";
    } else if (venta.tipo_comp === "Nota Credito") {
      comprobante =
        cliente.cond_iva === "Inscripto" ? "Nota Credito A" : "Nota Credito B";
    } else if (venta.tipo_comp === "Recibos") {
      comprobante =
        cliente.cond_iva === "Inscripto" ? "Recibos A" : "Recibos B";
    } else {
      comprobante = venta.tipo_comp;
    }

    tbody.innerHTML += `
                <tr>
                    <td>${dia}/${mes}/${anio}</td>
                    <td>${comprobante}</td>
                    <td>${venta.nro_comp}</td>
                    <td class=text-end>${
                      venta.debe === 0.0 ? "" : venta.debe.toFixed(2)
                    }</td>
                    <td class=text-end>${
                      venta.haber === 0.0 ? "" : venta.haber.toFixed(2)
                    }</td>
                    <td class=text-end>${venta.saldo.toFixed(2)}</td>
                </tr>
            `;
  });
  if (cliente[saldo] === undefined) {
    saldoImprimir.innerText = "0.00";
  } else {
    saldoImprimir.innerText = parseFloat(cliente[saldo]).toFixed(2);
  }
}

imprimir.addEventListener("click", (e) => {
  //lo que hacemos es poner en none  para que no salgan en la impresio
  volver.classList.add("none");
  ocultar.classList.add("none");
  window.print();
  location.reload();
});

document.addEventListener("keydown", (e) => {
  if (e.keyCode === 27) {
    location.href = "../index.html";
  }
});

volver.addEventListener("click", (e) => {
  location.href = "../index.html";
});
