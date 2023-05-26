const axios = require('axios');
const { ipcRenderer } = require('electron/renderer');
const { cerrarVentana, copiar, configAxios } = require('../assets/js/globales');
require('dotenv').config();
const URL = process.env.URL;

const sweet = require('sweetalert2');
let tipo;

const titulo = document.querySelector('h1');

const desde = document.querySelector('#desde');
const hasta = document.querySelector('#hasta');
const tbody = document.querySelector('tbody');
const select = document.querySelector('#cuenta');

const totalInput = document.querySelector('#total');

const today = new Date();

let day = today.getDate();
let month = today.getMonth() + 1;
let year = today.getFullYear();


month = month === 13 ? 1 : month;
month = month < 10 ? `0${month}` : month;
day = day < 10 ? `0${day}` : day;

let seleccionado;
let subSeleccionado;
let cuentasConTipo;
let cuentas;

window.addEventListener('load',async e=>{
    cerrarVentana();
    copiar();
    
    desde.value = `${year}-${month}-${day}`;
    hasta.value = `${year}-${month}-${day}`;
});

select.addEventListener('change',async e=>{
    let nextDay = new Date(hasta.value);
    nextDay.setDate(today.getDate() + 1);
    const ingresos = (await axios.get(`${URL}movCajas/${desde.value}/${nextDay}/${select.value}`,configAxios)).data
    listar(ingresos);
});

const listarRubros = async(cuentasConTipo)=>{
    for(let cuenta of cuentasConTipo){
        const option = document.createElement('option');
        option.value = cuenta.cod;
        option.text = cuenta.desc;
        select.appendChild(option);
    };

    let nextDay = new Date(hasta.value);
    nextDay.setDate(today.getDate() + 1);

    const ingresos = (await axios.get(`${URL}movCajas/${desde.value}/${nextDay}/${select.value}`,configAxios)).data;
    listar(ingresos.filter(ingreso => ingreso.tMov === tipo))
}

const listar = async(lista)=>{
    const listaOrdenada = lista.filter(elem=>elem.tMov === tipo);
    listaOrdenada.sort((a,b)=>{//la usamos para ordenar la lsita
        if (a.idCuenta>b.idCuenta) {
            return 1
        }else if(a.idCuenta<b.idCuenta){
            return -1
        }
        return 0
    });

    tbody.innerHTML = "" ;
    let cuenta = "";
    let total = 0;
    let totalIngresos = 0;
    for await (let elem of listaOrdenada){
        totalIngresos += elem.imp

        if (cuenta !== "" && cuenta !== elem.idCuenta) {
            const tr = document.createElement('tr');
            const tdTotal = document.createElement('td');

            tdTotal.classList.add('bold');

            tdTotal.innerHTML = total.toFixed(2);

            tr.appendChild(tdTotal);

            tbody.appendChild(tr);

            total = 0;
        }
        if (cuenta !== elem.idCuenta) {
            const tr = document.createElement('tr');

            const td = document.createElement('td');

            td.classList.add('bold')

            td.innerHTML = elem.cuenta;
            
            tr.appendChild(td);
            
            tbody.appendChild(tr);
            cuenta = elem.idCuenta;

        }
        
        const fecha = elem.fecha.slice(0,10).split('-',3);

        const tr = document.createElement('tr');
        tr.id = elem._id;

        const tdFecha = document.createElement('td');
        const tdNumero = document.createElement('td');
        const tdDescripcion = document.createElement('td');
        const tdImporte = document.createElement('td');
        
        tdFecha.innerHTML = `${fecha[2]}/${fecha[1]}/${fecha[0]}`;
        tdNumero.innerHTML = elem.nro_comp;
        tdDescripcion.innerHTML = elem.desc;
        tdImporte.innerHTML = elem.imp.toFixed(2);

        tr.appendChild(tdFecha);
        tr.appendChild(tdNumero);
        tr.appendChild(tdDescripcion);
        tr.appendChild(tdImporte);

        tdImporte.classList.add('text-right');

        tbody.appendChild(tr);

        total += elem.imp;
    }

    totalInput.value = totalIngresos.toFixed(2);
};

select.addEventListener('keypress',e=>{
    e.preventDefault();
    if (e.keyCode === 13) {
        desde.focus();
    }
});

desde.addEventListener('keypress',async e=>{
    const fecha = hasta.value.split('-',3);
    let nextDay = new Date(fecha[0],fecha[1] - 1,fecha[2]);
    nextDay.setDate(nextDay.getDate() + 1);

    const ingresos = (await axios.get(`${URL}movCajas/${desde.value}/${nextDay}/${select.value}`,configAxios)).data
    listar(ingresos);
});

hasta.addEventListener('change',async e=>{
        const fecha = hasta.value.split('-',3);
        let nextDay = new Date(fecha[0],fecha[1] - 1,fecha[2]);
        nextDay.setDate(nextDay.getDate() + 1);

        const ingresos = (await axios.get(`${URL}movCajas/${desde.value}/${nextDay}/${select.value}`,configAxios)).data
        listar(ingresos);
});

//cuando hacemos click en la tabla seleccioonamos el tr y subseleccionamos el td
tbody.addEventListener('click',e=>{

    seleccionado && seleccionado.classList.remove('seleccionado');
    subSeleccionado && subSeleccionado.classList.remove('subSeleccionado');

    if (e.target.nodeName === "TD") {
        seleccionado = e.target.parentNode;
        subSeleccionado = e.target;
    }else if(e.target.nodeName === "DIV"){
        seleccionado = e.target.parentNode.parentNode;
        subSeleccionado = e.target.parentNode;
    }else if(e.target.nodeName === "SPAN"){
        seleccionado = e.target.parentNode.parentNode.parentNode;
        subSeleccionado = e.target.parentNode.parentNode;
    }

    seleccionado.classList.add('seleccionado');
    subSeleccionado.classList.add('subSeleccionado');
});

ipcRenderer.on('recibir-informacion',async (e,args)=>{
    cuentas = (await axios.get(`${URL}cuentas`,configAxios)).data;
    tipo = args;
    
    if (tipo === "I") {
        titulo.innerHTML = "Ingreso de Caja";
        cuentasConTipo = cuentas.filter(cuenta=>cuenta.tipo === tipo);
    }else{
        titulo.innerHTML = "Egreso de Caja";
        cuentasConTipo = cuentas.filter(cuenta=>cuenta.tipo === tipo)
    }
    listarRubros(cuentasConTipo)
});

desde.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        hasta.focus();
    }
})