const { ipcRenderer } = require("electron");
const sweet = require('sweetalert2');

const axios = require("axios");
const { copiar, recorrerFlechas, configAxios, verNombrePc } = require("../funciones");
require('dotenv').config();
const URL = process.env.URL;

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
//saber que pribilegios tiene los usuarios
const acceso = getParameterByName('acceso');
const vendedor = getParameterByName('vendedor');

const resultado = document.querySelector('#resultado');
const select = document.querySelector('#seleccion');
const buscarProducto = document.querySelector('#buscarProducto');
const imagen = document.querySelector('.imagen');
const modificar = document.querySelector('.modificar');
const movimiento = document.querySelector('.movimiento');
const ingresarMov = document.querySelector('.ingresar')
const agregarProducto = document.querySelector('.agregarProducto');
const eliminar = document.querySelector('.eliminar');
const volver = document.querySelector('.volver');
const seccionImagenGrande = document.querySelector('.imagenGrande');
let seleccionarTBody = document.querySelector('tbody');

let texto = "";
let seleccionado = "";
let subSeleccion;
const body = document.querySelector('body');

if (acceso === "2" || acceso === "1") {
    eliminar.classList.add('none')
}


window.addEventListener('load',e=>{
    filtrar();
    copiar();
});

body.addEventListener('keyup',async e=>{
    subSeleccion = await recorrerFlechas(e);
    seleccionado = subSeleccion && subSeleccion.parentNode;
    subSeleccion && subSeleccion.scrollIntoView({
        block:"center",
        inline:'center',
        behavior:"smooth"
      });
});

ipcRenderer.on('productoModificado',(e,args)=>{
    const producto = JSON.parse(args);
    const tr = document.getElementById(`${producto._id}`)
    const aux = tr.children;
    aux[1].innerHTML = producto.descripcion;
    aux[2].innerHTML = producto.oferta 
    ? `<p class=oferta>
        <span>${producto.precioOferta.toFixed(2)}</span>
        <span>${producto.precio_venta}</span>
       </p>
    `
    : producto.precio_venta;
    aux[3].innerHTML = producto.marca;
    aux[4].innerHTML = producto.stock;
    aux[5].innerHTML = producto.cod_fabrica;
    aux[6].innerHTML = producto.observacion;
});


//Lo que hacemos es cuando se hace click en la tabla se le agrega una clase que dice que el foco lo tiene la tabla o no
const table = document.querySelector('.m-0')
window.addEventListener('click',e=>{
    if (table.contains(e.target)) {
        table.classList.add('tablaFocus')
    }else{
        table.classList.remove('tablaFocus')
    }
})

const ponerProductos = productos =>{
    resultado.innerHTML = '';
    for(let producto of productos){
        const tr = document.createElement('tr');

        const tdId = document.createElement('td');
        const tdDscripcion = document.createElement('td');
        const tdPrecio = document.createElement('td');
        const tdMarca = document.createElement('td');
        const tdStock = document.createElement('td');
        const tdcodFabrica = document.createElement('td');
        const tdObservacion = document.createElement('td');

        tdPrecio.classList.add('text-end');
        tdStock.classList.add('text-end');
        tdcodFabrica.classList.add('text-end');

        tdId.innerHTML = producto._id;
        tdDscripcion.innerHTML = producto.descripcion;
        // PLAFON CUBETO 1 LUZ G9 WENGUE
        tdPrecio.innerHTML = producto.oferta 
        ? ` <p class=oferta>
                <span>${producto.precioOferta}</span>
                <span>${producto.precio_venta}</span>
            </p>` 
        : producto.precio_venta;
        tdMarca.innerHTML = producto.marca;
        tdStock.innerHTML = parseFloat(producto.stock).toFixed(2);
        tdcodFabrica.innerHTML = producto.cod_fabrica;
        tdObservacion.innerHTML = producto.observacion;

        tr.appendChild(tdId);
        tr.appendChild(tdDscripcion);
        tr.appendChild(tdPrecio);
        tr.appendChild(tdMarca);
        tr.appendChild(tdStock);
        tr.appendChild(tdcodFabrica);
        tr.appendChild(tdObservacion);

        tr.id = producto._id;
        
        //resultado es el tbody
        resultado.appendChild(tr);

        seleccionado && seleccionado.classList.remove('seleccionado');
        seleccionado = resultado.firstElementChild;
        seleccionado.classList.add('seleccionado');

        subSeleccion && subSeleccion.classList.remove('subSeleccionado');
        subSeleccion = seleccionado.children[0];
        subSeleccion.classList.add('subSeleccionado');
    }
};

buscarProducto.addEventListener('keydown',e=>{
    if (e.key === "ArrowLeft" && buscarProducto.value === "") {
        select.focus();
    }else if(e.keyCode === 40){
        buscarProducto.blur();
    }
});

imagen.addEventListener('click',mostrarImagenGrande);

//Hacemos que se seleccione un producto
seleccionarTBody.addEventListener('click',(e) =>{

    seleccionado && seleccionado.classList.remove('seleccionado');
    subSeleccion && subSeleccion.classList.remove('subSeleccionado');

    if (e.target.nodeName === "TD") {
        seleccionado = e.target.parentNode;
        subSeleccion = e.target;
    };

    seleccionado.classList.add('seleccionado')
    subSeleccion.classList.add('subSeleccionado');

    //mostrar imagen
    seleccionado && mostrarImagen(seleccionado.id)
})

