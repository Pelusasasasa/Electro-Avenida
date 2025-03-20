const sweet = require("sweetalert2");
const axios = require("axios");
const { configAxios } = require("../funciones");
require("dotenv").config;
const URL = process.env.URL;

const seleccion = document.querySelectorAll('input[name="seleccionar"]');
const seleccionar = document.querySelector(".seleccionar");

const primerNumero = document.querySelector("#primerNumero");
const segundoNumero = document.querySelector("#segundoNumero");
const nombre = document.querySelector(".nombre");
const razon = document.getElementById("razon");
const tbody = document.querySelector(".tbody");
let seleccionado = document.querySelector("#porNumero");

const tipoComp = document.querySelector("#tipoComp");
const codComp = document.querySelector("#codComp");

const hoy = new Date();
let dia = hoy.getDate();
let mes = hoy.getMonth() + 1;

if (dia < 10) {
  dia = `0${dia}`;
}
if (mes < 10) {
  mes = `0${mes}`;
}

const fechaDeHoy = `${hoy.getFullYear()}-${mes}-${dia}`;
const buscar = document.querySelector(".buscar");
const desde = document.querySelector("#desde");
const hasta = document.querySelector("#hasta");

let ventas = [];
let cliente;

const buscarVentaPorRazon = async (razon) => {
  try {
    const { data } = await axios.get(`${URL}ventas/forRazonSocial`, razon);

    console.log(data);
  } catch (error) {
    console.log(error);
  }
}

seleccionar.addEventListener("click", (e) => {
  seleccion.forEach((e) => {
    e.checked && (seleccionado = e);
  });
  const desde = document.querySelector(".desde");
  const hasta = document.querySelector(".hasta");
  const hastafecha = document.querySelector("#hasta");
  const desdeFecha = document.querySelector("#desde");
  desdeFecha.value = fechaDeHoy;
  hastafecha.value = fechaDeHoy;
  const numeros = document.querySelector(".numeros");
  console.log(numeros);
  console.log(seleccionado.id);
  if (seleccionado.id === "razonSocial") {
    console.log("a");
    numeros.classList.add("none");
    desde.classList.remove("none");
    hasta.classList.remove("none");
    nombre.classList.remove("none");
    tipoComp.parentNode.classList.add("none");
    codComp.parentNode.classList.add("none");
  } else {
    numeros.classList.remove("none");
    desde.classList.add("none");
    hasta.classList.add("none");
    nombre.classList.add("none");
    tipoComp.parentNode.classList.remove("none");
    codComp.parentNode.classList.remove("none");
  }
});

buscar.addEventListener("click", async (e) => {
  if (seleccionado.id === "porNumero") {
    let venta;
    const numero =
      primerNumero.value.padStart(4, "0") +
      "-" +
      segundoNumero.value.padStart(8, "0");
    if (tipoComp.value === "presupuesto") {
      venta = (await axios.get(`${URL}presupuesto/${numero}`, configAxios))
        .data;
    } else if (tipoComp.value === "recibo") {
      venta = (
        await axios.get(
          `${URL}ventas/venta/ventaUnica/${numero}/Recibos_P`,
          configAxios
        )
      ).data;
      venta =
        venta === ""
          ? (
              await axios.get(
                `${URL}ventas/venta/ventaUnica/${numero}/Recibos`,
                configAxios
              )
            ).data
          : venta;
    } else {
      console.log(codComp.value);
      venta = (
        await axios.get(
          `${URL}ventas/venta/ventaUnica/${numero}/${codComp.value}`,
          configAxios
        )
      ).data;
    }
    traerVenta(venta);
  } else {
    let texto = razon.value === "" ? "A Consumidor Final" : razon.value;
    let clientes = await axios.get(`${URL}clientes/${texto}`, configAxios);
    clientes = clientes.data;
    traerTodasLasVentas(clientes);
  }
});

const traerVenta = async (venta) => {
  if (venta !== "") {
    cliente = await buscarCliente(venta.cliente);
    tbody.innerHTML = ``;
    listarVentas(venta);
  } else {
    sweet.fire({ title: "No se encontro ninguna Venta" });
  }
};

function listarVentas(venta) {
  let total = 0;
  venta.productos.forEach(({ objeto, cantidad }) => {
    const fecha = mostrarFecha(venta.fecha);
    tbody.innerHTML += `
            <tr>
                <td>${fecha}</td>
                <td>${objeto._id}</td>
                <td>${objeto.descripcion}</td>
                <td>${venta.nro_comp}</td>
                <td>${parseFloat(cantidad).toFixed(2)}</td>
                <td>${objeto.precio_venta}</td>
                <td>${(objeto.precio_venta * cantidad).toFixed(2)}</td>
                <td>${venta.tipo_pago}</td>
            </tr>
        `;
    total += objeto.precio_venta * cantidad;
  });
  tbody.innerHTML += `
        <tr class="total">
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td class=tdTotal>${total.toFixed(2)}</td>
        </tr>`;
}

const buscarCliente = async (id) => {
  let cliente = await axios.get(`${URL}clientes/id/${id}`);
  cliente = cliente.data;
  return cliente;
};

async function traerTodasLasVentas(lista) {
  let retornar = [];
  const desdeFecha = desde.value;
  for await (let cliente of lista) {
    let ventas = (
      await axios.get(
        `${URL}presupuesto/cliente/${cliente._id}/${desdeFecha}/${hasta.value}`,
        configAxios
      )
    ).data;
    tbody.innerHTML +=
      ventas.length !== 0 &&
      `<tr class="titulo"><td>${cliente.cliente}</td></tr>`;
    for await (let venta of ventas) {
      listarVentas(venta);
    }
  }
};

const mostrarFecha = (string) => {
  const ponerFecha = new Date(string);
  const dia = ponerFecha.getDate();
  const mes = ponerFecha.getMonth() + 1;
  const anio = ponerFecha.getUTCFullYear();

  return `${dia}/${mes}/${anio}`;
};

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    window.close();
  }
});

primerNumero.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    segundoNumero.focus();
  }
});

segundoNumero.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    buscar.focus();
  }
});

primerNumero.addEventListener("focus", (e) => {
  primerNumero.select();
});

segundoNumero.addEventListener("focus", (e) => {
  segundoNumero.select();
});

razon.addEventListener('keypress', e => {
  if(e.keyCode === 13){
    buscarVentaPorRazon(e.target.value);
  }
})