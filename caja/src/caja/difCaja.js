const  axios  = require('axios');
require('dotenv').config;
const URL = process.env.URL;

const sweet = require('sweetalert2');
const { redondear, cerrarVentana } = require('../assets/js/globales');

const tbody = document.querySelector('tbody');

const agregar = document.getElementById('agregar');
const salir = document.getElementById('salir');

let diferencias;
let seleccionado = "";
let subSeleccionado = "";

window.addEventListener('load',listarDirefencias);
window.addEventListener('load',cerrarVentana)

agregar.addEventListener('click',agregarDiferencia);

tbody.addEventListener('dblclick',modificarDiferencia);

async function listarDirefencias (){
    diferencias = (await axios.get(`${URL}difCaja`)).data;
    for(let elem of diferencias){
        listarElmento(elem);
    }
};

function listarElmento(elem){
        const tr = document.createElement('tr');
        tr.id = elem._id;

        const fecha = elem.fecha.slice(0,10).split('-',3);

        const tdFecha = document.createElement('td');
        const tdHora = document.createElement('td');
        const tdImporte = document.createElement('td');
        const tdDiferencia = document.createElement('td');
        const tdAcciones = document.createElement('td');

        tdFecha.innerText = `${fecha[2]}/${fecha[1]}/${fecha[0]}`;
        tdHora.innerText = elem.hora;
        tdImporte.innerText = elem.importe.toFixed(2);
        tdDiferencia.innerText = elem.diferencia.toFixed(2);

        tr.appendChild(tdFecha);
        tr.appendChild(tdHora);
        tr.appendChild(tdImporte);
        tr.appendChild(tdDiferencia);

        tbody.appendChild(tr);
}

async function agregarDiferencia(e){
    const agregar = await sweet.fire({
        title:"Agregar Diferencia",
        html:`
        <section class="agregar">
            <main>
                <label htmlFor="date">Fecha</label>
                <input autofocus type="date" name="date" id="date" />
            </main>
            <main>
                <label htmlFor="hora">Hora</label>
                <input type="text" name="hora" id="hora" />
            </main>
            <main>
                <label htmlFor="importe">Importe</label>
                <input type="number" name="importe" id="importe" />
            </main>
        </section>
        `,
        confirmButtonText:"Agrergar",
        showCancelButton:true
    });

    if (agregar.isConfirmed) {
        const difCaja = {};
        let aux;

        if(tbody.lastElementChild){
            aux = parseFloat(tbody.lastElementChild.children[2].innerText);
        }else{
            aux = 0;
        };

        difCaja.fecha = document.getElementById('date').value;
        difCaja.hora = document.getElementById('hora').value;
        difCaja.importe = parseFloat(document.getElementById('importe').value);
        difCaja.diferencia = redondear(difCaja.importe - aux,2);

        await axios.post(`${URL}difCaja`,difCaja);
        listarElmento(difCaja)
        
    }
};

async function modificarDiferencia(e){
    seleccionado && seleccionado.classList.remove('seleccionado');
    subSeleccionado && subSeleccionado.classList.remove('subSeleccionado');

    seleccionado = e.target.parentNode;
    subSeleccionado = e.target;

    seleccionado.classList.add('seleccionado');
    subSeleccionado.classList.add('subSeleccionado');
    const fecha = seleccionado.children[0].innerText.split('/',3);
    const valueFecha = `${fecha[2]}-${fecha[1]}-${fecha[0]}`;
    const modificar = await sweet.fire({
        title:"Modificar diferencia",html:`
        <section class="agregar">
            <main>
                <label htmlFor="date">Fecha</label>
                <input autofocus type="date" value=${valueFecha} name="date" id="date" />
            </main>
            <main>
                <label htmlFor="hora">Hora</label>
                <input value=${seleccionado.children[1].innerText} type="text" name="hora" id="hora" />
            </main>
            <main>
                <label htmlFor="importe">Importe</label>
                <input value=${seleccionado.children[2].innerText} type="number" name="importe" id="importe" />
            </main>
        </section>
        `,
        confirmButtonText:"Modificar",
        showCancelButton:true
    });

    if (modificar.isConfirmed) {
        const difCaja = (await axios.get(`${URL}difCaja/id/${seleccionado.id}`)).data;
        const aux = JSON.parse(difCaja.importe)
        
        const fecha = document.getElementById('date').value
        const hora = document.getElementById('hora').value;
        const importe = parseFloat(document.getElementById('importe').value);
        
        difCaja.fecha = fecha;
        difCaja.hora = hora;
        difCaja.importe = importe;
        difCaja.diferencia = - difCaja.importe + difCaja.diferencia + aux;

        await axios.put(`${URL}difCaja/id/${difCaja._id}`,difCaja);
    };
}