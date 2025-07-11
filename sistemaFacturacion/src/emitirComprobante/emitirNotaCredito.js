require("dotenv").config;
const { ipcRenderer } = require("electron");
const sweet = require("sweetalert2");
const axios = require("axios");
const URL = process.env.URL;

const Afip = require("@afipsdk/afip.js");
const afip = new Afip({ CUIT: 27165767433 });
function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
  return results === null
    ? ""
    : decodeURIComponent(results[1].replace(/\+/g, " "));
}

const {
  verCodComp,
  generarMovimientoCaja,
  redondear,
  configAxios,
  verNombrePc,
  verProductoConCero,
} = require("../funciones");

const vendedor = getParameterByName("vendedor");
const empresa = getParameterByName("empresa");

//cliente
const codigoC = document.querySelector("#codigoC");
const buscarCliente = document.querySelector("#nombre");
const saldo = document.querySelector("#saldo");
const saldo_p = document.querySelector("#saldo_p");
const localidad = document.querySelector("#localidad");
const direccion = document.querySelector("#direccion");
const provincia = document.querySelector("#provincia");
const dnicuit = document.querySelector("#dnicuit");
const telefono = document.querySelector("#telefono");
const conIva = document.querySelector("#conIva");
const observaciones = document.querySelector("#observaciones");

//buscador
const codigo = document.querySelector("#codigo");
const descripcionAgregar = document.querySelector(".descripcion");
const precioAgregar = document.querySelector(".precio");
const agregarIva = document.querySelector(".iva");
const divNuevaCantidad = document.querySelector(".nuevaCantidad");
const divNuevoPrecio = document.querySelector(".nuevoPrecio");

//tabla
const resultado = document.querySelector("#resultado");

//descuento
const facturaOriginal = document.querySelector("#original");
const total = document.querySelector("#total");

//cobrado
const cobrado = document.querySelector("#cobrado");
const divVendedor = document.querySelector(".vendedor");
const radios = document.querySelectorAll("input[name=tipo]");

//parte Final
const factura = document.querySelector(".factura");
const cancelar = document.querySelector(".cancelar");
const borrarProducto = document.querySelector(".borrarProducto");

//alerta
const alerta = document.querySelector(".alerta");

const contado = document.querySelector("#CD");

divVendedor.children[0].innerHTML = vendedor;

let cliente = {};
let listaProductos = [];
let seleccionado;
let subSeleccionado;
let totalPrecioProductos = 0;
let arregloMovimiento = [];
let arregloProductosDescontarStock = [];
let maquina = verNombrePc();

//actualiza el numero de comprobante a uno mas
const actualizarNroCom = async (comprobante, codigo) => {
  let numero;
  let tipoFactura;
  if (codigo === "008") {
    tipoFactura = "Ultima N Credito B";
  } else {
    tipoFactura = "Ultima N Credito A";
  }
  numero = comprobante.split("-")[1];
  numero = (parseFloat(numero) + 1).toString().padStart(8, 0);
  let numeros = (await axios.get(`${URL}tipoVenta`, configAxios)).data;
  numeros[tipoFactura] = `0005-${numero}`;
  await axios.put(`${URL}tipoventa`, numeros, configAxios);
};

//Agregamos el stock nuevo
const agregarStock = async (codigo, cantidad) => {
  let producto = (await axios.get(`${URL}productos/${codigo}`, configAxios))
    .data;
  const descontar = parseFloat(producto.stock) + parseFloat(cantidad);
  producto.stock = descontar.toFixed(2);
  arregloProductosDescontarStock.push(producto);
};

//Generamos el qr
const generarQR = async (texto) => {
  const qrCode = require("qrcode");
  const url = `https://www.afip.gob.ar/fe/qr/?p=${texto}`;
  const QR = await qrCode.toDataURL(url);
  return QR;
};

