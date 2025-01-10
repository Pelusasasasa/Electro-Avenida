const { ipcRenderer,clipboard } = require("electron");

const axios = require('axios');
const { copiar,redondear, configAxios } = require("../assets/js/globales");
require('dotenv').config();
const URL = process.env.URL;

const XLSX = require('xlsx');

const sweet = require('sweetalert2');

const tbody = document.querySelector('.tbody');

const buscador = document.querySelector('#buscador');
const totalInput = document.querySelector('#total');

const hoy = document.querySelector('#hoy');
const totalResumen = document.querySelector('#totalResumen');

const agregar = document.querySelector('.agregar');
const sumar = document.querySelector('#sumar');
const exportar = document.querySelector('#exportar');
const eliminarVarios = document.querySelector('#eliminarVarios');
const salir = document.querySelector('.salir');

let total = 0;
let tarjetas = [];
let seleccionado;
let subSeleccionado;
let aux = 0;

const now = new Date();
let date = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString();

hoy.addEventListener('change',e=>{
    if(hoy.checked){
        const tarjetasHoy = tarjetas.filter(tarjeta => tarjeta.fecha.slice(0,10) === date.slice(0,10));
        total = 0;
        listar(tarjetasHoy);
    }else{
        total = 0;
        listar(tarjetas);
    }
});

window.addEventListener('load',async e=>{
    copiar();
    tarjetas = (await axios.get(`${URL}tarjetas`,configAxios)).data;
    listar(tarjetas);
});

buscador.addEventListener('keyup',e=>{
    listar(tarjetas.filter(tarjeta => tarjeta.tarjeta.startsWith(buscador.value.toUpperCase())))
});

agregar.addEventListener('click',e=>{
    ipcRenderer.send('abrir-ventana',{
        path:"./tarjetas/agregarTarjeta.html",
        width:500,
        height:550,
        reinicio:false
    });
});

tbody.addEventListener('click',async e=>{
    if (e.target.nodeName !== "TBODY") {
        seleccionado && seleccionado.classList.remove('seleccionado')
        subSeleccionado && subSeleccionado.classList.remove('subSeleccionado');

        if (e.target.nodeName === "TD") {
            seleccionado = e.target.parentNode;
            subSeleccionado = e.target;
        }else if(e.target.nodeName === "DIV"){
            seleccionado = e.target.parentNode.parentNode;
            subSeleccionado = e.target.parentNode;
        }else if(e.target.nodeName === "SPAN"){
            seleccionado = e.target.parentNode.parentNode.parentNode;
            subSeleccionado = e.target.parentNode.parentNode
        }else if(e.target.nodeName === "INPUT"){
            seleccionado = e.target.parentNode.parentNode.parentNode;
            subSeleccionado = e.target.parentNode.parentNode;
            if (e.target.checked) {
                aux += parseFloat(seleccionado.children[3].innerText);
            }else{
                aux -= parseFloat(seleccionado.children[3].innerText);
            }
            totalResumen.parentNode.classList.remove('none')
            totalResumen.value = redondear(aux,2);
            
            totalResumen.value === "0.00" && totalResumen.parentNode.classList.add('none');
        }
        seleccionado.classList.add('seleccionado');
        subSeleccionado.classList.add('subSeleccionado');


        if (e.target.innerHTML === "delete") {
            await sweet.fire({
                title:"Seguro que quiere eliminar",
                showCancelButton:true,
                confirmButtonText: "Aceptar"
            }).then(async ({isConfirmed})=>{
                if (isConfirmed) {
                    try {
                        totalInput.value = redondear(parseFloat(totalInput.value) - parseFloat(seleccionado.children[2].innerHTML),2)
                        await axios.delete(`${URL}tarjetas/id/${seleccionado.id}`,configAxios);
                        tbody.removeChild(seleccionado)
                    } catch (error) {
                        await sweet.fire({
                            title:"No se pudo borrar"
                        });
                    }
                }
            });
        }else if (e.target.innerHTML === "edit") {
            ipcRenderer.send('abrir-ventana',{
                path:"./tarjetas/agregarTarjeta.html",
                width:500,
                height:550,
                reinicio:true,
                informacion: seleccionado.id
            });
        }
    }
});

salir.addEventListener('click',e=>{
    location.href = '../index.html';
});

document.addEventListener('keyup',e=>{
    if (e.key === "Escape") {
        location.href = '../index.html';
    }
});

