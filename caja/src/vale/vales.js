const { ipcRenderer } = require("electron");
const sweet = require('sweetalert2');

const axios = require('axios');
require('dotenv').config();
const URL = process.env.URL;

const totalInput = document.querySelector('#total');
const body = document.querySelector('body');
const tbody = document.querySelector('tbody');

let total = 0;
let vales = [];
let trSeleccionado;
let tdSeleccionado;

const listar = async(lista)=>{
    for await(let vale of lista){
        const tr = document.createElement('tr');
        tr.id = vale._id
 
        //fecha
        const tdFecha = document.createElement('td');
        let hoy = new Date(vale.fecha)
        let date = hoy.getDate();
        let month = hoy.getMonth() + 1;
        let year = hoy.getFullYear();
        date = date < 10 ? `0${date}` : date;
        month = month === 13 ? 1 : month;
        month = month < 10 ? `0${month}` : month;
        tdFecha.innerHTML = `${date}/${month}/${year}`;
        //comprobante
        const tdComprobante = document.createElement('td');
        tdComprobante.innerHTML = vale.nro_comp;
        //tdSocial
        const tdSocial = document.createElement('td');
        tdSocial.innerHTML = vale.rsoc;
        //tdConcepto
        const tdConcepto = document.createElement('td');
        tdConcepto.innerHTML = vale.concepto;
        //tdImporte
        const tdImporte = document.createElement('td');
        tdImporte.classList.add('text-right')
        tdImporte.innerHTML = vale.imp.toFixed(2);

        tr.appendChild(tdFecha);
        tr.appendChild(tdComprobante);
        tr.appendChild(tdSocial);
        tr.appendChild(tdConcepto);
        tr.appendChild(tdImporte);

        tbody.appendChild(tr);
        total += vale.imp;
    }
    totalInput.value = total.toFixed(2);
}

window.addEventListener('load',async e=>{
    vales = (await axios.get(`${URL}vales`)).data;
    listar(vales)
});

tbody.addEventListener('click',e=>{
    trSeleccionado && trSeleccionado.classList.remove('trSeleccionado');
    tdSeleccionado && tdSeleccionado.classList.remove('tdSeleccionado');

    trSeleccionado = e.target.nodeName === "TD" ? e.target.parentNode : e.target;
    tdSeleccionado = e.target.nodeName === "TD" ? e.target : e.target.children[0];

    trSeleccionado.classList.add('trSeleccionado');
    tdSeleccionado.classList.add('tdSeleccionado');
})

const agregar = document.querySelector('.agregar');
const borrar = document.querySelector('.borrar');
const salir = document.querySelector('.salir');


salir.addEventListener('click',e=>{
    location.href = '../index.html';
});

agregar.addEventListener('click',e=>{
    ipcRenderer.send('abrir-ventana',{
        path:'./vale/agregarValePersonal.html',
        width:500,
        height:500,
        reinicio:true
    })
});

borrar.addEventListener('click',async e=>{
    if (trSeleccionado) {
        await axios.delete(`${URL}vale/${trSeleccionado.id}`);
        location.reload();
    }else{
        sweet.fire({
            title:"Seleccionar un vale",
            returnFocus:false
        })
    }
});

totalInput.addEventListener('focus',e=>{
    totalInput.select()
})

document.addEventListener('keydown',e=>{
    if (e.key === "Escape") {
        location.href = '../index.html';
    }
    if(e.key === "Control" && document.activeElement.nodeName !== "INPUT"){
        body.addEventListener('keyup',e=>{
            navigator.clipboard.writeText(tdSeleccionado.innerHTML)
        });
    }
});


body.addEventListener('keydown',e=>{
    if (document.activeElement.nodeName !== 'INPUT') {
        recorrerFlechas(e);
    }
});

const recorrerFlechas = async(e)=>{
    if (e.keyCode === 39 && tdSeleccionado.nextElementSibling) {
        tdSeleccionado.classList.remove('tdSeleccionado');
        tdSeleccionado = tdSeleccionado.nextElementSibling;
        tdSeleccionado.classList.add('tdSeleccionado');
    }else if(e.keyCode === 37 && tdSeleccionado.previousElementSibling){
        tdSeleccionado.classList.remove('tdSeleccionado');
        tdSeleccionado = tdSeleccionado.previousElementSibling;
        tdSeleccionado.classList.add('tdSeleccionado');
    }else if(e.keyCode === 38 && trSeleccionado.previousElementSibling){
        let i = 0;
        let aux = 0;
        for await(let td of trSeleccionado.children){
            if (td.classList.contains('tdSeleccionado')) {
                aux = i;
            }
            i++;
        }

        trSeleccionado.classList.remove('trSeleccionado');
        trSeleccionado = trSeleccionado.previousElementSibling;
        trSeleccionado.classList.add('trSeleccionado');

        tdSeleccionado && tdSeleccionado.classList.remove('tdSeleccionado');
        tdSeleccionado = trSeleccionado.children[aux];
        tdSeleccionado.classList.add('tdSeleccionado');
    }else if(e.keyCode === 40 && trSeleccionado.nextElementSibling){
        let i = 0;
        let aux = 0;
        for await(let td of trSeleccionado.children){
            if (td.classList.contains('tdSeleccionado')) {
                aux = i;
            }
            i++;
        }

        trSeleccionado.classList.remove('trSeleccionado');
        trSeleccionado = trSeleccionado.nextElementSibling;
        trSeleccionado.classList.add('trSeleccionado');

        tdSeleccionado && tdSeleccionado.classList.remove('tdSeleccionado');
        tdSeleccionado = trSeleccionado.children[aux];
        tdSeleccionado.classList.add('tdSeleccionado');
    }
};