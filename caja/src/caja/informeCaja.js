const axios = require('axios');
require('dotenv').config();
const URL = process.env.URL;

const {clipboard} = require('electron')
const sweet = require('sweetalert2');
const { redondear, configAxios } = require('../assets/js/globales');

const desde = document.querySelector('#desde');
const hasta = document.querySelector('#hasta');
const tbodyIngreso = document.querySelector('.tbodyIngreso');
const tbodyEgreso = document.querySelector('.tbodyEgreso');
const salir = document.querySelector('.salir');
const modificar = document.querySelector('.modificar');

const today = new Date();

let saldoAnterior = 0
let totalIngresos = 0;
let totalEgresos = 0;

let day = today.getDate();
let month = today.getMonth() + 1;
let year = today.getFullYear();

let arregloEgresos = [];
let arregloIngresos = []
let seleccionado = "";
let subSeleccionado = "";
let arregloDeMovimientosAModificar = [];

month = month === 13 ? 1 : month;
month = month < 10 ? `0${month}` : month;
day = day < 10 ? `0${day}` : day;

window.addEventListener('load',async e=>{
    desde.value = `${year}-${month}-${day}`;
    hasta.value = `${year}-${month}-${day}`;

    const movimientos = (await axios.get(`${URL}movCajas/${desde.value}/${hasta.value}`,configAxios)).data;

    arregloEgresos = movimientos.filter(mov => (mov.pasado && mov.tMov === "E") && mov.pasado === true);
    arregloIngresos = movimientos.filter(mov => (mov.pasado && mov.tMov === "I") && mov.pasado === true);
    arregloEgresos.length !== 0 && listar(arregloEgresos,tbodyEgreso);
    arregloIngresos.length !== 0 && listar(arregloIngresos,tbodyIngreso);

});

const listar = async(lista,tbody)=>{
    tbody.innerHTML = '';
    totalEgresos = 0;
    totalIngresos = 0;
    let total = 0;
    lista.sort((a,b)=>{
        if (a.cuenta > b.cuenta) {
            return 1
        }else if(a.cuenta < b.cuenta){
            return -1
        }
        return 0
    })
    let cuenta = lista[0].cuenta;
    for await(let mov of lista){
        if (tbody.classList.contains('tbodyEgreso')) {
            totalEgresos += mov.imp;
        }else{
            totalIngresos += mov.imp;
        }
        if (mov.cuenta !== cuenta) {
            ponerTotal(total,cuenta,tbody)
            cuenta = mov.cuenta;
            total = 0;
        }
        total += mov.imp;

        const tr = document.createElement('tr');
        tr.id = mov._id
            
        const tdFecha = document.createElement('td')
        const tdNumero = document.createElement('td');
        const tdDescripcion = document.createElement('td');
        const tdTipo = document.createElement('td');
        const tdImporte = document.createElement('td');

        tdImporte.classList.add('text-right');
        const fecha = mov.fecha.slice(0,10).split('-',3);

        tdFecha.innerHTML = `${fecha[2]}/${fecha[1]}/${fecha[0]}`
        tdNumero.innerHTML = mov.nro_comp;
        tdDescripcion.innerHTML = mov.desc;
        tdTipo.innerHTML = mov.cuenta;
        tdImporte.innerHTML = mov.imp.toFixed(2);

        tr.appendChild(tdFecha)
        tr.appendChild(tdNumero);
        tr.appendChild(tdDescripcion);
        tr.appendChild(tdTipo);
        tr.appendChild(tdImporte);

        tbody.appendChild(tr);
    }
    ponerTotal(total,cuenta,tbody)

    const tr = document.createElement('tr');
    const td = document.createElement('td');
    const td1 = document.createElement('td');
    const td2 = document.createElement('td');
    const tdTotal = document.createElement('td');



    if (tbody.classList.contains('tbodyEgreso')) {
        td.innerHTML = "TOTAL EGRESOS";
        tdTotal.innerHTML = totalEgresos.toFixed(2);
    }else{
        td.innerHTML = "TOTAL Ingresos";
        tdTotal.innerHTML = totalIngresos.toFixed(2);
    }

    tr.appendChild(td);
    tr.appendChild(tdTotal);
    tr.appendChild(td1);
    tr.appendChild(td2);

    td.classList.add('bold');
    tdTotal.classList.add('bold');

    tbody.appendChild(tr);
    document.querySelector('.saldoAnterior').innerHTML = (await axios.get(`${URL}tipoVenta`,configAxios)).data["saldo Inicial"];
    if (tbody.classList.contains('tbodyEgreso')) {
        document.querySelector('.totalEgresos').innerHTML = totalEgresos.toFixed(2);
    }else{
        document.querySelector('.totalIngresos').innerHTML = totalIngresos.toFixed(2);
    }
    document.querySelector('.saldoFinal').innerHTML = redondear(totalIngresos-totalEgresos + (await axios.get(`${URL}tipoVenta`,configAxios)).data["saldo Inicial"],2);
    
};

document.addEventListener('keyup',e=>{
    if (e.keyCode === 27) {
        window.close();
    }
});

const ponerTotal = (total,cuenta,tbody)=>{
    const tr = document.createElement('tr');
    const tdCuenta = document.createElement('td');
    const td = document.createElement('td');
    const td1 = document.createElement('td');
    const tdTotal = document.createElement('td');

    tdCuenta.classList.add('bold')
    tdTotal.classList.add('bold')
    tdTotal.classList.add('text-right')
    
    tdCuenta.innerHTML = cuenta;
    tdTotal.innerHTML = total.toFixed(2)
    tr.appendChild(tdCuenta)
    tr.appendChild(td)
    tr.appendChild(td1)
    tr.appendChild(tdTotal);
    tbody.appendChild(tr);
};

