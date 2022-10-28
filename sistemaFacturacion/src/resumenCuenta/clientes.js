const {ipcRenderer} = require('electron');
const axios = require('axios');
const { copiar, recorrerFlechas } = require('../funciones');
require('dotenv').config();
const URL = process.env.URL;

const body = document.querySelector('body');
const buscarCliente = document.querySelector('#buscarCliente')
const resultado = document.querySelector('#resultado')
const tbody = document.querySelector("tbody");

let clientes = [];
let seleccionado;
let subSeleccionado;

window.addEventListener('load',async e=>{
    clientes = (await axios.get(`${URL}clientes`)).data;
    listarClientes(clientes,"");

    copiar();
});

body.addEventListener('keypress',e=>{
    const seleccionado = document.querySelector('.seleccionado')
    if (e.key === 'Enter') {
        ipcRenderer.send('mando-el-cliente',seleccionado.id);
        window.close()
     }
})
let situacion = "blanco"

//filtramos los clientes si el saldo o saldo_P dependiendo de la situacion en la que estemls
const retornarClientes = (Clientes,saldo)=>{
    const retornar = Clientes.filter(cliente =>( cliente[saldo] !== "0" || cliente[saldo] !== "0.00"));
    return retornar
}


const listarClientes = async(lista,texto) =>{
    let clientes = lista.filter(elem=>{
        if (texto === "") {
            return elem
        }else{
            return ((elem.cliente.toUpperCase()).startsWith(texto.toUpperCase()));
        }
    });

    //ordenamos el arreglo por nombre
    clientes = clientes.sort(function(a,b){
        let A = a.cliente.toUpperCase();
        let B = b.cliente.toUpperCase();

        if (A<B) {
            return -1;
        }
        if (A>B) {
            return 1;
        }

        return 0
    });
    //leer donde se define la funcion para saber lo que hacer
   clientes = (situacion === "blanco") ? retornarClientes(clientes,"saldo") : retornarClientes(clientes,"saldo_p");
    for(let cliente of clientes){
        const tr = document.createElement('tr');
        tr.id = cliente._id;

        const tdId = document.createElement('td');
        const thNombre = document.createElement('th');
        const tdLocalidad = document.createElement('td');
        const tdDireccion = document.createElement('td');
        const tdTelefono = document.createElement('td');
        const tdCondIva = document.createElement('td');
        const tdCuit = document.createElement('td');
        const tdSaldo = document.createElement('td');
        
        tdId.innerHTML = cliente._id;
        thNombre.innerHTML = cliente.cliente;
        tdLocalidad.innerHTML = cliente.localidad;
        tdDireccion.innerHTML = cliente.direccion;
        tdTelefono.innerHTML = cliente.telefono;
        tdCondIva.innerHTML = cliente.cond_iva;
        tdCuit.innerHTML = cliente.cuit;
        tdSaldo.innerHTML = cliente.saldo;

        tr.appendChild(tdId);
        tr.appendChild(thNombre);
        tr.appendChild(tdLocalidad);
        tr.appendChild(tdDireccion);
        tr.appendChild(tdTelefono);
        tr.appendChild(tdCondIva);
        tr.appendChild(tdCuit);
        tr.appendChild(tdSaldo);

        resultado.appendChild(tr);
    }

    seleccionado && seleccionado.classList.remove('seleccionado');
    seleccionado = resultado.firstElementChild;
    seleccionado.classList.add('seleccionado');

    subSeleccionado && subSeleccionado.classList.remove('subSeleccionado');
    subSeleccionado = seleccionado.children[0];
    subSeleccionado.classList.add('subSeleccionado');
}


body.addEventListener('keyup',e=>{
    subSeleccionado = recorrerFlechas(e);
    seleccionado = subSeleccionado.parentNode;
});

ipcRenderer.on('situacion',async(e,args)=>{
    situacion = JSON.parse(args)
})

//compramaos si en el input de buscar el texto que escribimos es igual al nombre de algun cliente
const filtrar =async ()=>{
    resultado.innerHTML='';
    listarClientes(clientes,buscarCliente.value)
}

let seleccionarTBody = document.querySelector('tbody');
seleccionarTBody.addEventListener('dblclick',  (e) =>{
        ipcRenderer.send('mando-el-cliente',e.path[1].id);
        window.close()
})

buscarCliente.addEventListener('keyup',e=>{
    if (e.keyCode === 40) {
        buscarCliente.blur();
    }else{
        filtrar();
    }
})

//sihacemos clien el el tbody se nos selecciona un tr
tbody.addEventListener('click',e =>{
    seleccionado = document.querySelector('.seleccionado');
    subSeleccionado = document.querySelector('.subSeleccionado');

    seleccionado && seleccionado.classList.remove('seleccionado');
    seleccionado = e.target.nodeName === "TR" ? e.target : e.target.parentNode;
    seleccionado.classList.add('seleccionado');

    subSeleccionado && subSeleccionado.classList.remove('subSeleccionado');
    subSeleccionado = e.target.nodeName === "TR" ? e.target.children[0] : e.target;
    subSeleccionado.classList.add('subSeleccionado');

})

document.addEventListener('keydown',e=>{
    if (e.key === "Escape") {
        window.close();
    }
});

