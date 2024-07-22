function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

const sweet = require('sweetalert2');
const axios = require("axios");
require("dotenv").config;
const URL = process.env.URL;

const {copiar, recorrerFlechas, redondear, botonesSalir, configAxios, verNombrePc} = require('../funciones');
const { ipcRenderer } = require('electron');

const thead = document.querySelector("thead");
const tbody = document.querySelector("tbody");
const eliminarPedido = document.querySelector('.eliminarPedido');
const eliminarVarios = document.getElementById('eliminarVarios');
const salir = document.querySelector('.salir');

let arreglo;
let seleccionado;
let subSeleccionado
let inputSeleccionado;
let acceso = getParameterByName('acceso');
let vendedor = getParameterByName('vendedor');
let pedidos = [];

//Mandamos a llamar a pedidos
window.addEventListener('load',async e=>{
    copiar();

    pedidos = (await axios.get(`${URL}pedidos`,configAxios)).data;

    listarPedidos(pedidos);
});

document.addEventListener('contextmenu',clickderecho);

tbody.addEventListener("click" , e=>{
    seleccionado &&  seleccionado.classList.remove('seleccionado');
    subSeleccionado && subSeleccionado.classList.remove('subSeleccionado');
    
    if (e.target.nodeName === "TD") {
        seleccionado = e.target.parentNode;
        subSeleccionado = e.target;
    }else if (e.target.nodeName === "INPUT") {
        seleccionado = e.target.parentNode.parentNode;
        subSeleccionado = e.target.parentNode;
    }

    seleccionado.classList.add('seleccionado');
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
        pedidoIdentificado.maquina = verNombrePc();
        pedidoIdentificado.vendedorQueModifico = vendedor;
        await axios.put(`${URL}pedidos/${pedidoIdentificado._id}`,pedidoIdentificado,configAxios);
    })
});

