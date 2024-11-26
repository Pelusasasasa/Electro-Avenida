const axios = require("axios");
const { ipcRenderer } = require("electron");
const { redondear, configAxios } = require("../assets/js/globales");
require("dotenv").config();
const URL = process.env.URL;

const XLSX = require("xlsx");

const desde = document.getElementById("desde");
const hasta = document.getElementById("hasta");

const tbody = document.querySelector("tbody");

const percepBrutosCompras = document.getElementById("percepBrutosCompras");
const percepIvaCompras = document.getElementById("percepIvaCompras");
const retencionBrutosCompras = document.getElementById(
  "retencionBrutosCompras"
);
const retencionIvaCompras = document.getElementById("retencionIvaCompras");

const exportar = document.querySelector(".exportar");
const periodo = document.querySelector(".periodo");

let datos;

window.addEventListener("load", async (e) => {
  const fecha = new Date();
  let month = fecha.getMonth() + 1;
  let year = fecha.getFullYear();
  month = month === 13 ? 1 : month;
  month = month < 10 ? `0${month}` : month;

  desde.value = `${year}-${month}`;
  hasta.value = `${year}-${month}`;

  datos = (
    await axios.get(
      `${URL}dat_comp/fechaImp/${desde.value}/${hasta.value}`,
      configAxios
    )
  ).data;
  listarDatos(
    datos.filter(
      (dato) =>
        dato.tipo_comp !== "Presupuesto" && dato.tipo_comp !== "Descuento"
    )
  );
});

desde.addEventListener("keypress", async (e) => {
  if (e.keyCode === 13) {
    hasta.focus();
  }
});

hasta.addEventListener("change", async (e) => {
  datos = (
    await axios.get(
      `${URL}dat_comp/fechaImp/${desde.value}/${hasta.value}`,
      configAxios
    )
  ).data;
  listarDatos(
    datos.filter(
      (dato) =>
        dato.tipo_comp !== "Presupuesto" && dato.tipo_comp !== "Descuento"
    )
  );
});

exportar.addEventListener("click", async (e) => {
  let path = await ipcRenderer.invoke("elegirPath");
  let wb = XLSX.utils.book_new();
  let extencion = "xlsx";

  wb.props = {
    Title: "Compras",
    subject: "Test",
    Author: "Electro Avenida",
  };

  datos = datos.filter((dato) => dato.tipo_comp !== "Descuento");

  datos.forEach((dato) => {
    delete dato._id;
  });

  let newWs = XLSX.utils.json_to_sheet(datos);

  XLSX.utils.book_append_sheet(wb, newWs, "Compras");
  XLSX.writeFile(wb, path + "." + extencion);
});