//sacamos el gravado y el iva
const gravadoMasIva = (ventas) => {
  let totalIva105 = 0;
  let totalIva21 = 0;
  let gravado21 = 0;
  let gravado105 = 0;
  ventas.forEach(({ objeto, cantidad }) => {
    if (objeto.iva === "N") {
      gravado21 +=
        parseFloat(cantidad) * (parseFloat(objeto.precio_venta) / 1.21);
      totalIva21 +=
        parseFloat(cantidad) *
        (parseFloat(objeto.precio_venta) -
          parseFloat(objeto.precio_venta) / 1.21);
    } else {
      gravado105 +=
        parseFloat(cantidad) * parseFloat(objeto.precio_venta / 1.105);
      totalIva105 +=
        parseFloat(cantidad) *
        (parseFloat(objeto.precio_venta) -
          parseFloat(objeto.precio_venta) / 1.105);
    }
  });
  let cantIva = 1;
  if (gravado105 !== 0 && gravado21 !== 0) {
    cantIva = 2;
  }
  return [
    parseFloat(totalIva21.toFixed(2)),
    parseFloat(totalIva105.toFixed(2)),
    parseFloat(gravado21.toFixed(2)),
    parseFloat(gravado105.toFixed(2)),
    cantIva,
  ];
};

//si se sobra menos que se muestre cuanto es la diferencia
function inputCobrado(numero) {
  Total = totalPrecioProductos;
  descuentoN.value = (Total - parseFloat(numero)).toFixed(2);
  descuento.value = ((parseFloat(descuentoN.value) * 100) / Total).toFixed(2);
  total.value = parseFloat(numero).toFixed(2);
}

let id = 1;
const mostrarVentas = (objeto, cantidad) => {
  totalPrecioProductos += objeto.oferta
    ? objeto.precioOferta * cantidad
    : objeto.precio_venta * cantidad;
  total.value = totalPrecioProductos.toFixed(2);
  console.log(objeto.precio_venta);
  resultado.innerHTML += `
        <tr id=${id}>
        <td class="text-end">${parseFloat(cantidad).toFixed(2)}</td>
        <td>${objeto._id}</td>
        <td>${objeto.descripcion}</td>
        <td class="text-end" >${(objeto.iva === "R" ? 10.5 : 21).toFixed(
    2
  )}</td>
        <td class="text-end">${objeto.oferta ? objeto.precioOferta.toFixed(2) : objeto.precio_venta
    }</td>
        <td class="text-end">${objeto.oferta
      ? (objeto.precioOferta * cantidad).toFixed(2)
      : (parseFloat(objeto.precio_venta) * cantidad).toFixed(2)
    }</td>
        </tr>
    `;
  objeto.identificadorTabla = `${id}`;
  id++;
  listaProductos.push({ objeto, cantidad });
};

const movimientoProducto = async (objeto, cantidad, venta) => {
  console.log(objeto.stock + ' Stock');
  console.log(cantidad + ' Cantidad');
  console.log(venta.tipo_pago + ' Tipo Pago');
  let movProducto = {};
  movProducto.codProd = objeto._id;
  movProducto.descripcion = objeto.descripcion;
  movProducto.cliente = venta.nombreCliente;
  movProducto.codCliente = venta.cliente;
  movProducto.comprobante = "Nota de Credito";
  movProducto.tipo_comp = venta.tipo_comp;
  movProducto.nro_comp = venta.nro_comp;
  movProducto.iva = objeto.iva;
  movProducto.ingreso = cantidad;
  movProducto.stock = venta.tipo_pago == 'PP' ? objeto.stock : (parseFloat(objeto.stock) + parseFloat(cantidad)).toFixed(2);
  movProducto.precio_unitario = objeto.oferta ? objeto.precioOferta : objeto.precio_venta;
  movProducto.total = (parseFloat(movProducto.ingreso) * parseFloat(movProducto.precio_unitario)).toFixed(2);
  movProducto.vendedor = venta.vendedor;
  arregloMovimiento.push(movProducto);
};