const listar = async(tarjetas)=>{
    tarjetas.sort((a,b)=>{
        if (a.fecha>b.fecha) {
            return -1;
        }else if(a.fecha<b.fecha){
            return 1;
        }
        return 0;
    })
    .sort((a,b)=>{
        return a.tarjeta>b.tarjeta ? 1 : -1;
    });
    total = 0;

    tbody.innerHTML = "";
    for await(let tarjeta of tarjetas){
        const tr = document.createElement('tr');
        tr.id = tarjeta._id;

        const pagado = (new Date().getTime() < new Date(tarjeta.fechaPago).getTime());

        if(pagado){
            tr.classList.add('border-red');
            tr.classList.add('border-2');
        }

        const tdFecha = document.createElement('td');
        const tdTarjeta = document.createElement('td');
        const tdCliente = document.createElement('td');
        const tdImporte = document.createElement('td');
        const tdTipo = document.createElement('td');
        const tdVendedor = document.createElement('td');
        const tdAcciones = document.createElement('td');
        const tdEliminarVarios = document.createElement('td');

        const fecha = tarjeta.fecha.slice(0,10).split('-',3);
        const hora = tarjeta.fecha.slice(11,19).split(':',3);
        tdFecha.innerHTML = `${fecha[2]}/${fecha[1]}/${fecha[0]} - ${hora[0]}:${hora[1]}:${hora[2]}`;
        tdTarjeta.innerHTML = tarjeta.tarjeta;
        tdCliente.innerHTML = tarjeta.cliente
        tdImporte.innerHTML = tarjeta.imp ? (tarjeta.imp).toFixed(2) : "";
        tdTipo.innerText = tarjeta.tipo_comp ? tarjeta.tipo_comp : "";
        tdVendedor.innerHTML = tarjeta.vendedor;
        tdAcciones.innerHTML = `
            <div id=edit class=tool>
                <span class=material-icons>edit</span>
            </div>
            <div id=delete class=tool>
                <span class=material-icons>delete</span>
            </div>
        `
        tdEliminarVarios.innerHTML = `
            <div class="divEliminarVarios">
                <input type="checkbox" class="eliminarVarios" id="${tarjeta._id}" name="hoy">
            </div>
        `

        tdAcciones.classList.add('acciones');
        total += tarjeta.imp;

        tr.appendChild(tdFecha);
        tr.appendChild(tdTarjeta);
        tr.appendChild(tdCliente);
        tr.appendChild(tdImporte);
        tr.appendChild(tdTipo);
        tr.appendChild(tdVendedor);
        tr.appendChild(tdAcciones);
        tr.appendChild(tdEliminarVarios);

        tbody.appendChild(tr)
    }
    totalInput.value = total.toFixed(2);
};

sumar.addEventListener('click',e=>{
    if(seleccionado){
        let tarjetaSumar = seleccionado.children[1].innerHTML;
        let total = 0;
        tarjetas.forEach(tarjeta=>{
            if(tarjeta.tarjeta ===  tarjetaSumar){
                total += tarjeta.imp;
            }
        }) 
        sweet.fire({
            title:`Total de tarjeta ${tarjetaSumar}: $${total}`
        })
    };
});

exportar.addEventListener('click',async e=>{
    let path = await ipcRenderer.invoke('elegirPath');
    let wb = XLSX.utils.book_new();
    
    let extencion = "xlsx";

    tarjetas.forEach(tarjeta=>{
        delete tarjeta._id;
        delete tarjeta.__v;
        const fecha = tarjeta.fecha.slice(0,10).split('-',3)
        tarjeta.fecha = `${fecha[2]}/${fecha[1]}/${fecha[0]}`;
    });

    wb.props = {
        Title: "Tarjetas",
        subject: "Test",
        Author: "Electro Avenida"
    };

    let newWs = XLSX.utils.json_to_sheet(tarjetas);

    XLSX.utils.book_append_sheet(wb,newWs,'Tarjetas');
    XLSX.writeFile(wb,path + "." + extencion);
});

eliminarVarios.addEventListener('click',async e=>{
    const inputs = document.querySelectorAll('tr td input[type=checkbox]');
    await sweet.fire({
        title:"Elimiar varias tarjetas?",
        showCancelButton:true,
        confirmButtonText:"Aceptar"
    }).then(async({isConfirmed})=>{
       if (isConfirmed) {
        for await(let input of inputs){
            if (input.checked) {
                await axios.delete(`${URL}tarjetas/id/${input.id}`,configAxios);
                tbody.removeChild(input.parentNode.parentNode.parentNode);
                totalResumen.value = "0.00";
                aux = 0;
                totalResumen.parentNode.classList.add('none'); 
            }
        };
       } 
    });
    
});

ipcRenderer.on('recibir-informacion',(e,args)=>{
    const tr = document.createElement('tr');

    const tdFecha = document.createElement('td');
    const tdTarjeta = document.createElement('td');
    const tdCliente = document.createElement('td');
    const tdImporte = document.createElement('td');
    const tdTipo = document.createElement('td');
    const tdVendedor = document.createElement('td');    
    const tdAcciones = document.createElement('td');
    const tdEliminarVarios = document.createElement('td');

    const auxFecha = args.fecha.slice(0,10).split('-',3);
    tdFecha.innerText = `${auxFecha[2]}/${auxFecha[1]}/${auxFecha[0]}`;
    tdTarjeta.innerText = args.tarjeta;
    tdCliente.innerText = args.cliente;
    tdImporte.innerText = parseFloat(args.imp).toFixed(2);
    tdTipo.innerText = args.tipo_comp.toUpperCase();
    tdVendedor.innerText = args.vendedor;
    tdAcciones.innerHTML = `
            <div id=edit class=tool>
                <span class=material-icons>edit</span>
            </div>
            <div id=delete class=tool>
                <span class=material-icons>delete</span>
            </div>
        `
    tdEliminarVarios.innerHTML = `
        <div class="divEliminarVarios">
            <input type="checkbox" class="eliminarVarios" name="hoy">
        </div>
        `

        tdAcciones.classList.add('acciones');
        total += parseFloat(args.imp);
        totalInput.value = total.toFixed(2);

    tr.appendChild(tdFecha);
    tr.appendChild(tdTarjeta);
    tr.appendChild(tdCliente);
    tr.appendChild(tdImporte);
    tr.appendChild(tdImporte);
    tr.appendChild(tdTipo)
    tr.appendChild(tdVendedor);
    tr.appendChild(tdAcciones);
    tr.appendChild(tdEliminarVarios);

    tbody.appendChild(tr)
})
