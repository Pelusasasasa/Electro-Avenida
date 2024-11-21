const  axios  = require('axios');
require('dotenv').config;
const URL = process.env.URL;

const sweet = require('sweetalert2');
const { redondear, cerrarVentana, alerta, configAxios } = require('../assets/js/globales');

const tbody = document.querySelector('tbody');
const tabla = document.querySelector('.tabla');

const agregar = document.getElementById('agregar');
const salir = document.getElementById('salir');

let diferencias;
let seleccionado = "";
let subSeleccionado = "";
let alertaActivo = false;

window.addEventListener('load',listarDirefencias);

agregar.addEventListener('click',agregarDiferencia);

tbody.addEventListener('click',clickTbody);
tbody.addEventListener('dblclick',modificarDiferencia);

document.addEventListener('keyup',accionarTeclado)

async function listarDirefencias (){
    diferencias = (await axios.get(`${URL}difCaja`,configAxios)).data;
    for await(let elem of diferencias){
        listarElmento(elem);
    };
    tabla.scrollTop = (tabla.scrollHeight);
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

        tdAcciones.classList.add('acciones');

        tdFecha.innerText = `${fecha[2]}/${fecha[1]}/${fecha[0]}`;
        tdHora.innerText = elem.hora;
        tdImporte.innerText = elem.importe.toFixed(2);
        tdDiferencia.innerText = elem.diferencia;
        tdAcciones.innerHTML = `
            <div class=tool>
                <span class=material-icons>edit</span>
                <p class=tooltip>Modificar</p>
            </div>
            <div class=tool>
                <span class=material-icons>delete</span>
                <p class=tooltip>Eliminar</p>
            </div>
        `;

        tdAcciones.addEventListener('click',clickAccionar);

        tr.appendChild(tdFecha);
        tr.appendChild(tdHora);
        tr.appendChild(tdImporte);
        tr.appendChild(tdDiferencia);
        tr.appendChild(tdAcciones);

        tbody.appendChild(tr);
};

async function agregarDiferencia(e){
    const now = new Date();
    const fecha = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0,10);
    alertaActivo = true;
    const agregar = await sweet.fire({
        title:"Agregar Diferencia",
        html:`
        <section class="agregar">
            <main>
                <label htmlFor="date">Fecha</label>
                <input value=${fecha} type="date" name="date" id="date" />
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

        await axios.post(`${URL}difCaja`,difCaja,configAxios);
        listarElmento(difCaja)
    }
    alertaActivo = agregar.dismiss === "esc" ? true : false;
};

async function modificarDiferencia(e){
    seleccionado && seleccionado.classList.remove('seleccionado');
    subSeleccionado && subSeleccionado.classList.remove('subSeleccionado');

    seleccionado = e.target.parentNode;
    subSeleccionado = e.target;

    seleccionado.classList.add('seleccionado');
    subSeleccionado.classList.add('subSeleccionado');
    
};

async function accionarTeclado(e){
    if (e.keyCode === 27 && !alertaActivo) {
        window.close();
    }else if(e.keyCode === 27 && alertaActivo){
        alertaActivo = false;
    }
};

async function clickTbody(e){
    seleccionado && seleccionado.classList.remove('seleccionado');
    subSeleccionado && subSeleccionado.classList.remove('subSeleccionado');

    if (e.target.nodeName === "TD") {
        seleccionado = e.target.parentNode;
        subSeleccionado = e.target;
    }else if (e.target.nodeName === "SPAN") {
        seleccionado = e.target.parentNode.parentNode.parentNode;
        subSeleccionado = e.target.parentNode.parentNode;
    }else  if (e.target.nodeName === "P") {
        seleccionado = e.target.parentNode.parentNode.parentNode;
        subSeleccionado = e.target.parentNode.parentNode;
    };

    seleccionado.classList.add('seleccionado');
    subSeleccionado.classList.add('subSeleccionado');
}

async function clickAccionar(e){
    if (e.target.innerText === "delete") {
        const {isConfirmed} = await sweet.fire({
            title:"Seguro quiere borrar diferencia de caja",
            showCancelButton:true,
            confirmButtonText:"Aceptar"
        });

        if (isConfirmed) {
            const mensaje = await axios.delete(`${URL}difCaja/id/${seleccionado.id}`,configAxios);
            if (mensaje) {
                tbody.removeChild(seleccionado);
                seleccionado = "";
            }
        }
    }else if(e.target.innerText === "edit"){
        const tr = e.target.parentNode.parentNode.parentNode;
        const fecha = tr.children[0].innerText.split('/',3);
        const valueFecha = `${fecha[2]}-${fecha[1]}-${fecha[0]}`;
        alertaActivo = true;

        const modificar = await sweet.fire({
            title:"Modificar diferencia",html:`
            <section class="agregar">
                <main>
                    <label htmlFor="date">Fecha</label>
                    <input autofocus type="date" value=${valueFecha} name="date" id="date" />
                </main>
                <main>
                    <label htmlFor="hora">Hora</label>
                    <input value=${tr.children[1].innerText} type="text" name="hora" id="hora" />
                </main>
                <main>
                    <label htmlFor="importe">Importe</label>
                    <input value=${tr.children[2].innerText} type="number" name="importe" id="importe" />
                </main>
            </section>
            `,
            confirmButtonText:"Modificar",
            showCancelButton:true
        });

    if (modificar.isConfirmed) {
        const difCaja = (await axios.get(`${URL}difCaja/id/${tr.id}`,configAxios)).data;
        const aux = JSON.parse(difCaja.importe);
        console.log(difCaja._id)
        
        const fecha = document.getElementById('date').value
        const hora = document.getElementById('hora').value;
        const importe = parseFloat(document.getElementById('importe').value);
        
        difCaja.fecha = fecha;
        difCaja.hora = hora;
        difCaja.importe = importe;
        difCaja.diferencia = redondear(+difCaja.importe + difCaja.diferencia - aux,2);
        difCaja.maquina = "PELUSA";

        await axios.put(`${URL}difCaja/id/${difCaja._id}`,difCaja,configAxios);
        tbody.removeChild(seleccionado);
        listarElmento(difCaja);
    };
    alertaActivo = agregar.dismiss === "esc" ? true : false;
    };
};


salir.addEventListener('click',cerrarVentana())