//Ponemos valores a los inputs
const ponerInputsClientes = async (cliente) => {
  const iva = cliente.cond_iva !== "" ? cliente.cond_iva : "Consumidor Final";

  codigoC.value = cliente._id;
  buscarCliente.value = cliente.cliente;
  saldo.value = cliente.saldo;
  saldo_p.value = cliente.saldo_p;
  localidad.value = cliente.localidad;
  direccion.value = cliente.direccion;
  provincia.value = cliente.provincia;
  dnicuit.value = cliente.cuit;
  telefono.value = cliente.telefono;
  conIva.value = iva;

  if (cliente.condicion === "M") {
    await sweet.fire({ title: `${cliente.observacion}`, returnFocus: false });
  }

  if (codigoC.value === "9999") {
    buscarCliente.removeAttribute("disabled");
    telefono.removeAttribute("disabled");
    localidad.removeAttribute("disabled");
    direccion.removeAttribute("disabled");
    provincia.removeAttribute("disabled");
    dnicuit.removeAttribute("disabled");
    telefono.removeAttribute("disabled");
    conIva.removeAttribute("disabled");
  } else {
    buscarCliente.setAttribute("disabled", "");
    telefono.setAttribute("disabled", "");
    localidad.setAttribute("disabled", "");
    direccion.setAttribute("disabled", "");
    provincia.setAttribute("disabled", "");
    dnicuit.setAttribute("disabled", "");
    telefono.setAttribute("disabled", "");
    conIva.setAttribute("disabled", "");
  }

  if (cliente.cond_fact === "1") {
    radios[2].parentElement.classList.remove("none");
  } else {
    radios[2].parentElement.classList.add("none");
  }
};

//Inicio Compensada
const ponerEnCuentaCorrienteCompensada = async (venta, valorizado) => {
  const cuenta = {};
  cuenta.codigo = venta.cliente;
  cuenta.fecha = new Date();
  cuenta.cliente = buscarCliente.value;
  cuenta.tipo_comp = venta.tipo_comp;
  cuenta.nro_comp = venta.nro_comp;
  cuenta.importe = valorizado ? parseFloat(venta.precioFinal) : 0.1;
  cuenta.saldo = valorizado ? parseFloat(venta.precioFinal) : 0.1;
  cuenta.observaciones = venta.observaciones;
  await axios.post(`${URL}cuentaComp`, cuenta, configAxios);
};

//inicio historica
const ponerEnCuentaCorrienteHistorica = async (venta, valorizado, saldo) => {
  const cuenta = {};
  cuenta.codigo = venta.cliente;
  cuenta.cliente = buscarCliente.value;
  cuenta.tipo_comp = venta.tipo_comp;
  cuenta.nro_comp = venta.nro_comp;
  cuenta.haber = valorizado ? parseFloat(venta.precioFinal) : 0.1;
  cuenta.saldo = parseFloat(saldo) - cuenta.haber;
  await axios.post(`${URL}cuentaHisto`, cuenta, configAxios);
};

