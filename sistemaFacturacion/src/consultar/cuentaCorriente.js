const { ipcRenderer } = require("electron");
const sweet = require("sweetalert2");

const axios = require("axios");
const {
  copiar,
  recorrerFlechas,
  configAxios,
  clickderecho,
} = require("../funciones");
require("dotenv").config;
const URL = process.env.URL;

const codigoCliente = document.querySelector("#codigoCliente");
const cliente = document.querySelector("#buscador");
const saldo = document.querySelector("#saldo");
const listar = document.querySelector(".listar");
const compensada = document.querySelector(".compensada");
const historica = document.querySelector(".historica");
const actualizar = document.querySelector(".actualizar");
const detalle = document.querySelector(".detalle");

const facturarVarios = document.querySelector(".facturarVarios");
const botonFacturar = document.querySelector("#botonFacturar");
const volver = document.querySelector(".volver");

let listaCompensada = [];
let listaHistorica = [];
let clienteTraido = {};
let listaGlobal = [];
let vendedor = "";
let seleccionado = "";
let subSeleccionado = "";
let situacion = "blanco";
let tipo = "compensada";

copiar();

//mostramos la base de datos cuenta historica del cliente
historica.addEventListener("click", (e) => {
  historica.classList.add("none");
  compensada.classList.remove("none");
  tipo = "historica";
  listarLista(listaHistorica, situacion, tipo);
});

//mostramos la base de datos cuenta compensada del cliente
compensada.addEventListener("click", (e) => {
  compensada.classList.add("none");
  historica.classList.remove("none");
  tipo = "compensada";
  listarLista(listaCompensada, situacion, tipo);
});

//Pasamos de negro a blanco o vicebersa
document.addEventListener("keydown", async (event) => {
  if (event.key === "Alt") {
    document.addEventListener("keydown", (e) => {
      if (e.key === "F8" && situacion === "negro") {
        ocultarNegro();
        situacion = "blanco";
        tipo === "compensada"
          ? listarLista(listaCompensada, situacion, tipo)
          : listarLista(listaHistorica, situacion, tipo);
      } else if (e.key === "F9" && situacion === "blanco") {
        mostrarNegro();
        situacion = "negro";
        tipo === "compensada"
          ? listarLista(listaCompensada, situacion, tipo)
          : listarLista(listaHistorica, situacion, tipo);
      }
    });
  }

  subSeleccionado = await recorrerFlechas(event);
  seleccionado = subSeleccionado && subSeleccionado.parentNode;
  if (seleccionado && !seleccionado.classList.contains("detalle")) {
    subSeleccionado &&
      mostrarDetalles(seleccionado.id, seleccionado.children[1].innerHTML);
  }
  subSeleccionado &&
    subSeleccionado.scrollIntoView({
      block: "center",
      inline: "center",
      behavior: "smooth",
    });
});

const labes = document.querySelectorAll("label");
//Ocultado lo que tenemos en negro
const ocultarNegro = () => {
  labes.forEach((label) => label.classList.remove("blanco"));
  const saldo_p = document.querySelector("#saldo_p");
  const body = document.querySelector(".consultaCtaCte");
  const botones = document.querySelector(".botones");
  const buscador = document.querySelector(".buscador");
  buscador.classList.remove("mostrarNegro");
  botones.classList.remove("mostrarNegro");
  saldo.classList.remove("none");
  saldo_p.classList.add("none");
  botonFacturar.classList.add("none");
  facturarVarios.classList.add("none");
  body.classList.remove("mostrarNegro");
  actualizar.classList.add("none");
};

//mostramos lo que tenemos en negro
const mostrarNegro = () => {
  labes.forEach((label) => label.classList.add("blanco"));
  const saldo_p = document.querySelector("#saldo_p");
  const body = document.querySelector(".consultaCtaCte");
  const botones = document.querySelector(".botones");
  const buscador = document.querySelector(".buscador");
  buscador.classList.add("mostrarNegro");
  botones.classList.add("mostrarNegro");
  saldo.classList.add("none");
  botonFacturar.classList.remove('none')
  facturarVarios.classList.remove("none");
  saldo_p.classList.remove("none");
  body.classList.add("mostrarNegro");
  actualizar.classList.remove("none");
};

