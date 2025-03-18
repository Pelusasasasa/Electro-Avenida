function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
  return results === null
    ? ""
    : decodeURIComponent(results[1].replace(/\+/g, " "));
}

const sweet = require("sweetalert2");
const axios = require("axios");
require("dotenv").config;
const URL = process.env.URL;

const {
  copiar,
  recorrerFlechas,
  redondear,
  botonesSalir,
  configAxios,
  verNombrePc,
} = require("../funciones");

const { ipcRenderer } = require("electron");
const { default: Swal } = require("sweetalert2");

const buscador = document.getElementById('buscador');
const filtro = document.getElementById('filtro');

const thead = document.querySelector("thead");
const tbody = document.querySelector("tbody");
const eliminarPedido = document.querySelector(".eliminarPedido");
const eliminarVarios = document.getElementById("eliminarVarios");
const salir = document.querySelector(".salir");

let arreglo;
let arregloAux;
let seleccionado;
let subSeleccionado;
let inputSeleccionado;
let acceso = getParameterByName("acceso");
let vendedor = getParameterByName("vendedor");
let pedidos = [];


const cambiarEstadoPedido = async (nuevoEstado) => {
  const pedidoIdentificado = arregloAux.find(elem => elem._id === seleccionado.id);

  pedidoIdentificado.estadoPedido = nuevoEstado;
  pedidoIdentificado.maquina = verNombrePc();
  pedidoIdentificado.vendedorQueModifico = vendedor;

  try {
    const { data } = await axios.patch(`${URL}pedidos/forId/${pedidoIdentificado._id}`, pedidoIdentificado);

    arregloAux = arregloAux.map(elem => {
      if (elem._id === data._id) {
        return data;
      };
      return elem;
    });

    seleccionado.classList.contains('bg-white') && seleccionado.classList.remove('bg-white');
    seleccionado.classList.contains('bg-green') && seleccionado.classList.remove('bg-green');
    seleccionado.classList.contains('bg-yellow') && seleccionado.classList.remove('bg-yellow');

    nuevoEstado === 0 && seleccionado.classList.add('bg-white');
    nuevoEstado === 1 && seleccionado.classList.add('bg-green');
    nuevoEstado === 2 && seleccionado.classList.add('bg-yellow');

  } catch (error) {
    return await Swal.fire('Error al cambiar estado del pedido', `${error.response?.data.msg}`, 'error');
  }
};

const filtarPedidos = async (e) => {
  if (e.target.value === "") {
    arregloAux = pedidos;
  } else {
    arregloAux = pedidos.filter(pedido => pedido.codigo[filtro.value].includes(e.target.value.toUpperCase()));
  };

  listarPedidos(arregloAux);
};

async function eliminarVariosPedidos() {
  const pedidosAEliminar = document.querySelectorAll(".eliminar");
  await sweet.fire({
    title: "Eliminar Varios pedidos?",
    showCancelButton: true,
    confirmButtonText: "Aceptar",
  }).then(async ({ isConfirmed }) => {
    if (isConfirmed) {
      for await (let elem of pedidosAEliminar) {
        await axios.delete(
          `${URL}pedidos/${elem.id}`,
          {
            data: {
              vendedor,
              maquina: verNombrePc(),
              pedido: elem.children[2].innerText,
            },
          },
        );
        tbody.removeChild(elem);
      }
    }
  });
}

function clickderecho(e) {
  const cordenadas = {
    x: e.clientX,
    y: e.clientY,
    ventana: "VerPedidos",
  };

  ipcRenderer.send("mostrar-menu", cordenadas);

  seleccionado.classList.remove("seleccionado");
  subSeleccionado.classList.remove("subSeleccionado");

  if (e.target.nodeName === "TD") {
    subSeleccionado = e.target;
    seleccionado = e.target.parentNode;
  }

  seleccionado.classList.add("seleccionado");
  subSeleccionado.classList.add("subSeleccionado");
}

