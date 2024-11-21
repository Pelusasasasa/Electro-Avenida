const sweet = require("sweetalert2");

const tbody = document.querySelector(".tbody");
const body = document.querySelector("body");
const salir = document.querySelector(".salirBoton");
const cambiar = document.querySelector(".cambiarBoton");
const impirmir = document.querySelector(".imprimirBoton");

const axios = require("axios");
const { verificarUsuarios, configAxios, verNombrePc } = require("../funciones");
require("dotenv").config;
const URL = process.env.URL;

let seleccionado;
let subSeleccionado;
let vendedor;

body.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    window.close();
  }
});

window.addEventListener("load", async (e) => {
  vendedor = await verificarUsuarios();

  if (vendedor === "") {
    await sweet.fire({
      title: "Contraseña Incorrecta",
    });
    location.reload();
  } else if (!vendedor) {
    window.close();
  }

  let productos = (await axios(`${URL}productos/stockNegativo`, configAxios))
    .data;
  listarStockNegativo(productos);
});

const listarStockNegativo = async (productos) => {
  productos.sort((a, b) => {
    if (a.descripcion > b.descripcion) {
      return 1;
    } else if (a.descripcion < b.descripcion) {
      return -1;
    }

    return 0;
  });
  listarProductos(productos);
};

async function listarProductos(lista) {
  for await (let producto of lista) {
    tbody.innerHTML += `
            <tr id="${producto._id}">
                <td>${producto._id}</td>
                <td>${producto.descripcion}</td>
                <td>${producto.marca}</td>
                <td class=text-end>${parseFloat(producto.stock).toFixed(2)}</td>
            </tr>
        `;
  }
  seleccionado = tbody.firstElementChild;
  subSeleccionado = seleccionado.children[1];
  seleccionado.classList.add("seleccionado");
  subSeleccionado.classList.add("subSeleccionado");
}

tbody.addEventListener("click", (e) => {
  seleccionado && seleccionado.classList.remove("seleccionado");
  subSeleccionado && subSeleccionado.classList.remove("subSeleccionado");

  seleccionado = e.target.parentNode;
  subSeleccionado = e.target;

  seleccionado.classList.add("seleccionado");
  subSeleccionado.classList.add("subSeleccionado");
});

cambiar.addEventListener("click", async (e) => {
  await sweet
    .fire({
      title: "Nuevo Stock",
      showCancelButton: false,
      input: "text",
      confirmButtonText: "Aceptar",
    })
    .then(async ({ isConfirmed, value }) => {
      if (isConfirmed && value !== "") {
        let producto = (
          await axios.get(`${URL}productos/${seleccionado.id}`, configAxios)
        ).data;
        await crearMovimiento(producto, value);
        producto.stock = value;
        producto.vendedor = vendedor.nombre;
        producto.maquina = verNombrePc();
        await axios.put(
          `${URL}productos/${seleccionado.id}`,
          producto,
          configAxios
        );
        if (parseFloat(producto.stock) > 0) {
          tbody.removeChild(seleccionado);
        } else {
          seleccionado.children[3].innerHTML = parseFloat(
            producto.stock
          ).toFixed(2);
        }
      }
    });
});

//creamos el movimiento de producto
const crearMovimiento = async (producto, stock) => {
  const movimiento = {};
  movimiento.codProd = producto._id;
  movimiento.descripcion = producto.descripcion;
  movimiento.ingreso = parseFloat(stock) - parseFloat(producto.stock);
  movimiento.stock = stock;
  movimiento.vendedor = vendedor.nombre;
  movimiento.maquina = verNombrePc();
  movimiento.tipo_comp = "+";
  movimiento.precio_unitario = producto.precio_venta;
  await axios.post(`${URL}movProductos`, [movimiento], configAxios);
};

impirmir.addEventListener("click", (e) => {
  printPage();
});

salir.addEventListener("click", () => {
  window.close();
});

function printPage() {
  const botones = document.querySelector(".botones");
  botones.classList.add("disable");
  window.print();
  botones.classList.remove("disable");
}
