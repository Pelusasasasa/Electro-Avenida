const sweet = require('sweetalert2');
const axios = require("axios");
require("dotenv").config;
const URL = process.env.URL;

const {copiar, recorrerFlechas, redondear, botonesSalir} = require('../funciones');

const tbody = document.querySelector("tbody");
const eliminarPedido = document.querySelector('.eliminarPedido');
const salir = document.querySelector('.salir');

let arreglo;
let seleccionado;
let subSeleccionado
let inputSeleccionado;

//Mandamos a llamar a pedidos
window.addEventListener('load',async e=>{
    copiar();

    let pedidos = (await axios.get(`${URL}pedidos`)).data;

    for(let [index,pedido] of pedidos.entries()){
        let fecha = new Date(pedido.fecha)
        const stock = (pedido.stock !== undefined) ? pedido.stock : 0; 
        
        const tr = document.createElement('tr');
        tr.id = pedido._id;

        const tdFecha = document.createElement('td');
        const tdCodigo = document.createElement('td');
        const tdProducto = document.createElement('td');
        const tdCantidad = document.createElement('td');
        const tdCliente = document.createElement('td');
        const tdTelefeno = document.createElement('td');
        const tdVendedor = document.createElement('td');
        const tdStock = document.createElement('td');
        const tdEstado = document.createElement('td');
        const tdObservacion = document.createElement('td');

        const inputEstado = document.createElement('input');

        //clases
        tdCantidad.classList.add('cantidad');
        inputEstado.id = `estadoPedido${index}`
        inputEstado.setAttribute('disabled',"");
        tdStock.classList.add('stock');
        tdEstado.classList.add('estado');

        //valores
        tdFecha.innerHTML = `${fecha.getUTCDate()}/${fecha.getUTCMonth()+1}/${fecha.getUTCFullYear()}`;
        tdCodigo.innerHTML = pedido.codigo;
        tdProducto.innerHTML = pedido.producto;
        tdCantidad.innerHTML = redondear(pedido.cantidad,2);
        tdCliente.innerHTML = pedido.cliente;
        tdTelefeno.innerHTML = pedido.telefono;
        tdVendedor.innerHTML = pedido.vendedor;
        tdStock.innerHTML = redondear(stock,2);
        inputEstado.value = pedido.estadoPedido;
        tdObservacion.innerHTML = pedido.observacion;

        tdEstado.appendChild(inputEstado);

        tr.appendChild(tdFecha);
        tr.appendChild(tdCodigo);
        tr.appendChild(tdProducto);
        tr.appendChild(tdCantidad);
        tr.appendChild(tdCliente);
        tr.appendChild(tdTelefeno);
        tr.appendChild(tdVendedor);
        tr.appendChild(tdStock);
        tr.appendChild(tdEstado);
        tr.appendChild(tdObservacion);
        

        tbody.appendChild(tr);
    }
    seleccionado = tbody.firstElementChild;
    seleccionado.classList.add('seleccionado');

    subSeleccionado = seleccionado.children[0];
    subSeleccionado.classList.add('subSeleccionado');

    arreglo = await pedidos
});

tbody.addEventListener("click" , e=>{
    seleccionado &&  seleccionado.classList.remove('seleccionado');
    seleccionado = e.target.nodeName === "TD" ? e.target.parentNode : e.target.parentNode.parentNode;
    seleccionado.classList.add('seleccionado');

    subSeleccionado && subSeleccionado.classList.remove('subSeleccionado');
    subSeleccionado = e.target.nodeName === "TD" ? e.target : e.target.parentNode;
    subSeleccionado.classList.add('subSeleccionado');

    const identificador = seleccionado.id;
    let pedidoIdentificado = {}

    for(let pedido of arreglo){
        (pedido._id === identificador) && (pedidoIdentificado=pedido)
    }

    inputSeleccionado && inputSeleccionado.toggleAttribute('disabled');
    inputSeleccionado = seleccionado.children[8].children[0];
    inputSeleccionado.toggleAttribute('disabled');

    if (e.target.nodeName === "INPUT") {
        //pasamos el foco al input al tocar en la fila
        inputSeleccionado.focus()

        //hacemos que se seleccione todo el input
        inputSeleccionado.select();    
    }
    
    //se ejecuta cuando escribimos en el input
    inputSeleccionado.addEventListener('keyup',async e=>{
        pedidoIdentificado.estadoPedido = e.target.value;
        await axios.put(`${URL}pedidos/${pedidoIdentificado._id}`,pedidoIdentificado);
    })
});


//Eliminar un pedido
eliminarPedido.addEventListener("click", async e =>{
    seleccionado = document.querySelector('.seleccionado');
        if (seleccionado) {
            await sweet.fire({
                title:"Eliminar Pedido",
                showCancelButton:true,
                confirmButtonText:"Aceptar"
            }).then(async ({isConfirmed})=>{
                await axios.delete(`${URL}pedidos/${seleccionado.id}`);
                location.reload();
            })
        }else{
            sweet.fire({title:'Pedido no seleccionado'});
        }
});

document.addEventListener('keydown',async e=>{
    if(e.key === "Escape"){
        location.href = "../index.html";
    }
    subSeleccionado = await recorrerFlechas(e);
    seleccionado = subSeleccionado && subSeleccionado.parentNode;
    subSeleccionado && subSeleccionado.scrollIntoView({
        block:"center",
        inline:"center",
        behavior:"smooth"
    })
});

salir.addEventListener('click',e=>{
    location.href = '../index.html';
});