const axios = require("axios");
const { configAxios } = require("../funciones");
const { ipcRenderer } = require("electron");
require("dotenv").config;
const URL = process.env.URL;

const divAlerta = document.querySelector(".alerta");

const hoy = new Date();
let dia = hoy.getDate();
let mes = hoy.getMonth() + 1;

let totalRecibos = 0;
let totalFactura = 0;
let totalPresupuesto = 0;

dia = dia < 10 ? `0${dia}` : dia;
mes = mes === 13 ? 1 : mes;
mes = mes < 10 ? `0${mes}` : mes;

const fechaDeHoy = `${hoy.getFullYear()}-${mes}-${dia}`;
const contado = document.querySelector(".contado");
const cteCorriente = document.querySelector(".cteCorriente");
const exportar = document.getElementById('exportar');
const desde = document.querySelector("#desde");
const hasta = document.querySelector("#hasta");
desde.value = fechaDeHoy;
hasta.value = fechaDeHoy;
const tbody = document.querySelector(".tbody");
let ventas = [];

window.addEventListener("load", async (e) => {
  contado.classList.add("seleccionado");

  const desdefecha = new Date(desde.value);
  let tickets = (await axios.get(`${URL}ventas/${desdefecha}/${hasta.value}`)).data;
  let presupuesto = (await axios.get(`${URL}presupuesto/${desdefecha}/${hasta.value}`)).data;
  let recibos = (await axios.get(`${URL}recibos/getbetweenDates/${desdefecha}/${hasta.value}`)).data;
  ventas = [...tickets, ...presupuesto, ...recibos];
  const ventasContado = ventas.filter((venta) => venta.tipo_pago == "CD");

  listarVentas([...recibos, ...ventasContado]);
});

desde.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    hasta.focus();
  }
});

hasta.addEventListener("keypress", async (e) => {
  if (e.key === "Enter") {
    const desdefecha = new Date(desde.value);
    let tickets = (
      await axios.get(`${URL}ventas/${desdefecha}/${hasta.value}`, configAxios)
    ).data;
    let presupuesto = (
      await axios.get(
        `${URL}presupuesto/${desdefecha}/${hasta.value}`,
        configAxios
      )
    ).data;
    let recibos = (
      await axios.get(
        `${URL}recibos/getbetweenDates/${desdefecha}/${hasta.value}`,
        configAxios
      )
    ).data;
    ventas = [...tickets, ...presupuesto, ...recibos];
    contado.focus();
  }
});

contado.addEventListener("click", listarContado);

cteCorriente.addEventListener("click", listarCuentaCorriente);


document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    window.close();
  }
});

exportar.addEventListener("click", imprimirVentas);

async function listarVentas(lista) {
  divAlerta.classList.remove("none");
  contado.removeEventListener("click", listarContado);
  cteCorriente.removeEventListener("click", listarCuentaCorriente);
  tbody.innerHTML = "";

  lista.sort((a, b) => {
    if (a.fecha > b.fecha) {
      return 1;
    } else if (a.fecha < b.fecha) {
      return -1;
    }
    return 0;
  });
  const fragment = document.createDocumentFragment();
  for await (let venta of lista) {
    let tipo = "";
    if (venta.tipo_comp === "Presupuesto") {
      tipo = "P";
    } else if (venta.tipo_comp === "Ticket Factura") {
      tipo = "T";
    } else if (venta.tipo_comp === "Nota Credito") {
      tipo = "N";
    } else if (venta.tipo_comp === "Factura A") {
      tipo = "FA";
    } else if (venta.tipo_comp === "Factura B") {
      tipo = "FB";
    } else {
      tipo = "R";
    }

    const fecha = venta.fecha.slice(0, 10).split("-", 3);
    const hora = venta.fecha.slice(11, 19).split(":", 3);
    let hoy = fecha[2];
    let mes = fecha[1];
    let hours = hora[0];
    let minutes = hora[1];
    let seconds = hora[2];
    let anio = fecha[0];

    const movimientos = (await axios.get(`${URL}movProductos/movimientosPorCliente/${venta.nro_comp}/${venta.tipo_comp}/${venta.cliente}`)).data;

    for await (let mov of movimientos) {
      const tr = document.createElement("tr");

      const tdTipo = document.createElement("td");
      const tdNumero = document.createElement("td");
      const tdFecha = document.createElement("td");
      const tdCliente = document.createElement("td");
      const tdId = document.createElement("td");
      const tdDescripcion = document.createElement("td");
      const tdVendedor = document.createElement("td");
      const tdCantidad = document.createElement("td");
      const tdPrecio = document.createElement("td");
      const tdTotal = document.createElement("td");

      tdTipo.innerHTML = tipo;
      tdNumero.innerHTML = venta.nro_comp;
      tdFecha.innerHTML = `${hoy}/${mes}/${anio} - ${hours}:${minutes}:${seconds}`;
      tdCliente.innerHTML = venta.nombreCliente.slice(0, 18);
      tdId.innerHTML = mov.codProd;
      tdDescripcion.innerHTML = mov.descripcion.slice(0, 22);
      tdVendedor.innerHTML = venta.vendedor?.substr(-20, 3);
      tdCantidad.innerHTML =
        venta.tipo_comp === "Nota Credito"
          ? (mov.ingreso * -1).toFixed(2)
          : mov.egreso.toFixed(2);
      tdPrecio.innerHTML = mov.precio_unitario.toFixed(2);

      tdTotal.innerHTML =
        venta.tipo_comp === "Nota Credito"
          ? (mov.precio_unitario * mov.ingreso * -1).toFixed(2)
          : (mov.precio_unitario * mov.egreso).toFixed(2);

      tr.appendChild(tdTipo);
      tr.appendChild(tdNumero);
      tr.appendChild(tdFecha);
      tr.appendChild(tdCliente);
      tr.appendChild(tdId);
      tr.appendChild(tdDescripcion);
      tr.appendChild(tdVendedor);
      tr.appendChild(tdCantidad);
      tr.appendChild(tdPrecio);
      tr.appendChild(tdTotal);

      fragment.appendChild(tr);
    }
    tbody.appendChild(fragment);

    if (venta.tipo_comp === "Recibos" || venta.tipo_comp === "Recibos_P") {
      tbody.innerHTML += `
                <tr>
                    <td>${tipo}</td>
                    <td>${venta.nro_comp}</td>
                    <td>${hoy}/${mes}/${anio} - ${hours}:${minutes}:${seconds}</td>
                    <td>${venta.cliente.slice(0, 18)}</td>
                    <td></td>
                    <td></td>
                    <td>${venta.vendedor.substr(-20, 3)}</td>
                    <td></td>
                    <td></td>
                    <td>${venta.precioFinal}</td>
                </tr>
            `;
    };

    if (
      venta.tipo_comp === "Ticket Factura" ||
      venta.tipo_comp === "Factura A" ||
      venta.tipo_comp === "Factura B"
    ) {
      totalFactura += venta.precioFinal;
    } else if (venta.tipo_comp === "Nota Credito") {
      totalFactura -= venta.precioFinal;
    } else if (venta.tipo_comp === "Presupuesto") {
      totalPresupuesto += venta.precioFinal;
    } else {
      totalRecibos += venta.precioFinal;
    }
    tbody.innerHTML += `
        <tr class="total"><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td class=tdTotal>${venta.tipo_comp === "Nota Credito"
        ? (parseFloat(venta.precioFinal) * -1).toFixed(2)
        : parseFloat(venta.precioFinal).toFixed(2)
      }</td></tr>`;
  }

  tbody.innerHTML += `
        <tr class="total">
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>Presupuesto: </td>
            <td>${totalPresupuesto.toFixed(2)}</td>
        </tr>
        <tr class="total">
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>Facturas: </td>
            <td>${totalFactura.toFixed(2)}</td>
        </tr>
        <tr class="total">
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>Recibos: </td>
            <td>${totalRecibos.toFixed(2)}</td>
        </tr>
    `;

  contado.addEventListener("click", listarContado);
  cteCorriente.addEventListener("click", listarCuentaCorriente);
  divAlerta.classList.add("none");
};