//Buscamos un cliente
codigoCliente.addEventListener("keypress", async (e) => {
  if (e.key === "Enter") {
    if (codigoCliente.value !== "") {
      let clienteTraido = await axios.get(
        `${URL}clientes/id/${codigoCliente.value.toUpperCase()}`,
        configAxios
      );
      clienteTraido = clienteTraido.data;
      if (clienteTraido !== "") {
        ponerDatosCliente(clienteTraido);
      } else {
        await sweet.fire({ title: "El cliente no existe" });
        codigoCliente.value = "";
      }
    } else {
      ipcRenderer.send("abrir-ventana", "clientes");
    }
  }
});

//Recibimos el cliente que nos mandaron desde la otra ventana
ipcRenderer.on("mando-el-cliente", async (e, args) => {
  let cliente = (await axios.get(`${URL}clientes/id/${args}`, configAxios))
    .data;
  ponerDatosCliente(cliente);
});

ipcRenderer.on("CancelarCuenta", cancelarCuenta);
ipcRenderer.on("CompensarCuenta", compensarCuenta);

//si hacemos click en el tbody vamos a seleccionar una cuenta compensada o historica y pasamos a mostrar los detalles de la cuenta
listar.addEventListener("click", (e) => {
  seleccionado && seleccionado.classList.remove("seleccionado");
  subSeleccionado && subSeleccionado.classList.remove("subSeleccionado");

  if (e.target.nodeName === "TD") {
    seleccionado = e.target.parentNode;
    subSeleccionado = e.target;
  } else if (e.target.nodeName === "INPUT") {
    seleccionado = e.target.parentNode.parentNode;
    subSeleccionado = e.target.parentNode;
  }

  seleccionado.classList.toggle("seleccionado");
  subSeleccionado.classList.add("subSeleccionado");

  if (seleccionado) {
    listaHistorica.forEach(async (listar) => {
      listar.nro_comp === seleccionado.id &&
        mostrarDetalles(listar.nro_comp, listar.tipo_comp);
    });
    
    if (seleccionado.children[3].innerText != '0.10'){
      botonFacturar.disabled = false;
      facturarVarios.disabled = false;
    }else{
      botonFacturar.disabled = true;
      facturarVarios.disabled = true;
    }
  }
});

//Si ponemos algo en observaciones que se nos guarde en la cuenta compensada
listar.addEventListener("keyup", async (e) => {
  
  if (e.keyCode === 9 || e.keyCode === 40 || e.keyCode === 38) {
    seleccionado = e.target.parentNode.parentNode;
    subSeleccionado = e.target.parentNode;
  }

  const observacion = e.target.value; //valor de la observacion
  const id = e.target.parentNode.parentNode.id; //id de el tr de la observacion en la escribimos

  const comp = (await axios.get(`${URL}cuentaComp/id/${id}`, configAxios)).data[0]; //traemos el la cuenta compensada
  const hist = (await axios.get(`${URL}cuentaHisto/id/${id}`, configAxios)).data[0];

  comp.observaciones = observacion.toUpperCase(); //modificamos la observacion de la cuenta
  hist.observaciones = observacion.toUpperCase(); //modificamos la observacion de la cuenta

  await axios.put(`${URL}cuentaComp/numero/${id}`, comp); //la guardamos
  await axios.put(`${URL}cuentaHisto/numero/${id}`, hist); //la guardamos
});