async function mostrarImagen(id) {
        const producto = (await axios.get(`${URL}productos/${id}`)).data;
        if (producto) {
            const path = `${URL}productos/${producto._id}/image`;
            imagen.innerHTML = `<img id=${path} class="imagenProducto" src=${path}>`;
        }
};

ipcRenderer.once('Historial',async(e,args)=>{
    const [textoA,seleccionA] = JSON.parse(args)
    buscarProducto.value = await textoA;
    select.value = await seleccionA;
    filtrar()
})

buscarProducto.addEventListener('keyup',filtrar);
buscarProducto.addEventListener('keypress',e=>{
    if (buscarProducto.value.length === 3 && e.key !== "-" && select.value === "codigo") {
        buscarProducto.value = buscarProducto.value + "-"
    }
});

document.addEventListener('click',noneImagenGrande);

//cuando se cambie la conidcion el codigo toma el foco
select.addEventListener('keydown',e=>{
    if(e.key === "ArrowUp" || e.key === "ArrowDown"){
        buscarProducto.focus()
    }else{
        e.preventDefault();
    }
});

volver.addEventListener('click',e=>{
    location.href = "../index.html";
});

document.addEventListener('keydown',e=>{
    if (e.key === "Escape") {
        console.log(seccionImagenGrande)
        if (!seccionImagenGrande.classList.contains('none')) {
            seccionImagenGrande.classList.add('none')
        }else{
            location.href = "../index.html";
        }
    }
});

async function filtrar(){
    //obtenemos lo que se escribe en el input
    texto = buscarProducto.value.toLowerCase();
    texto = texto.replace('/','%2F');
    let productos;
    if (texto.indexOf('/') !== -1) {
        const posicionBarra = texto.indexOf('/');
        let nuevoTexto = texto.replace('/',"ALT47");    
        let condicion = select.value;
        condicion === "codigo" && (condicion = "_id")
        productos = await axios.get(`${URL}productos/buscarProducto/${nuevoTexto}/${condicion}`,configAxios)
    }else if(texto !== ""){ 
        let condicion = select.value;
        condicion === "codigo" && (condicion = "_id")
        productos = await axios.get(`${URL}productos/buscarProducto/${texto}/${condicion}`,configAxios)
    }else{
        productos = await axios.get(`${URL}productos/buscarProducto/textoVacio/descripcion`,configAxios)
    }
    productos = productos.data
    
    ponerProductos(productos);
}

function mostrarImagenGrande(e) {
    seccionImagenGrande.children[0].src = e.target.id;
    seccionImagenGrande.classList.remove('none');
}

function noneImagenGrande(e) {
    if (e.target.classList.contains('imagenGrande')){
        seccionImagenGrande.classList.add('none');
    }
}

//Agregar producto
agregarProducto.addEventListener('click',e=>{
    ipcRenderer.send('abrir-ventana-agregar-producto',vendedor);
});

//modificar el producto
modificar.addEventListener('click',async e=>{
    seleccionado = document.querySelector('.seleccionado');
    if(seleccionado){
        ipcRenderer.send('abrir-ventana-modificar-producto',[seleccionado.id,acceso,texto,select.value,vendedor]);
    }else{
        await sweet.fire({
            title:'Producto no seleccionado',
            returnFocus:false
        });
        buscarProducto.focus();
    }
});

//Info Movimiento de producto
movimiento.addEventListener('click',async e=>{
    seleccionado = document.querySelector('.seleccionado');
    if (seleccionado) {
        ipcRenderer.send('abrir-ventana-info-movimiento-producto',seleccionado.id)
    }else{
        await sweet.fire({
            title:'Producto no seleccionado',
            returnFocus:false
        });
        buscarProducto.focus();
    }
});

//Ingresar movimientoProducto
ingresarMov.addEventListener('click',async e=>{
    seleccionado = document.querySelector('.seleccionado');
   if (seleccionado) {
        vendedor ?  ipcRenderer.send('abrir-ventana-movimiento-producto',[seleccionado.id,vendedor]) : sweet.fire({title:"Contraseña Incorrecta"});
   }else{
        await sweet.fire({
            title:'Producto no seleccionado',
            returnFocus:false
        });
        buscarProducto.focus();
       }
});

//Eliminar un producto
eliminar.addEventListener('click',async e=>{
    seleccionado = document.querySelector('.seleccionado');
    if (seleccionado) {
        await sweet.fire({
            title: "Eliminar Producto",
            showCancelButton:true,
            confirmButtonText:"Aceptar"
        }).then(async ({isConfirmed})=>{
            if (isConfirmed) {
                await axios.delete(`${URL}productos/${seleccionado.id}`,{data:{
                    vendedor,
                    maquina:verNombrePc(),
                    producto:seleccionado.children[1].innerText
                }},configAxios);
                resultado.removeChild(seleccionado);
                seleccionado = "";
            }
        })
    }else{
        await sweet.fire({
            title:'Producto no seleccionado',
            returnFocus:false
        });
        buscarProducto.focus();
    }

}

);