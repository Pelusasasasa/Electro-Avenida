const axios = require("axios");
const { configAxios } = require("../funciones");
require("dotenv").config();
const URL = process.env.URL;

const desde = document.getElementById("desde");
const hasta = document.getElementById("hasta");

const tbody = document.querySelector("tbody");

window.addEventListener("load", async (e) => {
  const date = new Date();
  desde.value = date.toISOString().slice(0, 10);
  hasta.value = date.toISOString().slice(0, 10);

  remitos = (
    await axios.get(
      `${URL}remitos/betweenDates/${desde.value}/${hasta.value}`,
      configAxios
    )
  ).data;
  listarRemitos(remitos);
});

desde.addEventListener("keypress", (e) => {
  if (e.keyCode === 13) {
    hasta.focus();
  }
});

const listarRemitos = async (lista) => {
  for await (let remito of remitos) {
    const movimientos = (
      await axios.get(
        `${URL}movProductos/${remito.nro_comp}/Remito`,
        configAxios
      )
    ).data;

    for await (let movimiento of movimientos) {
      const tr = document.createElement("tr");

      const tdNumero = document.createElement("td");
      const tdFecha = document.createElement("td");
      const tdCliente = document.createElement("td");
      const tdId = document.createElement("td");
      const tdCodProd = document.createElement("td");
      const tdDescripcion = document.createElement("td");
      const tdEgreso = document.createElement("td");
      const tdVendedor = document.createElement("td");
      const tdObservaciones = document.createElement("td");

      const fecha = remito.fecha.slice(0, 10).split("-", 3);

      tdNumero.innerHTML = remito.nro_comp;
      tdFecha.innerHTML = `${fecha[2]}/${fecha[1]}/${fecha[0]}`;
      tdCliente.innerHTML = remito.cliente;
      tdId.innerHTML = remito.idCliente;
      tdCodProd.innerHTML = movimiento.codProd;
      tdDescripcion.innerHTML = movimiento.descripcion;
      tdEgreso.innerHTML = movimiento.egreso.toFixed(2);
      tdVendedor.innerHTML = remito.vendedor;
      tdObservaciones.innerHTML = remito.observaciones;

      tdEgreso.classList.add("text-end");

      tr.appendChild(tdNumero);
      tr.appendChild(tdFecha);
      tr.appendChild(tdId);
      tr.appendChild(tdCliente);
      tr.appendChild(tdCodProd);
      tr.appendChild(tdDescripcion);
      tr.appendChild(tdEgreso);
      tr.appendChild(tdVendedor);
      tr.appendChild(tdObservaciones);

      tbody.appendChild(tr);
    }
  }
};

document.addEventListener("keyup", (e) => {
  if (e.keyCode === 27) {
    window.close();
  }
});
