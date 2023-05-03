const axios = require('axios');
require('dotenv');
const URL = process.env.URL;

const desde = document.getElementById('desde');
const hasta = document.getElementById('hasta');

const tbody = document.querySelector('tbody');
const detallesProducto = document.querySelector('.detallesProducto');

window.addEventListener('load',async e=>{
    const hoy = new Date();
    const fechaArgentina = new Date(hoy.getTime() - hoy.getTimezoneOffset() * 60000).toISOString();
    desde.value = fechaArgentina.slice(0,10);
    hasta.value = fechaArgentina.slice(0,10);
    const prestamos = (await axios.get(`${URL}prestamos/betweenDates/${desde.value}/${hasta.value}`)).data;
    listarPrestamos(prestamos);
});

desde.addEventListener('keypress',traerPrestamos);
hasta.addEventListener('keypress',traerPrestamos);

tbody.addEventListener('click',mostrarDetalleProducto);

async function traerPrestamos(e) {
    if (e.keyCode === 13) {
        const prestamos = (await axios.get(`${URL}prestamos/betweenDates/${desde.value}/${hasta.value}`)).data;
        listarPrestamos(prestamos);

        if (e.target.id === "desde") {
            hasta.focus();
        }
    }
};

async function listarPrestamos(lista) {
    for(let elem of lista){
        console.log(elem)
        const tr = document.createElement('tr');

        const fecha = elem.fecha.slice(0,10).split('-',3);

        const tdFecha = document.createElement('td');
        const tdCodigo = document.createElement('td');
        const tdCliente = document.createElement('td');
        const tdNroComp = document.createElement('td');

        tdFecha.innerText = `${fecha[2]}/${fecha[1]}/${fecha[0]}`;
        tdCodigo.innerText = elem.codigo;
        tdCliente.innerText = elem.cliente;
        tdNroComp.innerText = elem.nro_comp;

        tr.appendChild(tdFecha);
        tr.appendChild(tdCodigo);
        tr.appendChild(tdCliente);
        tr.appendChild(tdNroComp);

        tbody.appendChild(tr);

        
    }
};

async function mostrarDetalleProducto(e){
    detallesProducto.classList.remove('none')
}