const axios = require('axios');
const { ipcRenderer } = require('electron/renderer');
require('dotenv').config();
const URL = process.env.URL;

const XLSX = require('xlsx');
const sweet = require('sweetalert2');
const { redondear, copiar } = require('../assets/js/globales');

const tbody = document.querySelector('tbody');
const buscador = document.getElementById('buscador');
const inputTotal = document.getElementById('total');

const agregar = document.querySelector('.agregar');
const sumar = document.querySelector('.sumar');
const exportar = document.querySelector('.exportar');
const salir = document.querySelector('.salir');

let vales = [];
let total = 0;
let seleccionado;
let subSeleccionado;

window.addEventListener('load',async e=>{
    copiar();
    vales = (await axios.get(`${URL}vales/personal`)).data;

    vales.sort((a,b)=>{
        console.log(a)
        if(a.rsoc < b.rsoc){
            return 1
        }else if(a.rsoc > b.rsoc){
            return -1
        }
        return 0
    })

    listarVales(vales);
});

buscador.addEventListener('keyup',e=>{
    const valeFiltrado = vales.filter(vale=>vale.rsoc.startsWith(e.target.value.toUpperCase()));
    listarVales(valeFiltrado)
});

const listarVales = (vales)=>{
    tbody.innerHTML = "";
    for(let vale of vales){
    const tr = document.createElement('tr');
    tr.id = vale._id;

    const fecha = vale.fecha.slice(0,10).split('-',3);

    const tdFecha = document.createElement('td');
    const tdNumero = document.createElement('td');
    const tdSocial = document.createElement('td');
    const tdConcepto = document.createElement('td');
    const tdImporte = document.createElement('td');
    const tdAcciones = document.createElement('td');
    
    tdFecha.innerHTML = `${fecha[2]}/${fecha[1]}/${fecha[0]}`
    tdNumero.innerHTML = vale.nro_comp;
    tdSocial.innerHTML = vale.rsoc;
    tdConcepto.innerHTML = vale.concepto;
    tdImporte.innerHTML = redondear(vale.imp,2);
    tdAcciones.innerHTML = `
            <div id=edit class=tool>
                <span class=material-icons>edit</span>
                <p class=tooltip>Modificar</p>
            </div>
            <div id=delete class=tool>
                <span class=material-icons>delete</span>
                <p class=tooltip>Eliminar</p>
            </div>
        `

    tdImporte.classList.add('text-right');
    tdAcciones.classList.add('acciones')

    tr.appendChild(tdFecha);
    tr.appendChild(tdNumero);
    tr.appendChild(tdSocial);
    tr.appendChild(tdConcepto);
    tr.appendChild(tdImporte);
    tr.appendChild(tdAcciones);

    tbody.appendChild(tr);

    total += vale.imp;
    }
    inputTotal.value = redondear(total,2);
};

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

    if (e.target.innerHTML === "delete") {
        sweet.fire({
            title:"Quiere Eliminar",
            confirmButtonText:"Aceptar",
            showCancelButton:true
        }).then(async ({isConfirmed})=>{
            if (isConfirmed) {
                try {
                    await axios.delete(`${URL}vales/id/${seleccionado.id}`);
                    tbody.removeChild(seleccionado);
                    inputTotal.value = redondear(parseFloat(inputTotal.value) - parseFloat(seleccionado.children[4].innerHTML),2);
                } catch (error) {
                    await sweet.fire({
                        title:"No se pudo borrar el vale"
                    })
                }
            }
        })
    }else if(e.target.innerHTML === "edit"){
        ipcRenderer.send('abrir-ventana',{
            path:'vales/agregar-modificarValesPersonal.html',
            width:500,
            height:500,
            reinicio:true,
            informacion:seleccionado.id
        })
    }

});

agregar.addEventListener('click',e=>{
    ipcRenderer.send('abrir-ventana',{
        path:'vales/agregar-modificarValesPersonal.html',
        width:500,
        height:500,
        reinicio:true
    })
});

sumar.addEventListener('click',async e=>{
    let suma = 0;
    for(let vale of vales){
        if (vale.rsoc === seleccionado.children[2].innerHTML) {
            suma += vale.imp
        }
    }
    await sweet.fire({
        title:`La suma de ${seleccionado.children[2].innerHTML} es: $${redondear(suma,2)}`
    })
});

exportar.addEventListener('click',e=>{
    ipcRenderer.send('elegirPath');
    ipcRenderer.on('mandoPath',(e,args)=>{

        let wb = XLSX.utils.book_new();
        let path;
        let extencion = "xlsx";

        extencion = args.split('.')[1] ? args.split('.')[1] : extencion;
        path = args.split('.')[0];

        vales.forEach(vale=>{
            delete vale._id;
            delete vale.__v;
        });
        
        wb.props = {
            Title: "Vales",
            subject: "Test",
            Author: "Electro Avenida"
        }

        let newWs = XLSX.utils.json_to_sheet(vales);

        XLSX.utils.book_append_sheet(wb,newWs,'Vales');
        XLSX.writeFile(wb,path + "." + extencion);

    });
});

salir.addEventListener('click',e=>{
    location.href = '../index.html';
});

document.addEventListener('keydown', e=>{
    if (e.keyCode ===27) {
        location.href = '../index.html';
    }
})