const subirAAfip = async (venta, ventaAsociada) => {
  alerta.children[1].innerHTML = "Esperando confirmacion de la afip";
  const ventaAnterior = await afip.ElectronicBilling.getVoucherInfo(parseFloat(facturaOriginal.value), 5, ventaAsociada.cod_comp);


  const fecha = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split("T")[0];

  let ultimoElectronica = await afip.ElectronicBilling.getLastVoucher(5, parseFloat(venta.cod_comp));
  console.log(ultimoElectronica);

  let totalIva105 = 0;
  let totalIva21 = 0;
  let totalNeto21 = 0;
  let totalNeto105 = 0;

  venta.productos.forEach(({ objeto, cantidad }) => {
    if (objeto.iva === "N") {
      totalNeto21 +=
        parseFloat(cantidad) * parseFloat(objeto.precio_venta / 1.21);
      totalIva21 +=
        parseFloat(cantidad) *
        (parseFloat(objeto.precio_venta) -
          parseFloat(objeto.precio_venta) / 1.21);
    } else {
      totalNeto105 +=
        parseFloat(cantidad) * parseFloat(objeto.precio_venta / 1.105);
      totalIva105 +=
        parseFloat(cantidad) *
        (parseFloat(objeto.precio_venta) -
          parseFloat(objeto.precio_venta) / 1.105);
    }
  });

  let data = {
    CantReg: 1,
    CbteTipo: venta.cod_comp,
    CbtesAsoc: [
      {
        Tipo: ventaAnterior.CbteTipo,
        PtoVta: ventaAnterior.PtoVta,
        Nro: ventaAnterior.CbteHasta,
      },
    ],
    Concepto: 1,
    DocTipo: venta.cod_doc,
    DocNro: venta.dnicuit,
    CbteDesde: ultimoElectronica + 1,
    CbteHasta: ultimoElectronica + 1,
    CbteFch: parseInt(fecha.replace(/-/g, "")),
    ImpTotal: venta.precioFinal,
    ImpTotConc: 0,
    ImpNeto: (totalNeto105 + totalNeto21).toFixed(2),
    ImpOpEx: 0,
    ImpIVA: (totalIva21 + totalIva105).toFixed(2), //Importe total de IVA
    ImpTrib: 0,
    MonId: "PES",
    PtoVta: 5,
    MonCotiz: 1,
    Iva: [],
  };

  if (totalNeto105 != 0) {
    data.Iva.push({
      Id: 4, // Id del tipo de IVA (4 para 10.5%)
      BaseImp: totalNeto105.toFixed(2), // Base imponible
      Importe: totalIva105.toFixed(2), // Importe
    });
  }
  if (totalNeto21 != 0) {
    data.Iva.push({
      Id: 5, // Id del tipo de IVA (5 para 21%)
      BaseImp: totalNeto21.toFixed(2), // Base imponible
      Importe: totalIva21.toFixed(2), // Importe
    });
  }

  const res = await afip.ElectronicBilling.createVoucher(data); //creamos la factura electronica
  alerta.children[1].innerHTML = "Nota de Credito Afip Aceptada";
  const qr = {
    ver: 1,
    fecha: fecha,
    cuit: 27165767433,
    ptoVta: 5,
    tipoCmp: venta.cod_comp,
    nroCmp: ultimoElectronica,
    importe: data.ImpTotal,
    moneda: "PES",
    ctz: 1,
    tipoDocRec: data.DocTipo,
    nroDocRec: parseInt(data.DocNro),
    tipoCodAut: "E",
    codAut: parseFloat(res.CAE),
  };
  const textoQR = btoa(JSON.stringify(qr)); //codificamos lo que va en el QR
  const QR = await generarQR(textoQR, res.CAE, res.CAEFchVto);
  return {
    QR,
    cae: res.CAE,
    vencimientoCae: res.CAEFchVto,
    texto: textoQR,
    numero: ultimoElectronica + 1,
  };
};

//Sumamos el saldo al cluente si la venta  es Cuenta Corriente
const sumarSaldo = async (precio, id) => {
  const cliente = (await axios.get(`${URL}clientes/id/${id}`, configAxios))
    .data;
  saldoNuevo = parseFloat(cliente.saldo) - parseFloat(precio);
  cliente.saldo = saldoNuevo.toFixed(2);
  await axios.put(`${URL}clientes/${id}`, cliente, configAxios);
};

//ver si hay un descuento
function verDescuento() {
  let Total = 0;
  Total = totalPrecioProductos;
  descuentoN.value = ((parseFloat(descuento.value) * Total) / 100).toFixed(2);
  total.value = (Total - parseFloat(descuentoN.value)).toFixed(2);
}

const verTipoPago = async () => {
  let a = "NINGUNO";
  await radios.forEach(async (e) => {
    a = (await e.checked) ? e.value : a;
  });
  return a;
};

//Trae el numero de comrpobante dependiendo de si es nota de credito A o B
const traerNumeroComprobante = async (codigo) => {
  let retornar;
  const tipo = codigo === "008" ? "Ultima N Credito B" : "Ultima N Credito A";
  let numeros = (await axios.get(`${URL}tipoVenta`, configAxios)).data;
  retornar = `${numeros[tipo]}`;
  return retornar;
};

codigoC.addEventListener("keypress", async (e) => {
  if (e.key === "Enter") {
    if (codigoC.value !== "") {
      let cliente = (
        await axios.get(
          `${URL}clientes/id/${codigoC.value.toUpperCase()}`,
          configAxios
        )
      ).data;
      if (cliente === "") {
        await sweet.fire({ title: "Cliente no encontrado" });
        codigoC.value = "";
      } else {
        ponerInputsClientes(cliente);
        codigoC.value === "9999"
          ? buscarCliente.focus()
          : observaciones.focus();
      }
    } else {
      ipcRenderer.send("abrir-ventana", "clientes");
      codigoC.value === "9999" ? buscarCliente.focus() : observaciones.focus();
    }
  }
});

