const axios = require("axios");
const { ipcRenderer } = require("electron");
const sweet = require("sweetalert2");
const {
  cerrarVentana,
  botonesSalir,
  verificarUsuarios,
  configAxios,
  verNombrePc,
} = require("../funciones");

require("dotenv").config;
const URL = process.env.URL;

const codigo = document.querySelector("#codigo");
const saldo = document.querySelector("#saldo");
const divsaldo_P = document.querySelector(".saldo_P");
const saldo_P = document.querySelector("#saldo_P");
const nombre = document.querySelector("#nombre");
const guardar = document.querySelector(".guardar");

let cliente = {};
let acceso;
let vendedor;

ipcRenderer.on("acceso", (e, args) => {
  acceso = JSON.parse(args);
  console.log(acceso);
  if (acceso !== "0") {
  }
});

window.addEventListener("load", async (e) => {
  vendedor = await verificarUsuarios();
  if (vendedor === "") {
    await sweet.fire({
      title: "Contraseña Incorrecta",
    });
    location.reload();
  } else if (vendedor.acceso !== "0") {
    await sweet.fire({
      title: "Acceso denegado",
    });
    window.close();
  }
  cerrarVentana();
  botonesSalir();
});

codigo.addEventListener("keypress", async (e) => {
  if (e.key === "Enter") {
    cliente = (
      await axios.get(
        `${URL}clientes/id/${codigo.value.toUpperCase()}`,
        configAxios
      )
    ).data;
    if (cliente !== "") {
      listarCliente(cliente);
      saldo.focus();
    } else {
      await sweet.fire({
        title: "Cliente No Encontrado",
      });
      codigo.value = "";
    }
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Alt") {
    document.addEventListener("keydown", (e) => {
      if (e.key === "F9") {
        divsaldo_P.classList.remove("none");
      } else if (e.key === "F8") {
        divsaldo_P.classList.add("none");
      }
    });
  }
});

const listarCliente = async (cliente) => {
  nombre.value = cliente.cliente;
  saldo.value = cliente.saldo;
  codigo.value = cliente._id;
  saldo_P.value = cliente.saldo_p;
};

codigo.addEventListener("focus", (e) => {
  codigo.select();
});

saldo.addEventListener("focus", (e) => {
  saldo.select();
});

saldo_P.addEventListener("focus", (e) => {
  saldo_P.select();
});

saldo.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    if (divsaldo_P.classList.contains("none")) {
      guardar.focus();
    } else {
      saldo_P.focus();
    }
  }
});

saldo_P.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    guardar.focus();
  }
});

guardar.addEventListener("click", async (e) => {
  cliente.saldo = saldo.value;
  cliente.saldo_p = saldo_P.value;
  cliente.vendedor = vendedor.nombre;
  cliente.maquina = verNombrePc();
  await axios.put(`${URL}clientes/${cliente._id}`, cliente, configAxios);
  window.close();
});
