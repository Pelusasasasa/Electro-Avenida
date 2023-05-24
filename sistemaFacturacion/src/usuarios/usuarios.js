const { ipcRenderer } = require("electron");
const sweet = require('sweetalert2');
let idSeleccionado;

const listarUsuarios = document.querySelector('.listarUsuarios');

const nombre = document.querySelector('#nombre');
const codigo = document.querySelector('#codigo');
const acceso = document.querySelector('#acceso');
const empresa = document.querySelector('#empresa');

const guardar = document.querySelector('#guardar');
const eliminar = document.querySelector('.eliminar');
const enviar = document.querySelector('#enviar');

const axios = require("axios");
const { verificarUsuarios, configAxios } = require("../funciones");
require("dotenv").config;
const URL = process.env.URL;

enviar.addEventListener('click', async e =>{
    const Usuario = {
        _id: codigo.value,
        nombre: nombre.value.toUpperCase(),
        acceso: acceso.value,
        empresa:empresa.value
    }
    await axios.post(`${URL}usuarios`,Usuario,configAxios);
    location.reload();
})

let usuarios;

window.addEventListener('load', async e=>{
    const usuario = await verificarUsuarios();
    console.log(usuario)
    permiso = usuario.acceso;
    console.log(permiso)
    if (usuario === "") {
        await sweet.fire({
            title:"Contraseña incorrecta"
        });
        location.reload();
    }else if(!usuario){
        window.close();
    }
    

    usuarios = (await axios.get(`${URL}usuarios`,configAxios)).data;
    listar(usuarios)
})

const listar = (lista)=>{
    for(let usuario of usuarios){
        listarUsuarios.innerHTML += `
            <li class="listaUsuario text-center">
                <div class="vendedor" id="${usuario._id}">
                    <h3 class="nombreUsuario">${usuario.nombre}</h3>
                </div>
            </li>
        `
    }
    listarUsuarios.innerHTML += `
        <li class="agregar">
            <div class="vendedor ">
                <h3 class="nombreUsuario">+Agregar</h3>
            </div>
        </li>
    `
};

const lista = document.querySelector('.listarUsuarios')
lista.addEventListener('click',e=>{
    if (e.target.nodeName === "H3" && e.target.parentNode.parentNode.className === "agregar") {
        enviar.classList.remove('none');
        guardar.classList.add('none');
        eliminar.classList.add('none');
        nombre.value = "";
        codigo.value = "";
        acceso.value = "";
        empresa.value = "";
        codigo.removeAttribute("disabled");
        nombre.focus();
    }else if(e.target.nodeName === "H3"){
        idSeleccionado = e.target.parentNode.id;
        (permiso === "0") ? ponerValoresInputs(idSeleccionado) : sweet.fire({title:"No tiene permisos para interactuar"});
        (permiso === "0") && guardar.classList.remove('none');
        (permiso === "0") && eliminar.classList.remove('none');
        (permiso === "0") && enviar.classList.add('none');
        codigo.setAttribute('disabled','');
    }else if(e.target.nodeName === "LI"){
        idSeleccionado = e.target.children[0].id;
        (permiso === "0") ? ponerValoresInputs(idSeleccionado) : sweet.fire({title:"No tiene permisos para interactuar"});
        (permiso === "0") && guardar.classList.remove('none');
        (permiso === "0") && eliminar.classList.remove('none');
        (permiso === "0") && enviar.classList.add('none');
        codigo.setAttribute('disabled','');
    }
})

const ponerValoresInputs = (id)=>{
    usuarios.find(usuario => {
        if (usuario._id === id) {
            nombre.value = usuario.nombre
            codigo.value = usuario._id
            acceso.value = usuario.acceso
            empresa.value = usuario.empresa
        }
    })
}

guardar.addEventListener('click',async e=>{
    const nuevoUsuario = {
        nombre:nombre.value.toUpperCase(),
        _id:codigo.value,
        acceso:acceso.value,
        empresa:empresa.value
    };
    await axios.put(`${URL}usuarios/${nuevoUsuario._id}`,nuevoUsuario,configAxios);
    location.reload();
})

eliminar.addEventListener('click',async e=>{
    await axios.delete(`${URL}usuarios/${idSeleccionado}`,configAxios);
    location.reload();
});

nombre.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        if (codigo.getAttributeNames().includes('disabled')) {
            acceso.focus();
        }else{
            codigo.focus();
        }
    }
});

codigo.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        acceso.focus();
    }
});

acceso.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        empresa.focus();
    }
});

empresa.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        if (guardar.classList.contains('none')) {
            enviar.focus();
        }else{
            guardar.focus();
        }
    }
});

nombre.addEventListener('focus',e=>{
    nombre.select();
});

codigo.addEventListener('focus',e=>{
    codigo.select();
});

acceso.addEventListener('focus',e=>{
    acceso.select();
});

empresa.addEventListener('focus',e=>{
    empresa.select();
});

document.addEventListener('keyup',e=>{
    if (e.key === "Escape") {

        window.close()
    }
});