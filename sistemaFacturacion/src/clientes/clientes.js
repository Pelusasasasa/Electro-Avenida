const { ipcRenderer } = require('electron');

const axios = require('axios');
require('dotenv').config;
const URL = process.env.URL;

const sweet = require('sweetalert2');
const { copiar, recorrerFlechas, configAxios, verNombrePc } = require('../funciones');

function getParameterByName(name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
    results = regex.exec(location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

const acceso = getParameterByName('acceso');
const vendedor = getParameterByName('vendedor');

const buscarCliente = document.querySelector('#buscarCliente');
const resultado = document.querySelector('#resultado');

const modificar = document.querySelector('.modificar');
const eliminar = document.querySelector('.eliminar');

const salir = document.querySelector('.salir');

acceso !== '0' && eliminar.classList.add('none');

let clientes;
let seleccionado;
let subSeleccionado;

window.addEventListener('load', (e) => {
  filtrar();
  copiar();
});

const ponerClientes = (clientes) => {
  //ordenamos los clientes por nombre
  clientes.sort((a, b) => {
    if (a.cliente < b.cliente) {
      return -1;
    }
    if (a.cliente > b.cliente) {
      return 1;
    }
    return 0;
  });

  let delay = 0;
  for (let cliente of clientes) {
    let nombre = cliente.cliente.toLowerCase();
    texto = texto[0] === '*' ? texto.substr(1) : texto;
    const tr = document.createElement('tr');
    tr.id = cliente._id;
    tr.style.opacity = '0';
    tr.style.transform = 'translateY(10px)';
    tr.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';

    const tdCodigo = document.createElement('td');
    tdCodigo.className = 'mono';
    tdCodigo.style.color = '#1a6e31';  /* Dark green — high contrast on white */
    tdCodigo.style.fontWeight = '700';

    const tdNombre = document.createElement('td');
    tdNombre.style.fontWeight = '700';

    const tdLocalidad = document.createElement('td');
    const tdDireccion = document.createElement('td');
    const tdTelefono = document.createElement('td');
    const tdCondIva = document.createElement('td');

    const tdCuit = document.createElement('td');
    tdCuit.className = 'mono';

    const tdSaldo = document.createElement('td');
    tdSaldo.style.textAlign = 'right';
    tdSaldo.style.fontWeight = '800';
    tdSaldo.style.fontSize = '1.4rem';  /* Extra large for money amount */
    tdSaldo.style.color = '#1a4e2f';    /* Very dark green — excellent contrast */
    tdSaldo.style.letterSpacing = '0.02em';

    const tdAcciones = document.createElement('td');
    tdAcciones.className = 'action-cell';

    const btnEdit = document.createElement('button');
    btnEdit.className = 'action-btn edit';
    btnEdit.innerHTML = '✏️';
    btnEdit.title = 'Modificar';
    btnEdit.onclick = (e) => {
      e.stopPropagation();
      modificarCliente()
    };

    const btnDelete = document.createElement('button');
    btnDelete.className = 'action-btn delete';
    btnDelete.innerHTML = '🗑️';
    btnDelete.title = 'Eliminar';
    btnDelete.onclick = (e) => {
      e.stopPropagation();
      eliminarCliente()
    };

    tdAcciones.appendChild(btnEdit);
    tdAcciones.appendChild(btnDelete);

    tdCodigo.innerHTML = cliente._id;
    tdNombre.innerHTML = cliente.cliente;
    tdLocalidad.innerHTML = cliente.localidad;
    tdDireccion.innerHTML = cliente.direccion;
    tdTelefono.innerHTML = cliente.telefono;
    tdCondIva.innerHTML = cliente.cond_iva;
    tdCuit.innerHTML = cliente.cuit;
    tdSaldo.innerHTML = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(cliente.saldo);

    tr.appendChild(tdCodigo);
    tr.appendChild(tdNombre);
    tr.appendChild(tdLocalidad);
    tr.appendChild(tdDireccion);
    tr.appendChild(tdTelefono);
    tr.appendChild(tdCondIva);
    tr.appendChild(tdCuit);
    tr.appendChild(tdSaldo);
    tr.appendChild(tdAcciones);

    resultado.appendChild(tr);

    setTimeout(() => {
      tr.style.opacity = '1';
      tr.style.transform = 'translateY(0)';
    }, delay);
    delay += 30;
  }

  seleccionado = resultado.firstElementChild;
  seleccionado.classList.add('seleccionado');

  subSeleccionado = seleccionado.children[0];
  subSeleccionado.classList.add('subSeleccionado');
};

//compramaos si en el input de buscar el texto que escribimos es igual al nombre de algun cliente
const filtrar = async () => {
  resultado.innerHTML = '';
  texto = buscarCliente.value.toLowerCase();
  texto = texto === '' ? 'a consumidor final' : texto;
  let clientes = await axios.get(`${URL}clientes/${texto}`, configAxios);
  clientes = clientes.data;
  ponerClientes(clientes);
};

buscarCliente.addEventListener('keyup', (e) => {
  if (e.keyCode === 40) {
    resultado.focus();
    buscarCliente.blur();
  } else {
    filtrar();
  }
});

resultado.addEventListener('click', (e) => {
  seleccionado = document.querySelector('.seleccionado');
  subSeleccionado = document.querySelector('.subSeleccionado');

  seleccionado && seleccionado.classList.remove('seleccionado');
  subSeleccionado && subSeleccionado.classList.remove('subSeleccionado');

  if (e.target.nodeName === 'TD' || e.target.nodeName === 'TH') {
    seleccionado = e.target.parentNode;
    subSeleccionado = e.target;
  }

  seleccionado.classList.add('seleccionado');
  subSeleccionado.classList.add('subSeleccionado');
});

const agregar = document.querySelector('.agregar');
agregar.addEventListener('click', (e) => {
  ipcRenderer.send('abrir-ventana-agregar-cliente', vendedor);
});

salir.addEventListener('click', (e) => {
  location.href = '../index.html';
});

document.addEventListener('keyup', async (e) => {
  if (e.key === 'Escape') {
    location.href = '../index.html';
  }
  subSeleccionado = await recorrerFlechas(e);
  seleccionado = subSeleccionado && subSeleccionado.parentNode;
  subSeleccionado &&
    subSeleccionado.scrollIntoView({
      block: 'center',
      inline: 'center',
      behavior: 'smooth',
    });
});


const eliminarCliente = async() => {
  const clienteEliminar = document.querySelector('.seleccionado');
  if (clienteEliminar) {
    const cliente = clienteEliminar.children[1].innerHTML;
    await sweet
      .fire({
        title: 'Eliminar Cliente ' + cliente,
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
      })
      .then(async ({ isConfirmed }) => {
        if (isConfirmed) {
          await axios.delete(
            `${URL}clientes/${clienteEliminar.id}`,
            {
              data: {
                vendedor,
                maquina: verNombrePc(),
                cliente: seleccionado.children[1].innerText,
              },
            },
            configAxios
          );
          location.reload();
        }
      });
  } else {
    await sweet.fire({
      title: 'Cliente no Seleccionado',
      returnFocus: false,
    });

    buscarCliente.select();
    buscarCliente.focus();
  }
}

const modificarCliente = async() => {
  seleccionado = document.querySelector('.seleccionado');
  if (seleccionado) {
    ipcRenderer.send('abrir-ventana-modificar-cliente', [seleccionado.id, acceso, vendedor]);
  } else {
    await sweet.fire({
      title: 'Cliente no Seleccionado',
      returnFocus: false,
    });
    buscarCliente.focus();
  }
}