const OrdenarPedidos = (e) => {
  if (e.target.parentNode.id === "cliente") {
    if (
      document.getElementById("flechaArribaCliente").classList.contains("none")
    ) {
      document.getElementById("flechaAbajoCliente").classList.add("none");
      document.getElementById("flechaArribaCliente").classList.remove("none");

      arregloAux.sort((a, b) => {
        if (a.cliente > b.cliente) {
          return 1;
        } else if (a.cliente < b.cliente) {
          return -1;
        }
        return 0;
      });
    } else if (
      document.getElementById("flechaAbajoCliente").classList.contains("none")
    ) {
      document.getElementById("flechaAbajoCliente").classList.remove("none");
      document.getElementById("flechaArribaCliente").classList.add("none");

      arregloAux.sort((a, b) => {
        if (a.cliente > b.cliente) {
          return -1;
        } else if (a.cliente < b.cliente) {
          return 1;
        }
        return 0;
      });
    }
  }

  if (e.target.parentNode.id === "provedor") {
    if (
      document.getElementById("flechaArribaProvedor").classList.contains("none")
    ) {
      document.getElementById("flechaAbajoProvedor").classList.add("none");
      document.getElementById("flechaArribaProvedor").classList.remove("none");

      arregloAux.sort((a, b) => {
        if (a.codigo.provedor > b.codigo.provedor) {
          return 1;
        } else if (a.codigo.provedor < b.codigo.provedor) {
          return -1;
        }
        return 0;
      });
    } else if (
      document.getElementById("flechaAbajoProvedor").classList.contains("none")
    ) {
      document.getElementById("flechaAbajoProvedor").classList.remove("none");
      document.getElementById("flechaArribaProvedor").classList.add("none");

      arregloAux.sort((a, b) => {
        if (a.codigo.provedor > b.codigo.provedor) {
          return -1;
        } else if (a.codigo.provedor < b.codigo.provedor) {
          return 1;
        }
        return 0;
      });
    }
  };

  if (e.target.parentNode.id === "marca") {
    if (
      document.getElementById("flechaArribaMarca").classList.contains("none")
    ) {
      document.getElementById("flechaAbajoMarca").classList.add("none");
      document.getElementById("flechaArribaMarca").classList.remove("none");

      console.log(arregloAux)

      arregloAux.sort((a, b) => {
        if (a.codigo.marca > b.codigo.marca) {
          return 1;
        } else if (a.codigo.marca < b.codigo.marca) {
          return -1;
        }
        return 0;
      });
    } else if (
      document.getElementById("flechaAbajoMarca").classList.contains("none")
    ) {
      document.getElementById("flechaAbajoMarca").classList.remove("none");
      document.getElementById("flechaArribaMarca").classList.add("none");

      arregloAux.sort((a, b) => {
        if (a.codigo.marca > b.codigo.marca) {
          return -1;
        } else if (a.codigo.marca < b.codigo.marca) {
          return 1;
        }
        return 0;
      });
    }
  }

  tbody.innerHTML = "";
  listarPedidos(arregloAux);
};

const listarPedidos = (pedidos) => {
  tbody.innerHTML = "";

  for (let [index, pedido] of pedidos.entries()) {
    let fecha = new Date(pedido.fecha);

    const tr = document.createElement("tr");

    if (pedido.estadoPedido === 1) tr.classList.add('bg-green');
    if (pedido.estadoPedido === 2) tr.classList.add('bg-yellow');

    tr.id = pedido._id;

    const tdFecha = document.createElement("td");
    const tdCodigo = document.createElement("td");
    const tdProducto = document.createElement("td");
    const tdCantidad = document.createElement("td");
    const tdCliente = document.createElement("td");
    const tdTelefeno = document.createElement("td");
    const tdVendedor = document.createElement("td");
    const tdMarca = document.createElement("td");
    const tdProvedor = document.createElement("td");
    const tdStock = document.createElement("td");
    const tdObservacion = document.createElement("td");

    //clases
    tdCantidad.classList.add("cantidad");
    tdStock.classList.add("stock");

    //Desestructuramos el producto que viene con el pedido
    const { _id, descripcion, marca, stock, provedor } = pedido.codigo ? pedido.codigo : { _id: pedido.codigo, descripcion: '', marca: '', stock: '', provedor: '' };

    //valores
    tdFecha.innerHTML = `${fecha.getUTCDate()}/${fecha.getUTCMonth() + 1}/${fecha.getUTCFullYear()}`;
    tdCodigo.innerHTML = pedido.codigo ? _id : '999-999';
    tdProducto.innerHTML = descripcion ? descripcion : pedido.producto;
    tdCantidad.innerHTML = redondear(pedido.cantidad, 2);
    tdCliente.innerHTML = pedido.cliente;
    tdTelefeno.innerHTML = pedido.telefono;
    tdVendedor.innerHTML = pedido.vendedor;
    tdMarca.innerText = marca;
    tdProvedor.innerText = provedor;
    tdStock.innerHTML = redondear(stock, 2);
    tdObservacion.innerHTML = pedido.observacion;

    tr.appendChild(tdFecha);
    tr.appendChild(tdCodigo);
    tr.appendChild(tdProducto);
    tr.appendChild(tdCantidad);
    tr.appendChild(tdCliente);
    tr.appendChild(tdTelefeno);
    tr.appendChild(tdVendedor);
    tr.appendChild(tdMarca);
    tr.appendChild(tdProvedor);
    tr.appendChild(tdStock);
    tr.appendChild(tdObservacion);

    tbody.appendChild(tr);
  }
  seleccionado = tbody.firstElementChild;
  seleccionado.classList.add("seleccionado");

  subSeleccionado = seleccionado.children[0];
  subSeleccionado.classList.add("subSeleccionado");

  arreglo = pedidos;
};

buscador.addEventListener('keyup', filtarPedidos);

document.addEventListener("contextmenu", clickderecho);

