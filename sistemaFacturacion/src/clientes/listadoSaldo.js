const XLSX = require("xlsx");
const { ipcRenderer } = require("electron");

const axios = require("axios");
require("dotenv").config;
const URL = process.env.URL;

let situacion = "blanco";
let Clientes = {};

const { configAxios } = require("../funciones");

const tbody = document.querySelector(".tbody");
const fecha = document.querySelector(".fecha");
const fechaHoy = new Date();

let hoy = fechaHoy.getDate();
let month = fechaHoy.getMonth() + 1;
let year = fechaHoy.getFullYear();
let clientes = [];

hoy = hoy < 10 ? `0${hoy}` : hoy;
month = month < 10 ? `0${month}` : month;
month = month === 13 ? 1 : month;

fecha.innerHTML = `${hoy}/${month}/${year}`;

document.addEventListener("keydown", (event) => {
  if (event.key === "Alt") {
    document.addEventListener("keydown", (e) => {
      if (e.key === "F9" && situacion === "blanco") {
        mostrarNegro();
        situacion = "negro";
        mostrarLista(Clientes);
      }
    });
  }
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Alt") {
    document.addEventListener("keydown", (e) => {
      if (e.key === "F3" && situacion === "negro") {
        ocultarNegro();
        situacion = "blanco";
        mostrarLista(Clientes);
      }
    });
  }
});
const saldoP = document.querySelector(".saldoP");
const ocultarNegro = () => {
  saldoP.classList.add("none");
};

const mostrarNegro = () => {
  saldoP.classList.remove("none");
};

const traerSaldo = async () => {
  Clientes = (await axios.get(`${URL}clientes`, configAxios)).data;
  Clientes.sort((a, b) => {
    if (a.cliente < b.cliente) {
      return -1;
    } else if (a.cliente > b.cliente) {
      return 0;
    }
    return 0;
  });
  clientes = Clientes.filter(
    (cliente) =>
      parseFloat(cliente.saldo) !== 0 || parseFloat(cliente.saldo_p) !== 0
  );
  mostrarLista(Clientes);
};
traerSaldo();

const descargar = document.querySelector(".descargar");
descargar.addEventListener("click", async (e) => {
  let path = await ipcRenderer.invoke("elegirPath");
  let extencion = "xlsx";
  let wb = XLSX.utils.book_new();
  extencion = path.split(".")[1] ? path.split(".")[1] : extencion;
  wb.props = {
    Title: "Listado Saldo",
    subject: "test",
    Author: "Electro Avenida",
  };

  clientes.forEach((cliente) => {
    cliente.saldo = parseFloat(cliente.saldo);
    cliente.saldo_p = parseFloat(cliente.saldo_p);
  });

  let newWS = XLSX.utils.json_to_sheet(clientes);

  XLSX.utils.book_append_sheet(wb, newWS, "Saldos");
  XLSX.writeFile(wb, path + "." + extencion);
});

document.addEventListener("keyup", (e) => {
  if (e.key === "Escape") {
    window.close();
  }
});

const mostrarLista = (clientes) => {
  tbody.innerHTML = "";
  clientes.forEach((cliente) => {
    if (situacion === "blanco" && parseFloat(cliente.saldo) !== 0) {
      tbody.innerHTML += `
            <tr>
                <td class = "id">${cliente._id}</td>
                <td class ="inicio cliente">${cliente.cliente}</td>
                <td class ="inicio">${cliente.direccion.slice(0, 25)}</td>
                <td class ="inicio">${cliente.cond_iva}</td>
                <td class ="inicio">${cliente.telefono}</td>
                <td>${cliente.saldo}</td>
            </tr>
        `;
    } else if (
      situacion === "negro" &&
      (parseFloat(cliente.saldo) !== 0 || parseFloat(cliente.saldo_p) !== 0)
    ) {
      tbody.innerHTML += `
                <tr>
                    <td class = "id">${cliente._id}</td>
                    <td class = "inicio">${cliente.cliente}</td>
                    <td class ="inicio">${cliente.direccion}</td>
                    <td class ="inicio">${cliente.cond_iva}</td>
                    <td class ="inicio">${cliente.telefono}</td>
                    <td>${cliente.saldo}</td>
                    <td>${cliente.saldo_p}</td>
                </tr>
            `;
    }
  });
};
