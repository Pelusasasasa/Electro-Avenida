const {ipcRenderer} = require('electron');

const axios = require('axios');
require('dotenv').config
const URL = process.env.URL;

const sweet = require('sweetalert2');
const { copiar, recorrerFlechas, configAxios} = require('../funciones');

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
};

const acceso = getParameterByName("acceso");

const buscarCliente = document.querySelector('#buscarCliente')
const resultado = document.querySelector('#resultado')

const modificar = document.querySelector('.modificar');
const eliminar = document.querySelector('.eliminar');

acceso !== "0" && eliminar.classList.add('none') ;

let clientes;
let seleccionado;
let subSeleccionado;

window.addEventListener('load',e=>{
    filtrar();
    copiar();
    
})

const ponerClientes = (clientes) =>{
    //ordenamos los clientes por nombre
    clientes.sort((a,b)=>{
        if(a.cliente<b.cliente){
            return -1
        }
        if (a.cliente>b.cliente) {
            return 1
        }
        return 0
    });

    for(let cliente of clientes){
        let nombre = cliente.cliente.toLowerCase();
        texto = texto[0] === "*" ? texto.substr(1) : texto;
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

    subSeleccionado = seleccionado.children[0];
    subSeleccionado.classList.add('subSeleccionado')

}


//compramaos si en el input de buscar el texto que escribimos es igual al nombre de algun cliente
const filtrar = async ()=>{
    resultado.innerHTML='';
    texto = buscarCliente.value.toLowerCase();
    texto = texto === "" ? "a consumidor final" : texto;
    let clientes = await axios.get(`${URL}clientes/${texto}`,configAxios);
    clientes = clientes.data;
    ponerClientes(clientes)
}

buscarCliente.addEventListener('keyup',e=>{
    if (e.keyCode === 40) {
        resultado.focus();
        buscarCliente.blur();
    }else{
        filtrar();
    }
});

resultado.addEventListener('click',e =>{
    seleccionado = document.querySelector('.seleccionado');
    subSeleccionado = document.querySelector('.subSeleccionado');

    seleccionado && (seleccionado.classList.remove('seleccionado'));
    seleccionado = (e.target.nodeName === "TD" || e.target.nodeName === "TH") ? e.target.parentNode : e.target;
    seleccionado.classList.add('seleccionado');
    
    subSeleccionado && (subSeleccionado.classList.remove('subSeleccionado'));
    subSeleccionado = (e.target.nodeName === "TD" || e.target.nodeName === "TH" )? e.target : e.target.children[0]; 
    subSeleccionado.classList.add('subSeleccionado');
})

const agregar = document.querySelector('.agregar')
agregar.addEventListener('click',e=>{
    ipcRenderer.send('abrir-ventana-agregar-cliente')
});

modificar.addEventListener('click',async () =>{
    seleccionado = document.querySelector('.seleccionado');
    if (seleccionado) {
        ipcRenderer.send('abrir-ventana-modificar-cliente',[seleccionado.id,acceso])
    }else{
        await sweet.fire({
            title:"Cliente no Seleccionado",
            returnFocus:false
        });
        buscarCliente.focus()
    }
});

eliminar.addEventListener('click',async e=>{
    const clienteEliminar = document.querySelector('.seleccionado')
    if (clienteEliminar ) {
        const cliente = clienteEliminar.children[1].innerHTML;
        await sweet.fire({
            title:"Eliminar Cliente " + cliente,
            showCancelButton:true,
            confirmButtonText:"Aceptar"
        }).then(async ({isConfirmed})=>{
            if (isConfirmed) {
                await axios.delete(`${URL}clientes/${clienteEliminar.id}`,configAxios);
                location.reload()    
            }
        })
    }else{
        await sweet.fire({
            title:"Cliente no Seleccionado",
            returnFocus:false
        });

        buscarCliente.select();
        buscarCliente.focus();
    }
})

const salir = document.querySelector('.salir');
salir.addEventListener('click',e=>{
    location.href = '../index.html'; 
});


document.addEventListener('keyup',async e=>{
    if (e.key === "Escape") {
        location.href = '../index.html';
    }
    subSeleccionado = await recorrerFlechas(e);
    seleccionado = subSeleccionado && subSeleccionado.parentNode;
    subSeleccionado && subSeleccionado.scrollIntoView({
        block:"center",
        inline:'center',
        behavior:"smooth"
      });
});