const listarLista = (lista, situacion, tipo) => {
  let aux;

  if (situacion === "negro") {
    aux = "Presupuesto";
  } else {
    if (clienteTraido.cond_iva === "Inscripto" || clienteTraido.cond_iva === "Monotributista") {
      aux = "Factura A";
    } else {
      aux = "Factura B";
    }
  }

  listaGlobal = lista.filter((e) => {
    if (aux === "Presupuesto") {
      return e.tipo_comp === aux || e.tipo_comp === "Recibos_P";
    } else {
      return (
        e.tipo_comp === aux ||
        e.tipo_comp === "Recibos" ||
        e.tipo_comp === "Nota Credito" ||
        e.tipo_comp === "Ticket Factura"
      );
    }
  });

  listaGlobal.sort((a, b) => {
    if (a.fecha > b.fecha) {
      return 1;
    } else if (a.fecha < b.fecha) {
      return -1;
    }
    return 0;
  });

  listar.innerHTML = "";
  listaGlobal.forEach((venta) => {
    vendedor = venta.vendedor;
    if (venta.length !== 0) {
      let fecha = venta.fecha.slice(0, 10).split("-", 3);

      const tr = document.createElement("tr");

      const tdFecha = document.createElement("td");
      const tdTipo = document.createElement("td");
      const tdNumero = document.createElement("td");
      const tdImporte = document.createElement("td");
      const tdPagado = document.createElement("td");
      const tdSaldo = document.createElement("td");
      const tdObservaciones = document.createElement("td");

      const inputObservaciones = document.createElement("input");

      tdFecha.innerText = `${fecha[2]}/${fecha[1]}/${fecha[0]}`;
      tdTipo.innerText = venta.tipo_comp;
      tdNumero.innerText = venta.nro_comp;
      tdImporte.innerText =
        tipo === "compensada"
          ? venta.importe.toFixed(2)
          : venta.debe.toFixed(2);
      tdPagado.innerText =
        tipo === "compensada"
          ? venta.pagado.toFixed(2)
          : venta.haber.toFixed(2);
      tdSaldo.innerText =
        tipo === "compensada" ? venta.saldo.toFixed(2) : venta.saldo.toFixed(2);

      inputObservaciones.value = venta.observaciones;

      tdObservaciones.appendChild(inputObservaciones);

      tr.id = venta.nro_comp;

      tdImporte.classList.add("importe");
      tdPagado.classList.add("pagado");
      tdSaldo.classList.add("saldo");

      inputObservaciones.classList.add(venta.nro_comp);

      tr.appendChild(tdFecha);
      tr.appendChild(tdTipo);
      tr.appendChild(tdNumero);
      tr.appendChild(tdImporte);
      tr.appendChild(tdPagado);
      tr.appendChild(tdSaldo);
      tr.appendChild(tdObservaciones);

      listar.appendChild(tr);
    }
  });
};