const listarDatos = (lista) => {
  console.log(lista);
  lista.sort((a, b) => {
    if (a.fecha_comp > b.fecha_comp) {
      return 1;
    } else if (a.fecha_comp < b.fecha_comp) {
      return -1;
    }
  });

  tbody.innerHTML = "";
  let pdgr = 0;
  let rdgr = 0;
  let piva = 0;
  let riva = 0;
  let iva = 0;
  let gravado = 0;
  let total = 0;

  for (let elem of lista) {
    const tr = document.createElement("tr");
    tr.id = elem._id;

    const tdFecha = document.createElement("td");
    const tdTipoComp = document.createElement("td");
    const tdNumComp = document.createElement("td");
    const tdEmpresa = document.createElement("td");
    const tdCuit = document.createElement("td");
    const tdGravado = document.createElement("td");
    const tdNoGravado = document.createElement("td");
    const tdTasaIva = document.createElement("td");
    const tdIva = document.createElement("td");
    const tdPDGR = document.createElement("td");
    const tdRDGR = document.createElement("td");
    const tdPIVA = document.createElement("td");
    const tdRIVA = document.createElement("td");
    const tdTotal = document.createElement("td");

    const fecha = elem.fecha_comp.slice(0, 10).split("-", 3);

    tdFecha.innerHTML = `${fecha[2]}/${fecha[1]}/${fecha[0]}`;
    tdTipoComp.innerHTML = elem.tipo_comp;
    tdNumComp.innerHTML = elem.nro_comp;
    tdEmpresa.innerHTML = elem.provedor;
    tdCuit.innerHTML = elem.cuit;
    tdGravado.innerHTML =
      elem.tipo_comp === "Nota Credito"
        ? redondear(elem.netoGravado * -1, 2)
        : elem.netoGravado.toFixed(2);
    tdNoGravado.innerHTML =
      elem.tipo_comp === "Nota Credito"
        ? redondear(elem.netoNoGravado * -1, 2)
        : elem.netoNoGravado.toFixed(2);
    tdTasaIva.innerHTML =
      elem.tipo_comp === "Nota Credito"
        ? redondear(elem.tasaIva * -1, 2)
        : elem.tasaIva.toFixed(2);
    tdIva.innerHTML =
      elem.tipo_comp === "Nota Credito"
        ? redondear(elem.iva * -1, 2)
        : elem.iva.toFixed(2);
    tdPDGR.innerHTML =
      elem.tipo_comp === "Nota Credito"
        ? redondear(elem.p_dgr_c * -1, 2)
        : elem.p_dgr_c.toFixed(2);
    tdRDGR.innerHTML =
      elem.tipo_comp === "Nota Credito"
        ? redondear(elem.r_dgr_c * -1, 2)
        : elem.r_dgr_c.toFixed(2);
    tdPIVA.innerHTML =
      elem.tipo_comp === "Nota Credito"
        ? redondear(elem.p_iva_c * -1, 2)
        : elem.p_iva_c.toFixed(2);
    tdRIVA.innerHTML =
      elem.tipo_comp === "Nota Credito"
        ? redondear(elem.r_iva_c * -1, 2)
        : elem.r_iva_c.toFixed(2);
    tdTotal.innerHTML =
      elem.tipo_comp === "Nota Credito"
        ? redondear(elem.total * -1, 2)
        : elem.total.toFixed(2);

    gravado =
      elem.tipo_comp === "Nota Credito"
        ? gravado - elem.netoGravado
        : gravado + elem.netoGravado;
    iva = elem.tipo_comp === "Nota Credito" ? iva - elem.iva : iva + elem.iva;
    pdgr =
      elem.tipo_comp === "Nota Credito"
        ? pdgr - elem.p_dgr_c
        : pdgr + elem.p_dgr_c;
    rdgr =
      elem.tipo_comp === "Nota Credito"
        ? rdgr - elem.r_dgr_c
        : rdgr + elem.r_dgr_c;
    piva =
      elem.tipo_comp === "Nota Credito"
        ? piva - elem.p_iva_c
        : piva + elem.p_iva_c;
    riva =
      elem.tipo_comp === "Nota Credito"
        ? riva - elem.r_iva_c
        : riva + elem.r_iva_c;
    total =
      elem.tipo_comp === "Nota Credito"
        ? total - elem.total
        : total + elem.total;

    tdGravado.classList.add("text-right");
    tdNoGravado.classList.add("text-right");
    tdTasaIva.classList.add("text-right");
    tdIva.classList.add("text-right");
    tdPDGR.classList.add("text-right");
    tdRDGR.classList.add("text-right");
    tdPIVA.classList.add("text-right");
    tdRIVA.classList.add("text-right");
    tdTotal.classList.add("text-right");

    tr.appendChild(tdFecha);
    tr.appendChild(tdTipoComp);
    tr.appendChild(tdNumComp);
    tr.appendChild(tdEmpresa);
    tr.appendChild(tdCuit);
    tr.appendChild(tdGravado);
    tr.appendChild(tdNoGravado);
    tr.appendChild(tdTasaIva);
    tr.appendChild(tdIva);
    tr.appendChild(tdPDGR);
    tr.appendChild(tdRDGR);
    tr.appendChild(tdPIVA);
    tr.appendChild(tdRIVA);
    tr.appendChild(tdTotal);

    tbody.appendChild(tr);
  }
  if (lista.length > 0) {
    const tr = document.createElement("tr");

    const td1 = document.createElement("td");
    const td2 = document.createElement("td");
    const td3 = document.createElement("td");
    const td4 = document.createElement("td");
    const td5 = document.createElement("td");
    const tdGravado = document.createElement("td");
    const td6 = document.createElement("td");
    const td7 = document.createElement("td");
    const tdIva = document.createElement("td");
    const tdPDGR = document.createElement("td");
    const tdRDGR = document.createElement("td");
    const tdPIVA = document.createElement("td");
    const tdRIVA = document.createElement("td");
    const tdTotal = document.createElement("td");

    tr.classList.add("bold");

    tdGravado.innerHTML = gravado.toFixed(2);
    tdIva.innerHTML = iva.toFixed(2);
    tdPDGR.innerHTML = pdgr.toFixed(2);
    tdRDGR.innerHTML = rdgr.toFixed(2);
    tdPIVA.innerHTML = piva.toFixed(2);
    tdRIVA.innerHTML = riva.toFixed(2);
    tdTotal.innerHTML = total.toFixed(2);

    tdGravado.classList.add("text-right");
    tdIva.classList.add("text-right");
    tdPDGR.classList.add("text-right");
    tdRDGR.classList.add("text-right");
    tdPIVA.classList.add("text-right");
    tdRIVA.classList.add("text-right");
    tdTotal.classList.add("text-right");

    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    tr.appendChild(td5);
    tr.appendChild(tdGravado);
    tr.appendChild(td6);
    tr.appendChild(td7);
    tr.appendChild(tdIva);
    tr.appendChild(tdPDGR);
    tr.appendChild(tdRDGR);
    tr.appendChild(tdPIVA);
    tr.appendChild(tdRIVA);
    tr.appendChild(tdTotal);

    tbody.appendChild(tr);
  }

  percepBrutosCompras.innerHTML = pdgr.toFixed(2);
  percepIvaCompras.innerHTML = piva.toFixed(2);
  retencionBrutosCompras.innerHTML = rdgr.toFixed(2);
  retencionIvaCompras.innerHTML = riva.toFixed(2);
};

desde.addEventListener("keypress", (e) => {
  if (e.keyCode === 13) {
    hasta.focus();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.keyCode === 27) {
    location.href = "../index.html";
  }
});