desde.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
        hasta.focus();
    }
});

hasta.addEventListener('keypress', async e=>{
    if (e.key === "Enter") {
        const movimientos = (await axios.get(`${URL}movCajas/${desde.value}/${hasta.value}`,configAxios)).data;

        arregloEgresos = movimientos.filter(elem => (elem.pasado && elem.tMov === "E"));
        arregloIngresos = movimientos.filter(elem => (elem.pasado & elem.tMov === "I"));

        tbodyEgreso.innerHTML = "";
        tbodyIngreso.innerHTML = "";

        arregloEgresos.length !== 0 && listar(arregloEgresos,tbodyEgreso);
        arregloIngresos.length !== 0 && listar(arregloIngresos,tbodyIngreso);
    }
});

tbodyIngreso.addEventListener('click',e=>{
    seleccionarTr(e);
    if (e.target.nodeName === "INPUT") {
        e.target.select()
    } 
});

tbodyEgreso.addEventListener('click',e=>{
    seleccionarTr(e);   
    if (e.target.nodeName === "INPUT") {
        e.target.select()
    } 
});

document.addEventListener('keyup',e=>{
        recorrerConFlechas(e);

        //copiamos los inner html al hacer control + C
        if (e.keyCode === 17) {
            document.addEventListener('keyup',even=>{
                if(even.keyCode === 67){
                   subSeleccionado && clipboard.writeText(subSeleccionado.innerHTML);
                }
            })
        }else if(e.target.nodeName === "INPUT" && e.target.parentNode.nodeName === "TD"){
            //lo que hacemos es ver si se modifica el input entonces agregamos ese tr a la lista para modficar
            const enLista = arregloDeMovimientosAModificar.find(elem => elem === e.target.parentNode.parentNode.id)
            enLista === undefined && arregloDeMovimientosAModificar.push(seleccionado.id);
        }
});

const recorrerConFlechas = (e)=>{
    if (e.keyCode === 40 && seleccionado.nextElementSibling) {
        let aux;
        let i = 0;
        const tds = document.querySelectorAll('.seleccionado td');
        for(let td of tds){
            if (td.classList.contains('subSeleccionado')) {
                aux = i;
            }
            i++;
        }

        seleccionado && seleccionado.classList.remove('seleccionado');
        seleccionado = seleccionado.nextElementSibling;
        seleccionado.classList.add('seleccionado');

        subSeleccionado && subSeleccionado.classList.remove('subSeleccionado');
        subSeleccionado = seleccionado.children[aux]
        subSeleccionado.classList.add('subSeleccionado');
    }else if(e.keyCode === 38 && seleccionado.previousElementSibling){
        let aux;
        let i = 0;
        const tds = document.querySelectorAll('.seleccionado td');
        for(let td of tds){
            if (td.classList.contains('subSeleccionado')) {
                aux = i;
            }
            i++;
        }

        seleccionado && seleccionado.classList.remove('seleccionado');
        seleccionado = seleccionado.previousElementSibling;
        seleccionado.classList.add('seleccionado');

        subSeleccionado && subSeleccionado.classList.remove('subSeleccionado');
        subSeleccionado = seleccionado.children[aux]
        subSeleccionado.classList.add('subSeleccionado');
    }else if(e.keyCode === 37 && subSeleccionado.previousElementSibling){
        subSeleccionado && subSeleccionado.classList.remove('subSeleccionado');
        subSeleccionado = subSeleccionado.previousElementSibling;
        subSeleccionado.classList.add('subSeleccionado');
    }else if(e.keyCode === 39 && subSeleccionado.nextElementSibling){
        subSeleccionado && subSeleccionado.classList.remove('subSeleccionado');
        subSeleccionado = subSeleccionado.nextElementSibling;
        subSeleccionado.classList.add('subSeleccionado');
    }
};

//hacer pintar el tr y el td de colores para saber que ese es el seleccionado
const seleccionarTr = (e)=>{
    seleccionado && seleccionado.classList.remove('seleccionado');
    seleccionado = e.target.nodeName === "TD" ? e.target.parentNode : e.target.parentNode.parentNode;
    seleccionado.classList.add('seleccionado');

    subSeleccionado && subSeleccionado.classList.remove('subSeleccionado');
    subSeleccionado = e.target.nodeName === "TD" ? e.target : e.target.parentNode;
    subSeleccionado.classList.add('subSeleccionado');
};

modificar.addEventListener('click',async e=>{
    const arreglo = [];
    for(let elem of arregloDeMovimientosAModificar){
        const agregarEgreso = arregloEgresos.find(mov=>mov._id === elem);
        const agregarIngreso = arregloIngresos.find(mov=>mov._id === elem);
        if (agregarEgreso !== undefined) {
            agregarEgreso.imp = parseFloat(document.getElementById(elem).children[3].children[0].value)
            arreglo.push(agregarEgreso);
        }
        if (agregarIngreso !== undefined) {
            agregarIngreso.imp = parseFloat(document.getElementById(elem).children[3].children[0].value);
            arreglo.push(agregarIngreso)
        }
    }

    try {
        await axios.put(`${URL}movCajas`,arreglo,configAxios);
        location.reload();
    } catch (error) {
        await sweet.fire({
            title:"No se pudieron modificar los movimientos"
        });
    }

});

salir.addEventListener('click',e=>{
    window.close();
});

