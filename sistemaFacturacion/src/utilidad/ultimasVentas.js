
const axios = require("axios");
const { ipcRenderer } = require("electron");
const { cerrarVentana, botonesSalir } = require("../funciones");
require("dotenv").config;
const URL = process.env.URL;

let ventas;


const desde = document.querySelector('#desde');
const hasta = document.querySelector('#hasta');
const tbody = document.querySelector('tbody');
const alerta = document.querySelector('.alerta');

const salir = document.querySelector('.salir');

let seleccionado = "";
let subSeleccionado = "";

const today = new Date();

window.addEventListener('load',async e=>{

    //funciones
    cerrarVentana();
    botonesSalir()

    let day = today.getDate();
    let month = today.getMonth() + 1;
    let year = today.getFullYear();

    month = month === 13 ? 1 : month;
    month = month<10 ? `0${month}` : month;
    day = day<10 ? `0${day}` : day;

    desde.value = `${year}-${month}-${day}`
    hasta.value = `${year}-${month}-${day}`

    let nextDay = new Date(hasta.value);
    nextDay.setDate(today.getDate() + 1);

    ventas = (await axios.get(`${URL}ventas/${desde.value}/${nextDay}`)).data;
    // alerta.classList.remove('none');
    listar(ventas);
});



desde.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
        hasta.focus();
    }
});

hasta.addEventListener('keypress',async e=>{
    let nextDay = new Date(hasta.value);
    nextDay.setDate(today.getDate() + 1);

    if (e.keyCode === 13) {
    await alerta.classList.remove('none');
    ventas = (await axios.get(`${URL}ventas/${desde.value}/${nextDay}`)).data;
    recibos = (await axios.get(`${URL}recibos/getbetweenDates/${desde.value}/${nextDay}`)).data;
    listar(ventas);
    listarRecibos(recibos);
    }
})

tbody.addEventListener('click',e=>{
    seleccionado && seleccionado.classList.remove('seleccionado');
    seleccionado = e.target.nodeName === "TD" ? e.target.parentNode : e.target.parentNode.parentNode;
    seleccionado.classList.add('seleccionado');

    subSeleccionado && subSeleccionado.classList.remove('subSeleccionado');
    subSeleccionado = e.target.nodeName === "TD" ? e.target : e.target.parentNode;
    subSeleccionado.classList.add('subSeleccionado');

    if (e.target.nodeName === "BUTTON") {
        const venta = ventas.find(elem =>elem.nro_comp === seleccionado.id);
        ipcRenderer.send('imprimir-venta',[venta,,false,1,"Ticket Factura",,]);
    }
})

const listar = async(lista)=>{
    //filtramos las ventas solo para ver ticket o notas de credito

    for await(let venta of lista){
        const tr = document.createElement('tr');
        tr.id = venta.nro_comp;

        const tdHora = document.createElement('td');
        const tdCliente = document.createElement('td');
        const tdTipo = document.createElement('td');
        const tdNumero = document.createElement('td');
        const tdImporte = document.createElement('td');
        const tdImprimir = document.createElement('td');
        const button = document.createElement('button');

        tdImporte.classList.add('text-right');
        tdImporte.classList.add('text-bold');

        const hora = (venta.fecha.slice(11,19)).split(':',3);

        tdHora.innerHTML = `${hora[0]}:${hora[1]}:${hora[2]}`;
        tdCliente.innerHTML = venta.nombreCliente;
        tdTipo.innerHTML = verTipoComp(venta.cod_comp);
        tdNumero.innerHTML = venta.nro_comp;
        tdImporte.innerHTML = venta.precioFinal.toFixed(2);

        button.innerHTML = "Re-Impirmir";
        button.classList.add('imprimir')
        tdImprimir.appendChild(button)

        tr.appendChild(tdHora);
        tr.appendChild(tdCliente);
        tr.appendChild(tdTipo);
        tr.appendChild(tdNumero);
        tr.appendChild(tdImporte);
        tr.appendChild(tdImprimir);

        tbody.appendChild(tr);
    }
    alerta.classList.add('none');
};

const listarRecibos = async(recibos)=>{
    for await(let recibo of recibos){
        const tr = document.createElement('tr');

        const tdFecha = document.createElement('td');
        const tdCliente = document.createElement('td');
        const tdTipo = document.createElement('td');
        const tdNumero = document.createElement('td');
        const tdImporte = document.createElement('td');
        const tdImprimir = document.createElement('td');
        const button = document.createElement('button');

        tdFecha.innerHTML = recibo.fecha.slice(11,19);
        tdCliente.innerHTML = recibo.cliente;
        tdTipo.innerHTML = recibo.tipo_comp;
        tdNumero.innerHTML = recibo.nro_comp;
        tdImporte.innerHTML = recibo.precioFinal.toFixed(2);
        button.innerHTML = "Re-Imprimir"
        tdImprimir.appendChild(button);

        tdImporte.classList.add('text-right');
        tdImporte.classList.add('text-bold');

        button.classList.add('imprimir');

        tr.appendChild(tdFecha);
        tr.appendChild(tdCliente);
        tr.appendChild(tdTipo);
        tr.appendChild(tdNumero);
        tr.appendChild(tdImporte);
        tr.appendChild(tdImprimir);

        tbody.appendChild(tr)
        
    }
}

const verTipoComp = (numero)=>{
    if (numero === 1) {
        return "Factura A";
    }else if(numero === 6){
        return "Factura B";
    }else if(numero === 3){
        return "Nota Credito A"
    }else if(numero === 8){
        return "Nota Credito B"
    }
    return ""
};