const axios = require("axios");
const { redondear, configAxios } = require("../funciones");
require("dotenv").config;
const URL = process.env.URL;

const hasta = document.querySelector("#hasta");
const desde = document.querySelector("#desde");
const buscar = document.querySelector(".buscar");
const tbody = document.querySelector(".tbody");

const hoy = new Date();

let day = hoy.getDate();
if (day < 10) {
  day = `0${day}`;
}
let month = hoy.getMonth() + 1;

month = month === 0 ? month + 1 : month;

if (month < 10) {
  month = `0${month}`;
}

const fechaDeHoy = `${hoy.getFullYear()}-${month}-${day}`;

desde.value = fechaDeHoy;
hasta.value = fechaDeHoy;

desde.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    hasta.focus();
  }
});

hasta.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    buscar.focus();
  }
});

const main = async () => {
  const desdeFecha = new Date(desde.value);
  let ventasCanceladas = (
    await axios.get(
      `${URL}cancelados/${desdeFecha}/${hasta.value}`,
      configAxios
    )
  ).data;
  for await (let venta of ventasCanceladas) {
    listarVentasCanceladas(venta);
  }
};

main();

buscar.addEventListener("click", async (e) => {
  const desdeFecha = new Date(desde.value);
  let ventasCanceladas = (
    await axios.get(
      `${URL}cancelados/${desdeFecha}/${hasta.value}`,
      configAxios
    )
  ).data;
  tbody.innerHTML = "";
  ventasCanceladas.forEach((venta) => {
    listarVentasCanceladas(venta);
  });
});

const listarVentasCanceladas = async (venta) => {
  let vendedor = venta.vendedor;
  let fecha = venta.fecha.slice(0, 10).split("-", 3);
  let horas = venta.fecha.slice(11, 18).split(":", 3);
  let dia = fecha[2];
  let mes = fecha[1];
  let anio = fecha[0];
  let hora = horas[0];
  let minutos = horas[1];
  let segundos = horas[2];
  dia = dia < 10 ? `0${dia}` : dia;
  mes = mes < 10 ? `0${mes}` : mes;
  minutos = minutos < 10 ? `0${minutos}` : minutos;
  segundos = segundos < 10 ? `0${segundos}` : segundos;
  let total = 0;

  venta.productos.forEach(({ cantidad, objeto }) => {
    total = parseFloat(redondear(total + cantidad * objeto.precio_venta, 2));
    tbody.innerHTML += `
            <tr>
                <td>${dia}/${mes}/${anio}</td>
                <td class = "cliente">${venta.cliente}</td>
                <td>${objeto._id}</td>
                <td>${objeto.descripcion}</td>
                <td>${cantidad}</td>
                <td class = "total">${(cantidad * objeto.precio_venta).toFixed(
      2
    )}</td>
                <td class="vendedor">${vendedor.slice(0, 3)}</td>
                <td>${hora}:${minutos}:${segundos}</td>

            </tr>
        `;
  });
  tbody.innerHTML += `
        <tr class = total>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>TOTAL</td>
            <td>${total}</td>
        </tr>
    `;
};

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    window.close();
  }
});