ipcRenderer.on("mando-el-cliente", async (e, args) => {
  cliente = (await axios.get(`${URL}clientes/id/${args}`, configAxios)).data;
  ponerInputsClientes(cliente);
});

observaciones.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    codigo.focus();
  }
});

//Cuando buscamos un producto
codigo.addEventListener("keypress", async (e) => {
  if (
    (codigo.value.length === 3 || codigo.value.length === 7) &&
    e.key != "Backspace" &&
    e.key !== "-" &&
    e.key !== "Enter"
  ) {
    codigo.value = codigo.value + "-";
  }
  if (e.key === "Enter") {
    if (!divNuevaCantidad.classList.contains("none")) {
      divNuevaCantidad.classList.add("none");
      divNuevoPrecio.classList.add("none");
      agregarIva.classList.add("none");
    }

    if (e.target.value === "999-999") {
      descripcionAgregar.classList.remove("none");
      agregarIva.classList.remove("none");
      precioAgregar.classList.remove("none");
      descripcionAgregar.children[0].focus();
    } else if (e.target.value !== "") {
      let producto = (
        await axios.get(`${URL}productos/${e.target.value}`, configAxios)
      ).data;
      if (producto.length === 0) {
        await sweet.fire({ title: "No existe ese Producto" });
        codigo.value = "";
      } else {
        sweet
          .fire({
            title: "Cantidad",
            input: "text",
            showCancelButton: true,
            confirmButtonText: "Aceptar",
          })
          .then(async ({ isConfirmed, value }) => {
            if (isConfirmed && value !== "") {
              parseFloat(producto.stock) === 0 &&
                (await sweet.fire({ title: "Producto con stock en 0" }));
              parseFloat(producto.precio_venta) === 0 &&
                (await sweet.fire({ title: "Producto con precio en 0" }));
              if (
                !Number.isInteger(parseFloat(value)) &&
                producto.unidad === "U"
              ) {
                await sweet.fire({
                  title: "La cantidad de este producto no puede ser en decimal",
                });
              } else {
                await mostrarVentas(producto, value);
                e.target.value = "";
                codigo.focus();
              }
            }
          });
      }
    } else {
      ipcRenderer.send("abrir-ventana", "productos");
    }
  }
});

descripcionAgregar.children[0].addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    agregarIva.children[0].focus();
  }
});

agregarIva.children[0].addEventListener("keypress", (e) => {
  e.preventDefault();
  if (e.key === "Enter") {
    if (precioAgregar.classList.contains("none")) {
      divNuevoPrecio.children[0].focus();
    } else {
      precioAgregar.children[0].focus();
    }
  }
});

precioAgregar.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && codigo.value !== "888-888") {
    const product = {
      descripcion: descripcionAgregar.children[0].value.toUpperCase(),
      precio_venta: parseFloat(precioAgregar.children[0].value),
      _id: codigo.value,
      marca: "",
      unidad: "",
      iva: agregarIva.children[0].value,
    };
    sweet
      .fire({
        input: "text",
        title: "Cantidad",
        showCancelButton: true,
        confirmButtonText: "Aceptar",
      })
      .then(async ({ isConfirmed, value }) => {
        if (isConfirmed && value !== "") {
          if (value !== "" && parseFloat(value) !== 0) {
            await mostrarVentas(product, parseFloat(value));
          }
          codigo.value = await "";
          codigo.focus();
          precioAgregar.children[0].value = await "";
          precioAgregar.classList.add("none");
          agregarIva.classList.add("none");
          agregarIva.children[0].value = "N";
          descripcionAgregar.children[0].value = await "";
          descripcionAgregar.classList.add("none");
        }
      });
  }
});

ipcRenderer.on("mando-el-producto", async (e, args) => {
  const { id, cantidad } = JSON.parse(args);
  const producto = (await axios.get(`${URL}productos/${id}`, configAxios)).data;
  await mostrarVentas(producto, cantidad);
});