tbody.addEventListener('dblclick',async e=>{
    await sweet.fire({
        title:"Cambiar pedido",
        html:`
            <label for="cliente">Cliente</label>
            <input type="text" value="${seleccionado.children[4].innerText}" name="cliente" id="cliente"/>
            <label for="">Numero</label>
            <input type="tel" value="${seleccionado.children[5].innerText}" name="numero" id="numero"/>
        `,
        confirmButtonText:"Aceptar",
        showCancelButton:true
    }).then(async({isConfirmed})=>{
        if (isConfirmed){
            seleccionado.children[4].innerText = document.getElementById('cliente').value.toUpperCase();
            seleccionado.children[5].innerText = document.getElementById('numero').value;
            const pedido = (await axios.get(`${URL}pedidos/${seleccionado.id}`,configAxios)).data;
            pedido.cliente = seleccionado.children[4].innerText;
            pedido.telefono = seleccionado.children[5].innerText;
            pedido.maquina = verNombrePc();
            pedido.vendedorQueModifico = vendedor;
            await axios.put(`${URL}pedidos/${seleccionado.id}`,pedido,configAxios);
        }
    });
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

//Eliminar un pedido
eliminarPedido.addEventListener("click", async e =>{
    seleccionado = document.querySelector('.seleccionado');
        if (seleccionado) {
            await sweet.fire({
                title:"Eliminar Pedido",
                showCancelButton:true,
                confirmButtonText:"Aceptar"
            }).then(async ({isConfirmed})=>{
                if (isConfirmed) {
                    await axios.delete(`${URL}pedidos/${seleccionado.id}`,{data:{vendedor,maquina:verNombrePc(),pedido:seleccionado.children[2].innerText}},configAxios);
                    tbody.removeChild(seleccionado);
                    seleccionado = "";
                }
            })
        }else{
            sweet.fire({title:'Pedido no seleccionado'});
        }
});

//Eliminar Varios Pedidos
eliminarVarios.addEventListener('click',eliminarVariosPedidos);

//Nos llega que hicimos un click para seleccionar un pedido a eliminar
ipcRenderer.on('seleccionarParaEliminar',e=>{
    seleccionado.classList.add('eliminar')
});

async function eliminarVariosPedidos() {
    const pedidosAEliminar = document.querySelectorAll('.eliminar');
    await sweet.fire({
        title:"Eliminar Varios pedidos?",
        showCancelButton:true,
        confirmButtonText:"Aceptar"
    }).then(async ({isConfirmed})=>{
        if (isConfirmed) {
            for await(let elem of pedidosAEliminar){    
                await axios.delete(`${URL}pedidos/${elem.id}`,{data:{
                    vendedor,
                    maquina:verNombrePc(),
                    pedido:elem.children[2].innerText
                }},configAxios);
                tbody.removeChild(elem);
            }
        }
    })
};

function clickderecho(e) {
    const cordenadas = {
        x: e.clientX,
        y:e.clientY,
        ventana:"VerPedidos"
    };

    ipcRenderer.send('mostrar-menu',cordenadas);
    
    seleccionado.classList.remove('seleccionado');
    subSeleccionado.classList.remove('subSeleccionado');

    if (e.target.nodeName === "TD") {
        subSeleccionado = e.target
        seleccionado = e.target.parentNode;
    }

    seleccionado.classList.add('seleccionado');
    subSeleccionado.classList.add('subSeleccionado')

};

const OrdenarPedidos = (e) => {
    if (e.target.parentNode.id === "cliente") {
        if (document.getElementById('flechaArribaCliente').classList.contains('none')) {
                document.getElementById('flechaAbajoCliente').classList.add('none')
                document.getElementById('flechaArribaCliente').classList.remove('none')

                pedidos.sort((a,b) => {
                    if (a.cliente > b.cliente) {
                        return 1;
                    }else if(a.cliente < b.cliente){
                        return -1;
                    };
                        return 0;
                });

        }else if(document.getElementById('flechaAbajoCliente').classList.contains('none')){
                document.getElementById('flechaAbajoCliente').classList.remove('none')
                document.getElementById('flechaArribaCliente').classList.add('none')

                pedidos.sort((a,b) => {
                    if (a.cliente > b.cliente) {
                        return -1;
                    }else if(a.cliente < b.cliente){
                        return 1;
                    };
                    return 0;
                });
        };
    };

    if (e.target.parentNode.id === "provedor") {
        if (document.getElementById('flechaArribaProvedor').classList.contains('none')) {
                document.getElementById('flechaAbajoProvedor').classList.add('none')
                document.getElementById('flechaArribaProvedor').classList.remove('none')

                pedidos.sort((a,b) => {
                    if (a.provedor > b.provedor) {
                        return 1;
                    }else if(a.provedor < b.provedor){
                        return -1;
                    };
                        return 0;
                });

        }else if(document.getElementById('flechaAbajoProvedor').classList.contains('none')){
                document.getElementById('flechaAbajoProvedor').classList.remove('none')
                document.getElementById('flechaArribaProvedor').classList.add('none')

                pedidos.sort((a,b) => {
                    if (a.provedor > b.provedor) {
                        return -1;
                    }else if(a.provedor < b.provedor){
                        return 1;
                    };
                    return 0;
                });
        };
    };

    if (e.target.parentNode.id === "marca") {
        if (document.getElementById('flechaArribaMarca').classList.contains('none')) {
                document.getElementById('flechaAbajoMarca').classList.add('none')
                document.getElementById('flechaArribaMarca').classList.remove('none')

                pedidos.sort((a,b) => {
                    if (a.marca > b.marca) {
                        return 1;
                    }else if(a.marca < b.marca){
                        return -1;
                    };
                        return 0;
                });

        }else if(document.getElementById('flechaAbajoMarca').classList.contains('none')){
                document.getElementById('flechaAbajoMarca').classList.remove('none')
                document.getElementById('flechaArribaMarca').classList.add('none')

                pedidos.sort((a,b) => {
                    if (a.marca > b.marca) {
                        return -1;
                    }else if(a.marca < b.marca){
                        return 1;
                    };
                    return 0;
                });
        };
    };

    tbody.innerHTML = "";
    listarPedidos(pedidos);
};

function listarPedidos(pedidos){
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
        const tdMarca = document.createElement('td');
        const tdProvedor = document.createElement('td');
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
        tdMarca.innerText = pedido.marca ? pedido.marca : "";
        tdProvedor.innerText = pedido.provedor ? pedido.provedor : "";
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
        tr.appendChild(tdMarca);
        tr.appendChild(tdProvedor);
        tr.appendChild(tdStock);
        tr.appendChild(tdObservacion);
        tr.appendChild(tdEstado);
        

        tbody.appendChild(tr);
    }
    seleccionado = tbody.firstElementChild;
    seleccionado.classList.add('seleccionado');

    subSeleccionado = seleccionado.children[0];
    subSeleccionado.classList.add('subSeleccionado');

    arreglo = pedidos;
};

thead.addEventListener('click',OrdenarPedidos);

salir.addEventListener('click',e=>{
    location.href = '../index.html';
});