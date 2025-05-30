const axios = require("axios");
const { ipcRenderer } = require("electron");
const { cerrarVentana, botonesSalir, configAxios } = require("../funciones");
require("dotenv").config;
const URL = process.env.URL;

let ventas;

const desde = document.querySelector("#desde");
const hasta = document.querySelector("#hasta");
const tbody = document.querySelector("tbody");
const alerta = document.querySelector(".alerta");

const salir = document.querySelector(".salir");

let seleccionado = "";
let subSeleccionado = "";

const today = new Date();

window.addEventListener("load", async (e) => {
  //funciones
  cerrarVentana();
  botonesSalir();

  let day = today.getDate();
  let month = today.getMonth() + 1;
  let year = today.getFullYear();

  month = month === 13 ? 1 : month;
  month = month < 10 ? `0${month}` : month;
  day = day < 10 ? `0${day}` : day;

  desde.value = `${year}-${month}-${day}`;
  hasta.value = `${year}-${month}-${day}`;

  recibos = (await axios.get(`${URL}recibos/recibosBetweenDates/${desde.value}/${hasta.value}`)).data;
  ventas = (await axios.get(`${URL}ventas/${desde.value}/${hasta.value}`)).data;
  presupuestos = (await axios.get(`${URL}presupuesto/${desde.value}/${hasta.value}`)).data;
  // alerta.classList.remove('none');
  listar(ventas, recibos, presupuestos.filter(elem => elem.tipo_pago === "CD"));
});

desde.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    hasta.focus();
  }
});

hasta.addEventListener("keypress", async (e) => {
  if (e.keyCode === 13) {
    await alerta.classList.remove("none");
    ventas = (await axios.get(`${URL}ventas/${desde.value}/${hasta.value}`, configAxios)).data;
    recibos = (await axios.get(`${URL}recibos/recibosBetweenDates/${desde.value}/${hasta.value}`)).data;
    presupuestos = (await axios.get(`${URL}presupuesto/${desde.value}/${hasta.value}`)).data;
    listar(ventas, recibos, presupuestos);
  }
});

tbody.addEventListener("click", async (e) => {
  seleccionado && seleccionado.classList.remove("seleccionado");
  seleccionado =
    e.target.nodeName === "TD"
      ? e.target.parentNode
      : e.target.parentNode.parentNode;
  seleccionado.classList.add("seleccionado");

  subSeleccionado && subSeleccionado.classList.remove("subSeleccionado");
  subSeleccionado = e.target.nodeName === "TD" ? e.target : e.target.parentNode;
  subSeleccionado.classList.add("subSeleccionado");

  if (e.target.nodeName === "BUTTON") {
    if (seleccionado.children[2].innerText === "Recibos") {
      const recibo = recibos.find((elem) => elem.nro_comp === seleccionado.id);
      const cliente = (await axios.get(`${URL}clientes/${recibo.cliente}`, configAxios)).data[0];
      ipcRenderer.send("imprimir-recibo", [recibo, cliente, recibo.comprobantes, "Recibos",]);
    } else if (seleccionado.children[2].innerText === "Presupuesto") {

      const presupuesto = presupuestos.find((elem) => elem.nro_comp === seleccionado.id);
      const cliente = (await axios.get(`${URL}clientes/id/${presupuesto.cliente}`)).data;
      const movimientos = (await axios.get(`${URL}movProductos/movimientosPorCliente/${presupuesto.nro_comp}/${presupuesto.tipo_comp}/${presupuesto.cliente}`)).data;
      ipcRenderer.send('imprimir-venta', [presupuesto, cliente, false, 1, 'Ticket Factura', , movimientos, true]);

    } else {

      const venta = ventas.find((elem) => elem.nro_comp === seleccionado.id);
      console.log(venta)
      const movimientos = (await axios.get(`${URL}movProductos/movimientosPorCliente/${venta.nro_comp}/${venta.tipo_comp}/${venta.cliente}`)).data;

      const afip = {
        QR: venta.qr ? JSON.parse(venta.qr) : "",
        cae: venta.cae,
        vencimientoCae: venta.vencimientoCae,
      };
      ipcRenderer.send("imprimir-venta", [venta, afip, false, 1, "Ticket Factura", , movimientos, true,]);
    }
  }
});

const listar = async (listaVentas, listaRecibos, listaPresupuesto) => {
  tbody.innerHTML = "";

  const lista = [...listaVentas, ...listaRecibos, ...listaPresupuesto];
  //filtramos las ventas solo para ver ticket o notas de credito

  for await (let venta of lista) {
    const tr = document.createElement("tr");
    tr.id = venta.nro_comp;

    const tdHora = document.createElement("td");
    const tdCliente = document.createElement("td");
    const tdTipo = document.createElement("td");
    const tdNumero = document.createElement("td");
    const tdImporte = document.createElement("td");
    const tdImprimir = document.createElement("td");
    const button = document.createElement("button");

    tdImporte.classList.add("text-right");
    tdImporte.classList.add("text-bold");

    const hora = venta.fecha.slice(11, 19).split(":", 3);

    tdHora.innerHTML = `${hora[0]}:${hora[1]}:${hora[2]}`;
    tdCliente.innerHTML = venta.nombreCliente ? venta.nombreCliente : venta.cliente;
    tdTipo.innerHTML =
      venta.tipo_comp === "Recibos" ? "Recibos" : verTipoComp(venta.cod_comp);
    tdNumero.innerHTML = venta.nro_comp;
    tdImporte.innerHTML = venta.precioFinal.toFixed(2);

    button.innerHTML = "Re-Impirmir";
    button.classList.add("imprimir");
    tdImprimir.appendChild(button);

    tr.appendChild(tdHora);
    tr.appendChild(tdCliente);
    tr.appendChild(tdTipo);
    tr.appendChild(tdNumero);
    tr.appendChild(tdImporte);
    tr.appendChild(tdImprimir);

    tbody.appendChild(tr);
  }
  alerta.classList.add("none");
};

const verTipoComp = (numero) => {
  if (numero === 1) {
    return "Factura A";
  } else if (numero === 6) {
    return "Factura B";
  } else if (numero === 3) {
    return "Nota Credito A";
  } else if (numero === 8) {
    return "Nota Credito B";
  } else {
    return "Presupuesto"
  }
  return undefined;
};