cobrado.addEventListener("blur", (e) => {
  if (cobrado.value !== "") {
    inputCobrado(cobrado.value);
  }
});

//cuando apretramos enter en el cobrado o le sacamos focos
cobrado.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    contado.focus();
  }
});

factura.addEventListener("click", async (e) => {
  e.preventDefault();
  alerta.classList.remove("none");
  try {
    const venta = {};
    venta.tipo_pago = await verTipoPago();
    if (codigoC.value === "") {
      await sweet.fire({
        title: "Poner codigo de cliente ",
        returnFocus: false,
      });
    } else if (facturaOriginal.value === "") {
      await sweet.fire({
        title: "No se escribio el numero de la factura Original",
        returnFocus: false,
      });
      facturaOriginal.focus();
    } else if (listaProductos.length === 0) {
      await sweet.fire({ title: "No se cargo productos", returnFocus: false });
      codigo.focus();
    } else if (await verProductoConCero(listaProductos)) {
      await sweet.fire({
        title: "Hay productos sin precio",
        returnFocus: false,
      });
    } else if (venta.tipo_pago === "NINGUNO") {
      await sweet.fire({ title: "Elegir tipo de pago" });
    } else {
      venta.productos = listaProductos;
      venta.fecha = new Date();

      venta.tipo_comp = "Nota Credito";
      venta.descuento = descuentoN.value;
      venta.cod_comp = verCodComp(venta.tipo_comp, conIva.value);

      //cliente
      venta.cliente = codigoC.value;
      venta.nombreCliente = buscarCliente.value;
      venta.dnicuit = dnicuit.value;
      venta.cod_doc = venta.dnicuit.length > 8 ? 80 : 96;
      venta.direccion = direccion.value;
      venta.localidad = localidad.value;

      venta.cod_doc = venta.dnicuit === "00000000" ? 99 : venta.cod_doc;
      venta.condIva = conIva.value;
      venta.numeroAsociado = facturaOriginal.value;

      venta.descuento = parseFloat(descuentoN.value);
      venta.precioFinal = parseFloat(total.value);

      //Informacion Adicional
      venta.observaciones = observaciones.value;
      venta.vendedor = vendedor;
      venta.empresa = empresa;

      if (
        venta.precioFinal > 37070 &&
        (buscarCliente.value === "A CONSUMIDOR FINAL" ||
          dnicuit.value === "00000000")
      ) {
        await sweet.fire({
          title: "Factura mayor a 37070, poner valores clientes",
        });
      } else {
        //modifcamos el precio del producto correspondiente con el descuenta
        for (let producto of venta.productos) {
          if (parseFloat(descuentoN.value) !== 0 && descuentoN.value !== "") {
            producto.objeto.precio_venta =
              parseFloat(producto.objeto.precio_venta) -
              (parseFloat(producto.objeto.precio_venta) *
                parseFloat(descuento.value)) /
              100;
            producto.objeto.precio_venta =
              producto.objeto.precio_venta.toFixed(2);
          }
        }
        const [iva21, iva105, gravado21, gravado105, cant_iva] = gravadoMasIva(
          venta.productos
        );
        venta.iva21 = iva21;
        venta.iva105 = iva105;
        venta.gravado21 = gravado21;
        venta.gravado105 = gravado105;
        venta.cant_iva = cant_iva;

        //Traemos la venta relacionada con la nota de credito
        const tipo = (conIva.value === "Inscripto" || conIva.value === "Monotributista") ? "Factura A" : "Factura B";

        let ventaRelacionada = (await axios.get(`${URL}ventas/factura/${venta.numeroAsociado}/${tipo}/${venta.condIva}`)).data;
        //subimos a la afip la factura electronica
        let afip = await subirAAfip(venta, ventaRelacionada);

        venta.qr = afip.QR;
        venta.cae = afip.cae;
        venta.vencimientoCae = afip.vencimientoCae;

        venta.nro_comp = `0005-${afip.numero.toString().padStart(8, "0")}`;
        await actualizarNroCom(venta.nro_comp, venta.cod_comp);

        //mandamos para que sea compensada
        venta.tipo_pago === "CC" &&
          (await ponerEnCuentaCorrienteCompensada(venta, true));
        //Mandamos par que sea historica
        venta.tipo_pago === "CC" &&
          (await ponerEnCuentaCorrienteHistorica(venta, true, saldo.value));
        //abrimos para poner si es trajeta o cheque
        venta.tipo_pago === "CD" && (await verTipoPago());

        //mandamos la venta
        nuevaVenta = await axios.post(`${URL}ventas`, venta, configAxios);

        //mandamos el movimiento de caja
        venta.tipo_pago === "CD" &&
          (await generarMovimientoCaja(
            venta.fecha,
            "I",
            venta.nro_comp,
            venta.cod_comp === 3 ? "Nota Credito A" : "Nota Credito B",
            venta.cod_comp === 3 ? "NTA" : "NTB",
            redondear(venta.precioFinal * -1, 2),
            venta.nombreCliente,
            venta.cliente,
            venta.nombreCliente,
            venta.vendedor,
            maquina
          ));

        //Imprimos el ticket
        ipcRenderer.send("imprimir-venta", [venta, afip, true, 1, "Ticket Factura"]);

        //Si la venta no es Presupuesto Presupuesto descontamos el stock y hacemos movimiento de producto
        if (venta.tipo_pago !== "PP") {
          //Si la venta es CC le sumamos el saldo
          venta.tipo_pago === "CC" &&
            sumarSaldo(venta.precioFinal, venta.cliente);
          //movimiento de producto y stock
          for await (let producto of venta.productos) {
            await agregarStock(producto.objeto._id, producto.cantidad);
            await movimientoProducto(producto.objeto, producto.cantidad, venta);
          }

          await axios.put(`${URL}productos`, arregloProductosDescontarStock);
          await axios.post(`${URL}movProductos`,arregloMovimiento);

          arregloMovimiento = [];
          arregloProductosDescontarStock = [];
        }
        //creamos el pdf
        alerta.children[1].innerHTML = "Guardando nota de credito como pdf";
        await axios.post(`${URL}crearPdf`, [venta, cliente, afip]);
        //reiniciamos la pagina
        location.href = "../index.html";
      }
    }
  } catch (error) {
    console.error(error);
  } finally {
    alerta.classList.add("none");
  }
});

