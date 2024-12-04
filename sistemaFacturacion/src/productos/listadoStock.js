const axios = require("axios");
const { ipcRenderer } = require("electron");
require("dotenv").config;
const URL = process.env.URL;

const XLSX = require("xlsx");
const { configAxios } = require("../funciones");

const buscar = document.querySelector(".buscar");
const tbody = document.querySelector(".tbody");
const desde = document.querySelector("#desde");
const hasta = document.querySelector("#hasta");

const imprimir = document.querySelector(".imprimir");
const excel = document.querySelector(".excel");

const listar = document.querySelector(".listar");
let productos = [];

desde.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    hasta.focus();
  } else if (
    (desde.value.length === 3 || desde.value.length === 7) &&
    e.key !== "-"
  ) {
    desde.value = desde.value + "-";
  }
});

hasta.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    buscar.focus();
  } else if (
    (hasta.value.length === 3 || hasta.value.length === 7) &&
    e.key !== "-"
  ) {
    hasta.value = hasta.value + "-";
  }
});

buscar.addEventListener("click", async (e) => {
  productos = await axios.get(
    `${URL}productos/productosEntreRangos/${desde.value}/${hasta.value}`,
    configAxios
  );
  productos = productos.data;
  console.log(productos);
  listarProductos();
});

async function listarProductos() {
  tbody.innerHTML = "";
  for (let {
    _id,
    descripcion,
    cod_fabrica,
    stock,
    observacion,
    marca,
  } of productos) {
    const tr = document.createElement("tr");
    const tdId = document.createElement("td");

    const tdDescripcion = document.createElement("td");
    const tdCodFabrica = document.createElement("td");
    const tdStock = document.createElement("td");
    const tdMarca = document.createElement("td");
    const tdObservaciones = document.createElement("td");

    tdObservaciones.id = "observaciones";

    tdId.innerText = _id;
    tdDescripcion.innerText = descripcion;
    tdCodFabrica.innerText = cod_fabrica;
    tdStock.innerText = parseFloat(stock).toFixed(2);
    tdMarca.innerText = marca;
    tdObservaciones.innerText = observacion.slice(0, 15);

    tr.classList.add("border-bottom");

    tr.appendChild(tdId);
    tr.appendChild(tdDescripcion);
    tr.appendChild(tdStock);
    tr.appendChild(tdMarca);
    tr.appendChild(tdCodFabrica);
    tr.appendChild(tdObservaciones);

    tbody.appendChild(tr);
  }
}

imprimir.addEventListener("click", async (e) => {
  document.querySelector("body").classList.add("letra-chica");
  let printContents = document.querySelector(".listar");
  let originalContents = document.body.innerHTML;
  document.body.innerHTML = printContents.innerHTML;
  await window.print();
  location.reload();
});

excel.addEventListener("click", (e) => {
  let listado = [];
  productos.forEach(
    ({ _id, descripcion, stock, provedor, cod_fabrica, marca }) => {
      let objeto = {};
      objeto.codigo = _id;
      objeto.descripcion = descripcion;
      objeto.stock = stock;
      objeto.provedor = provedor;
      objeto.fabrica = cod_fabrica;
      objeto.marca = marca;
      listado.push(objeto);
    }
  );

  listadoStock(listado);
});

const listadoStock = async (listado) => {
  let path = await ipcRenderer.invoke("elegirPath");
  let extencion = "xlsx";
  extencion = path.split(".")[1] ? path.split(".")[1] : extencion;
  path = path.split(".")[0];
  let wb = XLSX.utils.book_new();

  wb.props = {
    Title: "Listado Stock",
    subject: "Test",
    Author: "Electro Avenida",
  };

  let newWs = XLSX.utils.json_to_sheet(listado);
  XLSX.utils.book_append_sheet(wb, newWs, "Listado Stock");
  XLSX.writeFile(wb, path + "." + extencion);
};

//si apretamos escape se cieera la pagina
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    window.close();
  }
});
