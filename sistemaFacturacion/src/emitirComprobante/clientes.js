const {ipcRenderer} = require('electron');
const sweet = require('sweetalert2');
const axios = require('axios');
const { copiar, recorrerFlechas, configAxios } = require('../funciones');
require('dotenv').config;
const URL = process.env.URL;


const buscarCliente = document.querySelector('#buscarCliente');
const resultado = document.querySelector('#resultado');
const body = document.querySelector('body');
const tbody = document.querySelector("tbody");

let texto;
let seleccionado;
let subSeleccionado;

window.addEventListener('load',e=>{
    filtrar();
    copiar();
});

body.addEventListener('keypress',e=>{
    seleccionado = document.querySelector('.seleccionado')
    if (e.key === 'Enter') {
        ipcRenderer.send('mando-el-cliente',seleccionado.id);
        window.close();
     }
})


const listar = async(texto) =>{
    //traemos a los clientes
    texto === "" && (texto = "A Consumidor Final")
    let clientes = (await axios.get(`${URL}clientes/${texto}`,configAxios)).data;
    
    //ordenamos el arreglo de clientes
    clientes = clientes.sort(function(a,b){
        let A = a.cliente.toUpperCase()
        let B = b.cliente.toUpperCase()

        if (A<B) {
            return -1;
        }
        if (A>B) {
            return 1;
        }

        return 0
    })
    
    for(let cliente of clientes){
        const tr = document.createElement('tr');
        tr.id = cliente._id;

        const tdCodigo = document.createElement('td');
        const thNombre= document.createElement('th');
        const tdLocalidad = document.createElement('td');
        const tdDireccion = document.createElement('td');
        const tdTelefono = document.createElement('td');
        const tdCondIva = document.createElement('td');
        const tdCuit = document.createElement('td');
        const tdSaldo = document.createElement('td');

        tdCodigo.innerHTML = cliente._id;
        thNombre.innerHTML = cliente.cliente;
        tdLocalidad.innerHTML = cliente.localidad;
        tdDireccion.innerHTML = cliente.direccion;
        tdTelefono.innerHTML = cliente.telefono;
        tdCondIva.innerHTML = cliente.cond_iva;
        tdCuit.innerHTML = cliente.cuit;
        tdSaldo.innerHTML = cliente.saldo;

        tr.appendChild(tdCodigo);
        tr.appendChild(thNombre);
        tr.appendChild(tdLocalidad);
        tr.appendChild(tdDireccion);
        tr.appendChild(tdTelefono);
        tr.appendChild(tdCondIva);
        tr.appendChild(tdCuit);
        tr.appendChild(tdSaldo);

        resultado.appendChild(tr);
    }

    seleccionado = resultado.firstElementChild;
    seleccionado.classList.add('seleccionado');
    subSeleccionado = resultado.firstElementChild.children[0];
    subSeleccionado.classList.add('subSeleccionado');
}

//compramaos si en el input de buscar el texto que escribimos es igual al nombre de algun cliente
const filtrar = ()=>{
    resultado.innerHTML='';
    texto = buscarCliente.value.toLowerCase();
    listar(texto);
}

let seleccionarTBody = document.querySelector('tbody');
seleccionarTBody.addEventListener('dblclick',  (e) =>{
        ipcRenderer.send('mando-el-cliente',e.path[1].id);
        window.close()
})

buscarCliente.addEventListener('keyup',e=>{
    if (e.keyCode === 40) {
        resultado.focus();
        buscarCliente.blur();
    }else{
        filtrar();
    }
})


tbody.addEventListener('click',e =>{
   seleccionado = document.querySelector('.seleccionado');
   subSeleccionado = document.querySelector('.subSeleccionado');

   seleccionado && seleccionado.classList.remove('seleccionado');
   seleccionado = (e.target.nodeName === "TD" || e.target.nodeName === "TH" ) ? e.target.parentNode : e.target;
   seleccionado.classList.add('seleccionado');
   subSeleccionado && subSeleccionado.classList.remove('subSeleccionado');
   subSeleccionado = e.target;
   subSeleccionado.classList.add('subSeleccionado')
});

document.addEventListener('keyup',async e=>{
    if (e.key === "Escape") {
        window.close();
    }
    subSeleccionado = await recorrerFlechas(e);
    seleccionado = subSeleccionado && subSeleccionado.parentNode;
    subSeleccionado && subSeleccionado.scrollIntoView({
        block:"center",
        inline:'center',
        behavior:"smooth"
      });
});