cancelar.addEventListener("click", async (e) => {
  sweet
    .fire({
      title: "Cancelar Nota Credito",
      showCancelButton: true,
      confirmButtonText: "Aceptar",
    })
    .then(({ isConfirmed }) => {
      if (isConfirmed) {
        window.location = "../index.html";
      }
    });
});

resultado.addEventListener("click", (e) => {
  seleccionado && seleccionado.classList.remove("seleccionado");
  subSeleccionado && subSeleccionado.classList.remove("subSeleccionado");

  seleccionado = e.target.parentNode;
  subSeleccionado = e.target;

  seleccionado.classList.add("seleccionado");
  subSeleccionado.classList.add("subSeleccionado");

  if (seleccionado) {
    divNuevaCantidad.classList.remove("none");
    agregarIva.classList.remove("none");
    divNuevoPrecio.classList.remove("none");
    borrarProducto.classList.remove("none");
    agregarIva.children[0].value =
      seleccionado.children[3].innerHTML === "10.50" ? "R" : "N";
  }
});

//modificamos la cantidad del producto
divNuevaCantidad.children[0].addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    agregarIva.children[0].focus();
  }
});

divNuevoPrecio.children[0].addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    let nuevoTotal = parseFloat(total.value);

    const producto = listaProductos.find(
      ({ objeto, cantidad }) => objeto.identificadorTabla === seleccionado.id
    );
    if (producto.objeto.oferta) {
      nuevoTotal -=
        parseFloat(producto.cantidad) *
        parseFloat(producto.objeto.precioOferta);
    } else {
      nuevoTotal -=
        parseFloat(producto.cantidad) *
        parseFloat(producto.objeto.precio_venta);
    }

    //Cambiamos los valores de los productos
    producto.cantidad =
      divNuevaCantidad.children[0].value !== ""
        ? divNuevaCantidad.children[0].value
        : producto.cantidad;
    producto.objeto.precio_venta =
      divNuevoPrecio.children[0].value !== ""
        ? divNuevoPrecio.children[0].value
        : producto.objeto.precio_venta;
    producto.objeto.precioOferta =
      divNuevoPrecio.children[0].value !== ""
        ? divNuevoPrecio.children[0].value
        : producto.objeto.precioOferta;
    producto.objeto.iva = agregarIva.children[0].value;

    //Ponemos en el tr del tbody los valores
    const tr = document.getElementById(`${seleccionado.id}`);
    tr.children[0].innerHTML = parseFloat(producto.cantidad).toFixed(2);
    tr.children[3].innerHTML = producto.objeto.iva === "R" ? "10.50%" : "21.00";
    tr.children[4].innerHTML = parseFloat(producto.objeto.precio_venta).toFixed(
      2
    );
    tr.children[5].innerHTML = (
      parseFloat(producto.cantidad) * parseFloat(producto.objeto.precio_venta)
    ).toFixed(2);

    nuevoTotal +=
      parseFloat(producto.cantidad) * parseFloat(producto.objeto.precio_venta);
    totalPrecioProductos = nuevoTotal;
    total.value = nuevoTotal.toFixed(2);

    divNuevaCantidad.classList.add("none");
    divNuevoPrecio.classList.add("none");
    agregarIva.classList.add("none");
    divNuevoPrecio.children[0].value = "";
    divNuevaCantidad.children[0].value = "";
    agregarIva.children[0].value = "N";
    codigo.focus();
  }
});