document.addEventListener("keydown", async (e) => {
  if (e.key === "Escape") {
    location.href = "../index.html";
  }
  subSeleccionado = await recorrerFlechas(e);
  seleccionado = subSeleccionado && subSeleccionado.parentNode;
  subSeleccionado &&
    subSeleccionado.scrollIntoView({
      block: "center",
      inline: "center",
      behavior: "smooth",
    });
});

//Eliminar un pedido
eliminarPedido.addEventListener("click", async (e) => {
  seleccionado = document.querySelector(".seleccionado");
  if (seleccionado) {
    await sweet
      .fire({
        title: "Eliminar Pedido",
        showCancelButton: true,
        confirmButtonText: "Aceptar",
      })
      .then(async ({ isConfirmed }) => {
        if (isConfirmed) {
          await axios.delete(
            `${URL}pedidos/${seleccionado.id}`,
            {
              data: {
                vendedor,
                maquina: verNombrePc(),
                pedido: seleccionado.children[2].innerText,
              },
            },
            configAxios
          );
          tbody.removeChild(seleccionado);
          seleccionado = "";
        }
      });
  } else {
    sweet.fire({ title: "Pedido no seleccionado" });
  }
});

//Eliminar Varios Pedidos
eliminarVarios.addEventListener("click", eliminarVariosPedidos);

tbody.addEventListener("click", (e) => {
  seleccionado && seleccionado.classList.remove("seleccionado");
  subSeleccionado && subSeleccionado.classList.remove("subSeleccionado");

  if (e.target.nodeName === "TD") {
    seleccionado = e.target.parentNode;
    subSeleccionado = e.target;
  }

  seleccionado.classList.add("seleccionado");
  subSeleccionado.classList.add("subSeleccionado");

})


tbody.addEventListener("dblclick", async (e) => {
  await sweet
    .fire({
      title: "Cambiar pedido",
      html: `
            <label for="cliente">Cliente</label>
            <input type="text" value="${seleccionado.children[4].innerText}" name="cliente" id="cliente"/>
            <label for="">Numero</label>
            <input type="tel" value="${seleccionado.children[5].innerText}" name="numero" id="numero"/>
        `,
      confirmButtonText: "Aceptar",
      showCancelButton: true,
    })
    .then(async ({ isConfirmed }) => {

      if (isConfirmed) {
        seleccionado.children[4].innerText = document.getElementById("cliente").value.toUpperCase();
        seleccionado.children[5].innerText = document.getElementById("numero").value;

        const pedido = (await axios.get(`${URL}pedidos/${seleccionado.id}`)).data;
        pedido.cliente = seleccionado.children[4].innerText;
        pedido.telefono = seleccionado.children[5].innerText;
        pedido.maquina = verNombrePc();
        pedido.vendedorQueModifico = vendedor;

        await axios.put(`${URL}pedidos/${seleccionado.id}`, pedido);
      }
    });
});

thead.addEventListener("click", OrdenarPedidos);

salir.addEventListener("click", (e) => {
  location.href = "../index.html";
});

//Mandamos a llamar a pedidos
window.addEventListener("load", async (e) => {
  copiar();

  pedidos = (await axios.get(`${URL}pedidos`, configAxios)).data;

  for (let elem of pedidos) {
    if (!elem.codigo) {
      elem.codigo = {};
      elem.codigo._id = '999-999';
      elem.codigo.marca = '';
      elem.codigo.provedor = '';
      elem.codigo.descripcion = '';
      elem.codigo.stock = 0;
    }

    if (elem.codigo._id === '999-999') {
      elem.codigo.marca = '';
      elem.codigo.provedor = '';
      elem.codigo.descripcion = elem.producto;
      elem.codigo.stock = 0;
    }
  }

  arregloAux = pedidos;

  listarPedidos(pedidos);
});

//Nos llega que hicimos un click para seleccionar un pedido a eliminar
ipcRenderer.on("seleccionarParaEliminar", (e) => {
  seleccionado.classList.add("eliminar");
});


//Cuando un pedido pasa al estado de pedido
ipcRenderer.on('seleccionarPedido', async (e) => {

  cambiarEstadoPedido(1);

});

ipcRenderer.on('seleccionarNoPedido', async (e) => {
  cambiarEstadoPedido(0);
});

ipcRenderer.on('seleccionarSinStock', async (e) => {
  console.log(seleccionado);
  cambiarEstadoPedido(2);
});



//Abrimos una modal con input para poder cambiar la observacion de los pedidos
ipcRenderer.on('cambiarObservacion', async () => {
  const { isConfirmed, value } = await sweet.fire({
    title: `Cambiar Observacion del pedido`,
    showCancelButton: true,
    confirmButtonText: "Aceptar",
    input: 'text',
    inputValue: seleccionado.children[10].innerText
  });

  if (isConfirmed) {
    const pedido = (await axios.get(`${URL}pedidos/${seleccionado.id}`)).data;

    pedido.observacion = value.toUpperCase().trim();
    seleccionado.children[10].innerText = value.toUpperCase().trim();

    await axios.put(`${URL}pedidos/${seleccionado.id}`, pedido);
  }
});





