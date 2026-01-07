const { ipcRenderer } = require('electron');
require('dotenv').config();
const URL = process.env.URL;
const axios = require('axios');
const { cerrarVentana, configAxios } = require('../funciones');

const select = document.querySelector('#marcas');
const imprimir = document.querySelector('#imprimir');
const tbody = document.querySelector('tbody');

window.addEventListener('load', async (e) => {
  cerrarVentana();
  const marcas = (await axios.get(`${URL}productos`, configAxios)).data;
  marcas.sort((a, b) => {
    if (a > b) {
      return 1;
    } else if (a < b) {
      return -1;
    }
    return 0;
  });
  for await (let marca of marcas) {
    const option = document.createElement('option');
    option.value = marca;
    option.text = marca;
    select.appendChild(option);
  }
});

select.addEventListener('keyup', async (e) => {
  tbody.innerHTML = '';
  listar();
});

select.addEventListener('click', async (e) => {
  tbody.innerHTML = '';
  if (e.target.value !== '') {
    listar();
  }
});

const listar = async () => {
  const productos = (await axios.get(`${URL}productos/buscarProducto/${select.value}/marca`, configAxios)).data;
  for await (let { descripcion, cod_fabrica, _id, stock, precio_venta, observacion } of productos) {
    tbody.innerHTML += `
            <tr>
                <td>${_id}</td>
                <td>${descripcion}</td>
                <td class=text-end>${parseFloat(stock).toFixed(2)}</td>
                <td class=text-end>$${precio_venta}</td>
                <td>${cod_fabrica}</td>
                <td>${observacion.slice(0, 13)}</td>

            </tr>
        `;
  }
};

imprimir.addEventListener('click', async (e) => {
  select.parentNode.parentNode.classList.add('none');
  tbody.parentNode.parentNode.style.overflow = 'visible';
  tbody.parentNode.children[0].classList.add('none');
  window.print();
});