async function mostrarDetalles(id, tipo, vendedor) {
  detalle.innerHTML = "";
  //cambiamos los valores de los th del detalle para el recibo
  const tr = document.querySelector(".listarDetalleVenta thead tr");
  tr.children[0].innerText = "Fecha";
  tr.children[1].innerText = "Numero Comp";
  tr.children[2].innerText = "Tipo Comp";
  tr.children[3].innerText = "Pagado";
  tr.children[4].innerText = "Saldo";
  tr.children[5].innerText = "Vendedor";

  if (tipo === "Recibos_P" || tipo === "Recibos") {
    const recibo = (
      await axios.get(
        `${URL}recibos/forNro_comp/${seleccionado.id}`,
        configAxios
      )
    ).data;
    if (recibo.comprobantes.length !== 0) {
      for (let {
        fecha,
        numero,
        pagado,
        saldo,
        comprobante,
      } of recibo.comprobantes) {
        detalle.innerHTML += `
                <tr class comprobante>
                    <td>${fecha}</td>
                    <td>${numero}</td>
                    <td>${comprobante}</td>
                    <td>${pagado}</td>
                    <td>${saldo}</td>
                    <td>${recibo.vendedor}</td>
                </tr>`;
      }
    } else {
      detalle.innerHTML += `
                <tr class="detalle">${recibo.vendedor}</tr>
            `;
    }
  } else {
    const tr = document.querySelector(".listarDetalleVenta thead tr");
    tr.children[0].innerText = "Codigo";
    tr.children[1].innerText = "Descripcion";
    tr.children[2].innerText = "Cantidad";
    tr.children[3].innerText = "Precio";
    tr.children[4].innerText = "Total";
    tr.children[5].innerText = "Vendedor";
    let productos = (
      await axios.get(`${URL}movProductos/${id}/${tipo}`, configAxios)
    ).data;
    let movimientos1 = productos.filter(
      (movimiento) => movimiento.codCliente === clienteTraido._id
    );
    let movimientos2 = productos.filter(
      (movimiento) => movimiento.codigo === clienteTraido._id
    );
    productos = [...movimientos1, ...movimientos2];
    productos.forEach((producto) => {
      let {
        codProd,
        tipo_comp,
        descripcion,
        vendedor,
        ingreso,
        egreso,
        precio_unitario,
      } = producto;
      detalle.innerHTML += `
        <tr id=${seleccionado.id} class="detalle">
            <td>${codProd}</td>
            <td>${descripcion}</td>
            <td>${
              tipo_comp === "Nota Credito"
                ? ingreso.toFixed(2)
                : egreso.toFixed(2)
            }</td>
            <td>${precio_unitario.toFixed(2)}</td>
            <td>${
              tipo_comp === "Nota Credito"
                ? (ingreso * precio_unitario * -1).toFixed(2)
                : (egreso * precio_unitario).toFixed(2)
            }</td>
            <td>${vendedor}</td>
        </tr>
        `;
    });
  }
}

