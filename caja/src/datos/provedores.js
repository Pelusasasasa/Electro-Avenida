const axios = require('axios');
const { ipcRenderer } = require('electron/renderer');
require('dotenv').config();
const URL = process.env.URL;

const sweet = require('sweetalert2');

let seleccionado;
let subSeleccionado;

const tbody = document.querySelector('tbody');
const agregar = document.querySelector('.agregar');
const consultar = document.querySelector('.consultar');
const borrar = document.querySelector('.borrar');
const salir = document.querySelector('.salir');

let botones = true;

window.addEventListener('load',async e=>{
    const provedores = (await axios.get(`${URL}provedor`)).data;
    await listar(provedores);

    seleccionado = tbody.firstElementChild;
    seleccionado.classList.add('seleccionado');

    subSeleccionado = seleccionado.firstElementChild;
    subSeleccionado.classList.add('subSeleccionado');
    
});


agregar.addEventListener('click',e=>{
    ipcRenderer.send('abrir-ventana',{
        path: "datos/agregarProvedor.html",
        width:1200,
        height:700,
        reinicio:true
    })
});


borrar.addEventListener('click',async e=>{
    if (seleccionado) {
        await sweet.fire({
            title:"Seguro eliminar provedor",
            showCancelButton:true,
            confirmButtonText:"Aceptar"
        }).then(async ({isConfirmed})=>{
            if (isConfirmed) {
                await axios.delete(`${URL}provedor/${seleccionado.id}`);
            }
            location.reload();  
        })
        }else{
        await sweet.fire({
            title:"No se selecciono ningun provedor"
        });
    }
});

consultar.addEventListener('click',async e=>{
    if (seleccionado) {
        ipcRenderer.send('abrir-ventana',{
            path:"datos/modificarProvedor.html",
            width:1200,
            height:700,
            reinicio:false,
            informacion:seleccionado.id
        })
    }else{
        await sweet.fire({
            title:"No se selecciono ningun provedor"
        });
    }
});

salir.addEventListener('click',e=>{
    location.href = '../index.html';
});

document.addEventListener('keyup',e=>{
    if (e.key === "Escape") {
        if (botones) {
            location.href = '../index.html';
        }else{
            window.close();
        }
    }
});

const listar = (lista)=>{
    for (let elem of lista){
        const tr = document.createElement('tr');

        const tdCodigo = document.createElement('td');
        const tdCliente = document.createElement('td');
        const tdRazonSocial = document.createElement('td');
        const tdDireccion = document.createElement('td');
        const tdLocalidad = document.createElement('td');

        tdCodigo.innerHTML = elem.codigo;
        tdCliente.innerHTML = elem.nombre;
        tdRazonSocial.innerHTML = elem.provedor;
        tdDireccion.innerHTML = elem.direccion;
        tdLocalidad.innerHTML = elem.localidad;

        tr.appendChild(tdCodigo);
        tr.appendChild(tdCliente);
        tr.appendChild(tdRazonSocial);
        tr.appendChild(tdDireccion);
        tr.appendChild(tdLocalidad);
        tr.id = elem.codigo;
        tbody.appendChild(tr);
    }
};

const body = document.querySelector('body');
body.addEventListener('click',e=>{
   if (e.target.nodeName === "TD" || e.target.nodeName === "TR") {
    seleccionado && seleccionado.classList.remove('seleccionado')
    seleccionado = e.target.nodeName === "TD" ? e.target.parentNode : e.target;
    seleccionado.classList.add('seleccionado');

    subSeleccionado && subSeleccionado.classList.remove('subSeleccionado');
    subSeleccionado = e.target.nodeName === "TD" ? e.target : e.target.children[0];
    subSeleccionado.classList.add('subSeleccionado')
   }

});

body.addEventListener('keyup',e=>{
    if (e.keyCode === 13 && seleccionado && !botones) {
        ipcRenderer.send('enviar-info-ventana-principal',seleccionado.id);
        window.close();
    }else if (e.keyCode === 40 && seleccionado.nextElementSibling) {
        const tds = document.querySelectorAll('.seleccionado td');
        let i = 0;
        let index
        for(let td of tds){
            if (td.classList.contains('subSeleccionado')) {
                index = i
            }
            i++
        }

        seleccionado && seleccionado.classList.remove('seleccionado');
        seleccionado = seleccionado.nextElementSibling;
        seleccionado.classList.add('seleccionado');

        subSeleccionado && subSeleccionado.classList.remove('subSeleccionado');
        subSeleccionado = seleccionado.children[index];
        subSeleccionado.classList.add('subSeleccionado');
        
    }else if(e.keyCode === 38 && seleccionado.previousElementSibling){
        const tds = document.querySelectorAll('.seleccionado td');
        let i = 0;
        let index
        for(let td of tds){
            if (td.classList.contains('subSeleccionado')) {
                index = i
            }
            i++
        }

        seleccionado && seleccionado.classList.remove('seleccionado');
        seleccionado = seleccionado.previousElementSibling;
        seleccionado.classList.add('seleccionado');


        subSeleccionado && subSeleccionado.classList.remove('subSeleccionado');
        subSeleccionado = seleccionado.children[index];
        subSeleccionado.classList.add('subSeleccionado');
        
    }else if(e.keyCode === 39 && subSeleccionado.nextElementSibling){
        subSeleccionado && subSeleccionado.classList.remove('subSeleccionado');
        subSeleccionado = subSeleccionado.nextElementSibling;
        subSeleccionado.classList.add('subSeleccionado');
    }else if(e.keyCode === 37 && subSeleccionado.previousElementSibling){
        subSeleccionado && subSeleccionado.classList.remove('subSeleccionado');
        subSeleccionado = subSeleccionado.previousElementSibling;
        subSeleccionado.classList.add('subSeleccionado')
    };
    if(e.target.nodeName !== "INPUT"){
        if (e.key === "Control") {
            body.addEventListener('keyup',e=>{
                if (e.keyCode === 67) {
                    navigator.clipboard.writeText(subSeleccionado.innerHTML);
                }
            })
        }
    }
})

ipcRenderer.on('recibir-informacion',(e,args)=>{
    botones = args.botones;

    if (!botones) {
        borrar.parentNode.classList.add('none');
    }
})