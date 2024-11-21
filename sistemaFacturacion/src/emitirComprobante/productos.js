const sweet = require("sweetalert2");
const { ipcRenderer } = require("electron");

const axios = require("axios");
const { copiar, recorrerFlechas, configAxios } = require("../funciones");
require("dotenv").config();
const URL = process.env.URL;

const resultado = document.querySelector("#resultado");
const select = document.querySelector("#seleccion");
const buscarProducto = document.querySelector("#buscarProducto");
const body = document.querySelector("body");

let seleccionarTBody = document.querySelector("tbody");

let productos = "";
let subSeleccionado;
let texto = "";
let seleccionado;

window.addEventListener("load", (e) => {
  filtrar();
  copiar();
});

//si la tecla es escape se cierra la pagina
body.addEventListener("keydown", async (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    //tomamos el tr que este seleccionado
    seleccionado = document.querySelector(".seleccionado");
    if (seleccionado) {
      cantidad(seleccionado);
    } else {
      await sweet.fire({ title: "Producto no seleccionado" });
      document.querySelector(".ok").focus();
    }
  }

  if (e.key === "Escape") {
    if (
      !document.activeElement.classList.contains("swal2-input") &&
      !document.activeElement.classList.contains("swal2-modal")
    ) {
      window.close();
    }
  }
});

body.addEventListener("keyup", async (e) => {
  if (
    document.activeElement.nodeName !== "SELECT" &&
    document.activeElement.nodeName !== "INPUT"
  ) {
    subSeleccionado = await recorrerFlechas(e);
    seleccionado = subSeleccionado && subSeleccionado.parentNode;
    subSeleccionado &&
      subSeleccionado.scrollIntoView({
        block: "center",
        behavior: "smooth",
      });
  }
});

async function filtrar() {
  resultado.innerHTML = "";
  texto = buscarProducto.value.toLowerCase();
  texto = texto.replace("/", "%2F");
  if (texto !== "") {
    let condicion = select.value;
    condicion === "codigo" && (condicion = "_id");
    productos = (
      await axios.get(
        `${URL}productos/buscarProducto/${texto}/${condicion}`,
        configAxios
      )
    ).data;
  } else {
    productos = (
      await axios.get(
        `${URL}productos/buscarProducto/textoVacio/descripcion`,
        configAxios
      )
    ).data;
  }

  for (let producto of productos) {
    const tr = document.createElement("tr");
    tr.id = producto._id;

    const thCodigo = document.createElement("th");
    const tdDescripcion = document.createElement("td");
    const tdPrecio = document.createElement("td");
    const tdMarca = document.createElement("td");
    const tdStock = document.createElement("td");
    const tdFabrica = document.createElement("td");
    const tdObservaciones = document.createElement("td");

    tdDescripcion.classList.add("descripcion");

    thCodigo.innerHTML = producto._id;
    tdDescripcion.innerHTML = producto.descripcion;
    tdPrecio.innerHTML = producto.oferta
      ? ` <p class=oferta>
                <span>${producto.precioOferta}</span>
                <span>${producto.precio_venta}</span>
            </p>`
      : producto.precio_venta;
    tdMarca.innerHTML = producto.marca;
    tdStock.innerHTML = parseFloat(producto.stock).toFixed(2);
    tdFabrica.innerHTML = producto.cod_fabrica;
    tdObservaciones.innerHTML = producto.observacion;

    tr.appendChild(thCodigo);
    tr.appendChild(tdDescripcion);
    tr.appendChild(tdPrecio);
    tr.appendChild(tdMarca);
    tr.appendChild(tdStock);
    tr.appendChild(tdFabrica);
    tr.appendChild(tdObservaciones);

    resultado.appendChild(tr);
  }
  seleccionado = seleccionarTBody.firstElementChild;
  seleccionado.classList.add("seleccionado");

  subSeleccionado = seleccionado.children[0];
  subSeleccionado.classList.add("subSeleccionado");
}

//le damos el foco a buscarProducto
select.addEventListener("keydown", (e) => {
  if (e.keyCode === 39) {
    e.preventDefault();
    buscarProducto.focus();
  }
});

buscarProducto.addEventListener("keyup", (e) => {
  if (e.keyCode === 37) {
    if (buscarProducto.value === "") {
      select.focus();
    }
  } else if (e.keyCode === 40) {
    buscarProducto.blur();
    resultado.focus();
  } else {
    filtrar();
  }
});

seleccionarTBody.addEventListener("click", (e) => {
  seleccionado = document.querySelector(".seleccionado");
  subSeleccionado = document.querySelector(".subSeleccionado");

  seleccionado && seleccionado.classList.remove("seleccionado");
  subSeleccionado && subSeleccionado.classList.remove("subSeleccionado");

  if (e.target.nodeName === "TD" || e.target.nodeName === "TH") {
    seleccionado = e.target.parentNode;
    subSeleccionado = e.target;
  } else if (e.target.nodeName === "TR") {
    seleccionado = e.target;
    subSeleccionado = e.target.children[0];
  }

  seleccionado.classList.add("seleccionado");
  subSeleccionado.classList.add("subSeleccionado");
});

seleccionarTBody.addEventListener("dblclick", (e) => {
  seleccionado = document.querySelector(".seleccionado");
  seleccionado
    ? cantidad(seleccionado)
    : sweet.fire({ title: "Producto no seleccionado" });
});

async function cantidad(e) {
  sweet
    .fire({
      title: "Cantidad",
      input: "text",
      returnFocus: false,
      showCancelButton: true,
      confirmButtonText: "Aceptar",
    })
    .then(async ({ isConfirmed, value }) => {
      if (isConfirmed && value !== "" && value !== ".") {
        console.log(seleccionado);
        const pro = productos.find((e) => e._id === seleccionado.id);
        if (value === undefined || value === "" || parseFloat(value) === 0) {
          await seleccionado.classList.remove("seleccionado");
          seleccionado = "";
          buscarProducto.focus();
        } else {
          if (!Number.isInteger(parseFloat(value)) && pro.unidad === "U") {
            sweet.fire({
              title: "El producto no se puede escribir con decimal",
            });
          } else {
            parseFloat(e.children[4].innerHTML) < 0 &&
              (await sweet.fire({ title: "Stock Negativo" }));
            parseFloat(e.children[2].innerHTML) === 0 &&
              (await sweet.fire({ title: "Precio del producto en 0" }));
            parseFloat(e.children[4].innerHTML) === 0 &&
              (await sweet.fire({ title: "Producto con stock en 0" }));
            ipcRenderer.send("mando-el-producto", {
              _id: e.id,
              cantidad: value,
            });
            await seleccionado.classList.remove("seleccionado");
            await subSeleccionado.classList.remove("subSeleccionado");
            seleccionado = "";
            subSeleccionado = "";
            buscarProducto.value = "";
            buscarProducto.focus();
          }
        }
      }
    });
}