actualizar.addEventListener("click", async (e) => {
  if (seleccionado && !seleccionado.classList.contains("detalle")) {
    venta = (
      await axios.get(`${URL}presupuesto/${seleccionado.id}`, configAxios)
    ).data;
    let cuentaCompensada = (
      await axios.get(`${URL}cuentaComp/id/${seleccionado.id}`, configAxios)
    ).data[0];
    let cuentaHistorica = (
      await axios.get(`${URL}cuentaHisto/id/${seleccionado.id}`, configAxios)
    ).data[0];
    let cliente = (
      await axios.get(
        `${URL}clientes/id/${cuentaCompensada.codigo}`,
        configAxios
      )
    ).data;
    let movimientos = (
      await axios.get(
        `${URL}movProductos/${seleccionado.id}/Presupuesto`,
        configAxios
      )
    ).data;
    //traemos los productos para ver su precio y actualizarlos
    let productos = [];
    let total = 0;
    for await (let movimiento of movimientos) {
      let producto = (
        await axios.get(`${URL}productos/${movimiento.codProd}`, configAxios)
      ).data;
      producto = producto
        ? producto
        : {
            precio_venta: movimiento.precio_unitario,
            descripcion: movimiento.descripcion,
            _id: movimiento.codProd,
            marca: "",
          };
      let aux = producto.oferta
        ? producto.precioOferta
        : parseFloat(producto.precio_venta);
      total = parseFloat(
        (total + parseFloat(movimiento.egreso) * aux).toFixed(2)
      );
      productos.push({ cantidad: movimiento.egreso, objeto: producto });
    }
    venta.productos = productos;

    const index = listaHistorica
      .map((e) => e.nro_comp)
      .indexOf(seleccionado.id);
    let arregloRestante = listaHistorica.slice(index + 1);
    arregloRestante = arregloRestante.filter((e) => {
      return e.tipo_comp === "Presupuesto" || e.tipo_comp === "Recibos_P";
    });
    let saldo =
      parseFloat(cliente.saldo_p) - parseFloat(cuentaCompensada.importe);

    //actualizamos el importe de la cuentaCompensada
    cuentaCompensada.importe = parseFloat(parseFloat(total).toFixed(2));

    //actualizamos el saldo de la cuentaCompensada
    cuentaCompensada.saldo = parseFloat(
      (parseFloat(total) - cuentaCompensada.pagado).toFixed(2)
    );
    cuentaHistorica.saldo -= cuentaHistorica.debe;
    cuentaHistorica.debe = cuentaCompensada.importe;
    //Guardamos la venta con el nuevo precioFinal
    venta.precioFinal = parseFloat(total.toFixed(2));

    for (let mov of movimientos) {
      let producto = (
        await axios.get(`${URL}productos/${mov.codProd}`, configAxios)
      ).data;
      mov.precio_unitario = producto.oferta
        ? producto.precioOferta
        : parseFloat(producto.precio_venta);
      mov.total = parseFloat((mov.egreso * mov.precio_unitario).toFixed(2));
    }

    ipcRenderer.send("imprimir-venta", [
      venta,
      cliente,
      false,
      1,
      "imprimir-comprobante",
      "valorizado",
      movimientos,
      true,
    ]);
    sweet
      .fire({
        title: "Grabar Importe",
        showCancelButton: true,
        confirmButtonText: "Aceptar",
      })
      .then(async ({ isConfirmed }) => {
        if (isConfirmed) {
          for await (let movProducto of movimientos) {
            await axios.put(
              `${URL}movProductos/${movProducto._id}`,
              movProducto,
              configAxios
            );
          }

          venta &&
            (await axios.put(
              `${URL}presupuesto/${venta.nro_comp}`,
              venta,
              configAxios
            ));
          saldo += parseFloat(cuentaCompensada.importe);
          cuentaHistorica.saldo = parseFloat(
            (
              parseFloat(cuentaHistorica.saldo) +
              parseFloat(cuentaHistorica.debe)
            ).toFixed(2)
          );
          let ultimoSaldo = cuentaHistorica.saldo;
          for await (let e of arregloRestante) {
            e.saldo =
              e.tipo_comp === "Recibos_P"
                ? parseFloat((ultimoSaldo - e.haber).toFixed(2))
                : parseFloat((e.debe + ultimoSaldo).toFixed(2));
            ultimoSaldo = e.saldo;
            await axios.put(
              `${URL}cuentaHisto/id/${e.nro_comp}`,
              e,
              configAxios
            );
          }
          cliente.saldo_p = saldo.toFixed(2);
          await axios.put(
            `${URL}cuentaHisto/id/${cuentaHistorica.nro_comp}`,
            cuentaHistorica,
            configAxios
          );
          await axios.put(
            `${URL}cuentaComp/numeroYCliente/${cuentaCompensada.nro_comp}/${cuentaCompensada.codigo}`,
            cuentaCompensada,
            configAxios
          );
          await axios.put(
            `${URL}clientes/${cliente._id}`,
            cliente,
            configAxios
          );
          const cuentaCompensadaModificada = (
            await axios.get(
              `${URL}cuentaComp/id/${seleccionado.id}`,
              configAxios
            )
          ).data[0];

          for (let tr of listar.children) {
            if (tr.id === seleccionado.id) {
              seleccionado.classList.remove("seleccionado");
              seleccionado = tr;
              seleccionado.classList.add("seleccionado");

              subSeleccionado.classList.remove("subSeleccionado");
              subSeleccionado = seleccionado.children[0];
              subSeleccionado.classList.add("subSeleccionado");
            }
          }

          seleccionado.children[3].innerHTML =
            cuentaCompensadaModificada.importe.toFixed(2);
          seleccionado.children[4].innerHTML =
            cuentaCompensadaModificada.pagado.toFixed(2);
          seleccionado.children[5].innerHTML =
            cuentaCompensadaModificada.saldo.toFixed(2);
          saldo.value = cliente.saldo;
          saldo_p.value = cliente.saldo_p;
        }
      });
  } else if (seleccionado && seleccionado.classList.contains("seleccionado")) {
    sweet.fire({ title: "Seleccionar una cuenta, no un movimiento" });
  } else {
    sweet.fire({ title: "Cuenta no seleccionada" });
  }
});

