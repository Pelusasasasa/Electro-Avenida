const axios = require('axios');
const { ipcRenderer } = require('electron/renderer');
require('dotenv').config();
const URL = process.env.URL;

const sweet = require('sweetalert2');

let seleccionado;
let subSeleccionado;

const tbody = document.querySelector('tbody');
const agregar = document.querySelector('.agregar');
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
        const tdDireccion = document.createElement('td');
        const tdLocalidad = document.createElement('td');
        const tdAcciones = document.createElement('td');

        tdAcciones.classList.add('acciones')

        tdCodigo.innerHTML = elem.codigo;
        tdCliente.innerHTML = elem.provedor;
        tdDireccion.innerHTML = elem.direccion;
        tdLocalidad.innerHTML = elem.localidad;
        tdAcciones.innerHTML = `
            <div class=tool>
                <span class=material-icons>edit</span>
                <p class=tooltip>Editar</p>
            </div>
            <div class=tool>
                <span class=material-icons>delete</span>
                <p class=tooltip>Eliminar</p>
            </div>
        `

        tr.appendChild(tdCodigo);
        tr.appendChild(tdCliente);
        tr.appendChild(tdDireccion);
        tr.appendChild(tdLocalidad);
        tr.appendChild(tdAcciones);

        tr.id = elem.codigo;
        tbody.appendChild(tr);
    }
};

const body = document.querySelector('body');
tbody.addEventListener('click',async e=>{
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


    if (e.target.innerHTML === "edit") {
        ipcRenderer.send('abrir-ventana',{
            path:"datos/modificarProvedor.html",
            width:1200,
            height:700,
            reinicio:false,
            informacion:seleccionado.id
        })
    }else if(e.target.innerHTML === "delete"){
        await sweet.fire({
            title:"Seguro eliminar provedor",
            showCancelButton:true,
            confirmButtonText:"Aceptar"
        }).then(async ({isConfirmed})=>{
            if (isConfirmed) {
                try {
                    await axios.delete(`${URL}provedor/codigo/${seleccionado.id}`);
                    location.reload();
                } catch (error) {
                    sweet.fire({
                        title:"No se pudo borrar el provedor"
                    })
                }
            }
            
        })
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
        agregar.parentNode.classList.add('none');
    }
})