async function listarContado() {
  totalFactura = 0;
  totalPresupuesto = 0;
  totalRecibos = 0;

  const recibos_P = ventas.filter((venta) => venta.tipo_comp === "Recibos_P");
  const recibos = ventas.filter((venta) => venta.tipo_comp === "Recibos");
  const ventasContado = ventas.filter((venta) => venta.tipo_pago === "CD");
  contado.classList.add("seleccionado");
  cteCorriente.classList.remove("seleccionado");
  listarVentas([...ventasContado, ...recibos, ...recibos_P]);
};

async function listarCuentaCorriente() {
  totalFactura = 0;
  totalPresupuesto = 0;
  totalRecibos = 0;

  const ventasContado = ventas.filter((venta) => venta.tipo_pago === "CC");
  cteCorriente.classList.add("seleccionado");
  contado.classList.remove("seleccionado");
  listarVentas(ventasContado);
};

async function imprimirVentas() {
  let movimientosAExportar = [];
  const XLSX = require('xlsx');
  let path = await ipcRenderer.invoke("elegirPath");

  let wb = XLSX.utils.book_new();
  wb.props = {
    title: 'Listado de Comprobantes',
    subject: "test",
    Author: "Electro Avenida"
  };

  for await(let venta of ventas){
    const movimientos = (await axios.get(`${URL}movProductos/movimientosPorCliente/${venta.nro_comp}/${venta.tipo_comp}/${venta.cliente}`)).data;
    movimientosAExportar = [...movimientosAExportar, ...movimientos];
  };

  movimientosAExportar = movimientosAExportar.filter(mov => mov.tipo_pago  === 'CD');
  
  for await(let mov of movimientosAExportar){
    mov.fecha = mov.fecha.slice(0,10).split('-', 3).reverse().join('/') + ' - ' + mov.fecha.slice(11, 19);
    delete mov._id;
    delete mov.__v;
    delete mov.iva;
    delete mov.costo;
    delete mov.stock;
    delete mov.rubro;
    delete mov.tipo_pago;
  };

  for await(let venta of ventas){
    if(venta.tipo_pago === 'CD' || venta.tipo_comp === 'Recibos' || venta.tipo_comp === 'Recibos_P'){
      const mov = {};
      mov.fecha = venta.fecha.slice(0,10).split('-', 3).reverse().join('/') + ' - ' + venta.fecha.slice(11, 19);
      mov.total = venta.precioFinal;
      mov.nro_comp = venta.nro_comp;
      movimientosAExportar.push(mov);
      movimientosAExportar.push({fecha: mov.fecha});
    }
  };
  
  movimientosAExportar.sort((a, b) => {
    if(a.fecha > b.fecha) return 1;
    if(a.fecha < b.fecha) return -1;
    return 0
  })
    
  let newWS = XLSX.utils.json_to_sheet(movimientosAExportar, {
    header: ['fecha', 'codCliente', 'cliente', 'nro_comp', 'codProd', 'descripcion', 'ingreso', 'egreso', 'tipo_comp', 'precio_unitario']
  });
  
  XLSX.utils.book_append_sheet(wb, newWS, 'Comprobantes');
  XLSX.writeFile(wb, path + "." + "xlsx");
};
