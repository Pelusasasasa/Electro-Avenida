require('dotenv').config();
const URL = process.env.URL;
const axios = require('axios');

const desde = document.getElementById('desde');
const hasta = document.getElementById('hasta');

let movs = [];

const getMovs = async () => {
  movs = (await axios.get(`${URL}movProductos/forDate/${desde.value}/${hasta.value}`)).data;
  listarMovs(movs);
};

const listarMovs = async () => {
  const tbody = document.getElementById('tbody');

  for (let elem of movs) {
    const tr = document.createElement('tr');
    tr.id = elem._id;

    const tdCodigo = document.createElement('td');
    const tdDecripcion = document.createElement('td');
    const tdTipoComp = document.createElement('td');
    const tdNumero = document.createElement('td');
    const tdEgreso = document.createElement('td');
    const tdIngreso = document.createElement('td');
    const tdStock = document.createElement('td');

    tdCodigo.innerText = elem.codProd;
    tdDecripcion.innerText = elem.descripcion;
    tdTipoComp.innerText = elem.tipo_comp;
    tdNumero.innerText = elem.nro_comp;
    tdEgreso.innerText = elem?.egreso.toFixed(2);
    tdIngreso.innerText = elem?.ingreso.toFixed(2);
    tdStock.innerText = elem?.stock.toFixed(2);

    tr.appendChild(tdCodigo);
    tr.appendChild(tdDecripcion);
    tr.appendChild(tdNumero);
    tr.appendChild(tdTipoComp);
    tr.appendChild(tdEgreso);
    tr.appendChild(tdIngreso);
    tr.appendChild(tdStock);

    tbody.appendChild(tr);
  }
};

window.addEventListener('load', async (e) => {
  desde.value = new Date().toISOString().slice(0, 10);
  hasta.value = new Date().toISOString().slice(0, 10);
  desde.focus();

  getMovs();
});

desde.addEventListener('keypress', (e) => {
  if (e.keyCode === 13) {
    hasta.focus();
  }
});

hasta.addEventListener('keypress', (e) => {
  if (e.keyCode === 13) {
    getMovs();
  }
});
