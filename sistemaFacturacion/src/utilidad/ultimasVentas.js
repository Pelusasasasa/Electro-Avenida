
const axios = require("axios");
const { ipcRenderer } = require("electron");
const { cerrarVentana, botonesSalir, configAxios } = require("../funciones");
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

    desde.value = `${year}-${month}-${day}`;
    hasta.value = `${year}-${month}-${day}`;

    recibos = (await axios.get(`${URL}recibos/recibosBetweenDates/${desde.value}/${hasta.value}`)).data;
    ventas = (await axios.get(`${URL}ventas/${desde.value}/${hasta.value}`,configAxios)).data;
    // alerta.classList.remove('none');
    listar(ventas,recibos);
});


desde.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
        hasta.focus();
    }
});

hasta.addEventListener('keypress',async e=>{

    if (e.keyCode === 13) {
    await alerta.classList.remove('none');
    ventas = (await axios.get(`${URL}ventas/${desde.value}/${hasta.value}`,configAxios)).data;
    recibos = (await axios.get(`${URL}recibos/recibosBetweenDates/${desde.value}/${hasta.value}`)).data;
    console.log(recibos)
    listar(ventas,recibos);
    // listarRecibos(recibos);
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
        if (seleccionado.children[2].innerText === "Recibos") {
            const recibo = recibos.find(elem => elem.nro_comp === seleccionado.id);
            ipcRenderer.send('imprimir-venta',[recibo,,false,1,"Recibos",,]);
        }else{
            const venta = ventas.find(elem =>elem.nro_comp === seleccionado.id);
            ipcRenderer.send('imprimir-venta',[venta,,false,1,"Ticket Factura",,]);
        }
        
    }
})

const listar = async(listaVentas,listaRecibos)=>{
    const lista = [...listaVentas,...listaRecibos]
    //filtramos las ventas solo para ver ticket o notas de credito

    for await(let venta of lista){
        console.log(venta)
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
        tdCliente.innerHTML = venta.nombreCliente ? venta.nombreCliente : venta.cliente;
        tdTipo.innerHTML = venta.tipo_comp === "Recibos" ? "Recibos" : verTipoComp(venta.cod_comp);
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
    return undefined
};