botonFacturar.addEventListener("click", () => {
  if (seleccionado && !seleccionado.classList.contains("detalle")) {
    sweet
      .fire({
        title: "Contraseña",
        input: "password",
        showCancelButton: true,
        confirmButtonText: "Aceptar",
      })
      .then(async ({ isConfirmed, value }) => {
        if (isConfirmed && value !== "") {
          let vendedor = (
            await axios.get(`${URL}usuarios/${value}`, configAxios)
          ).data;
          if (vendedor !== "") {
            ipcRenderer.send("abrir-ventana-emitir-comprobante", [
              vendedor.nombre,
              seleccionado.id,
              vendedor.empresa,
            ]);
          }
        }
      });
  } else if (seleccionado && seleccionado.classList.contains("detalle")) {
    sweet.fire({ title: "Seleccionar una cuenta, no un movimiento" });
  } else {
    sweet.fire({ title: "Venta no seleccionada" });
  }
});

facturarVarios.addEventListener("click", async (e) => {
    //Pedimos contraseña para ver si es un vendedor
    const { isConfirmed, value } = await sweet.fire({
      title: "Contraseña",
      input: "password",
      showCancelButton: true,
      confirmButtonText: "Aceptar",
    });

    if (isConfirmed && value !== "") {
      let vendedor = (await axios.get(`${URL}usuarios/${value}`, configAxios)).data;
      
      let cuentas = listaCompensada;
      let htmlCuentas = "";
      
      for (let cuenta of cuentas) {
        if (cuenta.tipo_comp === "Presupuesto") {
         htmlCuentas += `
              <div>
                  <input type="checkbox" id="${cuenta.nro_comp}" name="${cuenta.nro_comp}"/>
                  <label for="${cuenta.nro_comp}">${cuenta.nro_comp}</label>
              </div>`;
      }};

      if (vendedor !== "") {
          const {isConfirmed} = await sweet.fire({
              title: "Facturar Varios",
              html: htmlCuentas,
              confirmButtonText: "Aceptar",
              showCancelButton: true,
          });
        
          if (isConfirmed) {
            const inputscheckeados = document.querySelectorAll(
              "input[type=checkbox]"
            );

            let value = [];
                
            inputscheckeados.forEach((elem) => {
                elem.checked && value.push(elem.id);
            });

            ipcRenderer.send("facturar_varios", [
              vendedor.nombre,
              value,
              vendedor.empresa,
              codigoCliente.value,
            ]);
          }
      };
    };
});

//Ponemos los datos del cliente en los inputs y traemos las compensadas e historicas
const ponerDatosCliente = async (Cliente) => {
  clienteTraido = Cliente;
  codigoCliente.value = Cliente._id;
  cliente.value = Cliente.cliente;
  saldo.value = parseFloat(Cliente.saldo).toFixed(2);
  saldo_p.value = parseFloat(Cliente.saldo_p).toFixed(2);
  listaVentas = Cliente.listaVentas;
  let compensadas = (
    await axios.get(`${URL}cuentaComp/cliente/${Cliente._id}`, configAxios)
  ).data;
  let historicas = (
    await axios.get(`${URL}cuentaHisto/cliente/${Cliente._id}`, configAxios)
  ).data;
  listaCompensada = compensadas;
  listaHistorica = historicas;
  listarLista(compensadas, situacion, tipo);
};

detalle.addEventListener("click", (e) => {
  seleccionado && seleccionado.classList.remove("seleccionado");
  seleccionado = e.target.nodeName === "TD" ? e.target.parentNode : e.target;
  seleccionado.classList.add("seleccionado");

  subSeleccionado && subSeleccionado.classList.remove("subSeleccionado");
  subSeleccionado = e.target.nodeName === "TD" ? e.target : e.target.parentNode;
  subSeleccionado.classList.add("subSeleccionado");
});

