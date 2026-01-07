const axios = require('axios');
require('dotenv').config();
const URL = process.env.URL;

let seleccionado;
let subSeleccionado;

const tbody = document.querySelector('tbody');

const modificar = document.getElementById('modificar');
const exportar = document.getElementById('exportar');
const salir = document.getElementById('salir');

window.addEventListener('load', cargarPagina);
tbody.addEventListener('click', seleccionar);
modificar.addEventListener('click', modificarStock);

async function cargarPagina() {
  const productos = (await axios.get(`${URL}productos/stockCero`)).data;

  for await (let producto of productos) {
    const tr = document.createElement('tr');
    tr.id = producto._id;

    const tdCodigo = document.createElement('td');
    const tdDescripcion = document.createElement('td');
    const tdMarca = document.createElement('td');
    const tdStock = document.createElement('td');

    tdCodigo.innerText = producto._id;
    tdDescripcion.innerText = producto.descripcion;
    tdMarca.innerText = producto.marca;
    tdStock.innerText = parseFloat(producto.stock).toFixed(2);

    tr.appendChild(tdCodigo);
    tr.appendChild(tdDescripcion);
    tr.appendChild(tdMarca);
    tr.appendChild(tdStock);

    tbody.appendChild(tr);
  }
}

async function seleccionar(e) {
  seleccionado && seleccionado.classList.remove('seleccionado');
  subSeleccionado && subSeleccionado.classList.remove('subSeleccionado');

  if (e.target.nodeName === 'TD') {
    seleccionado = e.target.parentElement;
    subSeleccionado = e.target;
  }

  seleccionado.classList.add('seleccionado');
  subSeleccionado.classList.add('subSeleccionado');
}

async function modificarStock() {
  const sweet = require('sweetalert2');
  const { isConfirmed, value } = await sweet.fire({
    title: 'Modificar Stock',
    input: 'number',
    confirmButtonText: 'Modificar',
    showCancelButton: true,
  });

  if (isConfirmed) {
    const producto = (await axios.get(`${URL}productos/${seleccionado.id}`)).data;
    producto.stock = value;
    const res = (await axios.put(`${URL}productos/stockCero`, producto)).data;
    if (res) {
      await sweet.fire({
        icon: 'success',
        title: `Stock modificado de ${res.descripcion} con stock de ${res.stock}`,
      });
      tbody.removeChild(seleccionado);
      seleccionado = '';
    }
  }
}

salir.addEventListener('click', () => {
  window.close();
});