//lo usamos para borrar un producto de la tabla
borrarProducto.addEventListener("click", (e) => {
  if (seleccionado) {
    divNuevaCantidad.classList.add("none");
    divNuevoPrecio.classList.add("none");
    producto = listaProductos.find(
      (e) => e.objeto.identificadorTabla === seleccionado.id
    );
    total.value = (
      parseFloat(total.value) -
      parseFloat(producto.cantidad) * parseFloat(producto.objeto.precio_venta)
    ).toFixed(2);
    listaProductos.forEach((e) => {
      if (seleccionado.id === e.objeto.identificadorTabla) {
        listaProductos = listaProductos.filter(
          (e) => e.objeto.identificadorTabla !== seleccionado.id
        );
      }
    });
    const a = seleccionado;
    a.parentNode.removeChild(a);
  }
  let nuevoTotal = 0;
  listaProductos.forEach(({ objeto, cantidad }) => {
    nuevoTotal += objeto.precio_venta * cantidad;
  });
  total.value = (
    nuevoTotal -
    (nuevoTotal * parseFloat(descuento.value)) / 100
  ).toFixed(2);
  totalPrecioProductos = parseFloat(total.value);
  descuentoN.value = ((nuevoTotal * parseFloat(descuento.value)) / 100).toFixed(
    2
  );
  codigo.focus();
});

buscarCliente.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    telefono.focus();
  }
});

telefono.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    direccion.focus();
  }
});

direccion.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    localidad.focus();
  }
});

localidad.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    provincia.focus();
  }
});

provincia.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    conIva.focus();
  }
});

conIva.addEventListener("keypress", (e) => {
  e.preventDefault();
  if (e.key === "Enter") {
    dnicuit.focus();
  }
});

dnicuit.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    observaciones.focus();
  }
});

dnicuit.addEventListener("blur", async (e) => {
  if (dnicuit.value.length !== 8 && dnicuit.value.length !== 11) {
    await sweet
      .fire({
        title: "Cadena DNI o CUIT Erronea",
      })
      .then(() => {
        dnicuit.focus();
      });
  }
});

descuento.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    facturaOriginal.focus();
  }
});

descuento.addEventListener("blur", (e) => {
  verDescuento();
});

telefono.addEventListener("focus", (e) => {
  telefono.select();
});

buscarCliente.addEventListener("focus", (e) => {
  buscarCliente.select();
});

localidad.addEventListener("focus", (e) => {
  localidad.select();
});

provincia.addEventListener("focus", (e) => {
  provincia.select();
});

direccion.addEventListener("focus", (e) => {
  direccion.select();
});

dnicuit.addEventListener("focus", (e) => {
  dnicuit.select();
});