detalle.addEventListener("click", (e) => {
  seleccionado && seleccionado.classList.remove("seleccionado");
  seleccionado = e.target.nodeName === "TD" ? e.target.parentNode : e.target;
  seleccionado.classList.add("seleccionado");

  subSeleccionado && subSeleccionado.classList.remove("subSeleccionado");
  subSeleccionado =
    e.target.nodeName === "TD" ? e.target : e.target.children[0];
  subSeleccionado.classList.add("subSeleccionado");
});

//Se ejecuta cunado hacemos click derecho un menu
listar.addEventListener("contextmenu", (e) => {
  clickderecho(e, "Cuenta Corriente");

  seleccionado && seleccionado.classList.remove("seleccionado");
  subSeleccionado && subSeleccionado.classList.remove("subSeleccionado");

  if (e.target.nodeName === "TD") {
    seleccionado = e.target.parentNode;
    subSeleccionado = e.target;
  }
  subSeleccionado.classList.add("subSeleccionado");
  seleccionado.classList.add("seleccionado");
});

//cuando se hace click en cancelar cuenta en el menu secundario se ejecuta esta funcion
async function cancelarCuenta(e) {
  const { isConfirmed } = await sweet.fire({
    title: `Seguro quiere Eliminar el comprobante Nro ${seleccionado.children[2].innerText}`,
    showCancelButton: true,
    confirmButtonText: "Aceptar",
  });

  if (isConfirmed) {
    const cuenta = (
      await axios.get(
        `${URL}cuentaComp/numeroYCliente/${seleccionado.children[2].innerText}/${codigoCliente.value}`,
        configAxios
      )
    ).data;
    cuenta.pagado = cuenta.importe;
    cuenta.saldo = 0;
    await axios.put(
      `${URL}cuentaComp/numeroYCliente/${cuenta.nro_comp}/${cuenta.codigo}`,
      cuenta,
      configAxios
    );
    listar.removeChild(seleccionado);
  }
}

async function compensarCuenta(e) {
  const cuenta = (
    await axios.get(
      `${URL}cuentaComp/numeroYCliente/${seleccionado.id}/${codigoCliente.value}`,
      configAxios
    )
  ).data;

  cuenta.saldo = cuenta.importe;
  cuenta.pagado = 0;

  listaCompensada.push(cuenta);
  await axios.put(
    `${URL}cuentaComp/numeroYCliente/${seleccionado.id}/${codigoCliente.value}`,
    cuenta,
    configAxios
  );
}

document.addEventListener("keyup", (e) => {
  if (e.keyCode === 27) {
    location.href = "../index.html";
  }
});

volver.addEventListener("click", (e) => {
  location.href = "../index.html";
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    location.href === "../index.html";
  }
});

ipcRenderer.on("exportarXLSX", async (e) => {
  const XLSX = require("xlsx");

  let path = await ipcRenderer.invoke("elegirPath");
  let wb = XLSX.utils.book_new();

  let extencion = "xlsx";

  const movimientos = (
    await axios.get(
      `${URL}movProductos/${seleccionado.id}/${seleccionado.children[1].innerText}`
    )
  ).data;
  let resultante = [];
  resultante.push({
    fecha: "Remito N°",
    codigo: seleccionado.children[2].innerText,
    descripcion: "Total Del Remito",
    cantidad: seleccionado.children[3].innerText,
  });

  movimientos.forEach((mov) => {
    const obj = {};
    obj.fecha = mov.fecha.slice(0, 10).split("-", 3).reverse().join("/");
    obj.codigo = mov.codProd;
    obj.descripcion = mov.descripcion;
    obj.cantidad = mov.egreso.toFixed(2);
    obj.precio = mov.precio_unitario.toFixed(2);
    obj.total = mov.total.toFixed(2);
    obj.vendedor = mov.vendedor;

    resultante.push(obj);
  });

  wb.props = {
    Title: "Movimientos",
    subject: "Movimientos",
    Author: "Electro Avenida",
  };

  let newWs = XLSX.utils.json_to_sheet(resultante);

  XLSX.utils.book_append_sheet(wb, newWs, "Movimientos");

  XLSX.writeFile(wb, path + "." + extencion);
});
