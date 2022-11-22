const sweet = require('sweetalert2');
const { ipcRenderer } = require("electron");

const axios = require("axios");
const { copiar, recorrerFlechas } = require('../funciones');
require('dotenv').config();
const URL = process.env.URL;


const resultado = document.querySelector('#resultado');
const select = document.querySelector('#seleccion');
const buscarProducto = document.querySelector('#buscarProducto');
const body = document.querySelector('body');


let productos = '';
let subSeleccionado;
let texto = "";
let seleccionado;

window.addEventListener('load',e=>{
    filtrar();
    copiar();
})


body.addEventListener('keydown',e=>{
    if (e.key === 'Enter') {
        //tomamos el tr que este seleccionado
        seleccionado = document.querySelector('.seleccionado');
        e.preventDefault();
        if(seleccionado){
            cantidad(seleccionado)
        }else{
            sweet.fire({title:"Producto no seleccionado"});
            document.querySelector('.ok').focus()
        } ; 
}});


//si la tecla es escape se cierra la pagina
body.addEventListener('keyup',async e=>{
    if (e.key === "Escape") {
        window.close()
    }
    subSeleccionado = await recorrerFlechas(e);
    seleccionado = subSeleccionado && subSeleccionado.parentNode;

    subSeleccionado && subSeleccionado.scrollIntoView({
        block:"center",
        inline:'center',
        behavior:"smooth"
      });
});

async function filtrar(){
    resultado.innerHTML = '';
    texto = buscarProducto.value.toLowerCase();
    if(texto !== ""){ 
        let condicion = select.value;
        condicion === "codigo" && (condicion = "_id")
        productos = (await axios.get(`${URL}productos/buscarProducto/${texto}/${condicion}`)).data
    }else{
        productos = (await axios.get(`${URL}productos/buscarProducto/textoVacio/descripcion`)).data
    }

    for(let producto of productos){
        const tr = document.createElement('tr');
        tr.id = producto._id;

        const thCodigo =  document.createElement('th');
        const tdDescripcion =  document.createElement('td');
        const tdPrecio =  document.createElement('td');
        const tdMarca =  document.createElement('td');
        const tdStock =  document.createElement('td');
        const tdFabrica =  document.createElement('td');
        const tdObservaciones = document.createElement('td');

        tdDescripcion.classList.add('descripcion')

        thCodigo.innerHTML = producto._id;
        tdDescripcion.innerHTML = producto.descripcion;
        tdPrecio.innerHTML = parseFloat(producto.precio_venta).toFixed(2);
        tdMarca.innerHTML = producto.marca;
        tdStock.innerHTML = parseFloat(producto.stock).toFixed(2);
        tdFabrica.innerHTML = producto.cod_fabrica;
        tdObservaciones.innerHTML = producto.observacion

        tr.appendChild(thCodigo);
        tr.appendChild(tdDescripcion);
        tr.appendChild(tdPrecio);
        tr.appendChild(tdMarca);
        tr.appendChild(tdStock);
        tr.appendChild(tdFabrica);
        tr.appendChild(tdObservaciones)

        resultado.appendChild(tr);
}
 seleccionado = seleccionarTBody.firstElementChild;
 seleccionado.classList.add('seleccionado');

 subSeleccionado = seleccionado.children[0];
 subSeleccionado.classList.add('subSeleccionado');

}

//le damos el foco a buscarProducto
select.addEventListener('keydown',(e) =>{
    if (e.keyCode === 39) {
        e.preventDefault();
        buscarProducto.focus();
    }
});


buscarProducto.addEventListener('keyup',e=>{
    if (e.keyCode === 40) {
        buscarProducto.blur();
        resultado.focus();
    }else{
        filtrar();
    }
});

let seleccionarTBody = document.querySelector('tbody')
seleccionarTBody.addEventListener('click',e=>{
    
    seleccionado = document.querySelector('.seleccionado');
    subSeleccionado = document.querySelector('.subSeleccionado');

    seleccionado && (seleccionado.classList.remove('seleccionado'));
    seleccionado = e.target.nodeName === "TD" ? e.target.parentNode : e.target;
    seleccionado.classList.add('seleccionado');

    subSeleccionado && subSeleccionado.classList.remove('subSeleccionado');
    subSeleccionado = (e.target.nodeName === "TD" || e.target.nodeName === "TH") ? e.target : e.target.children[0];
    subSeleccionado.classList.add('subSeleccionado');
})

seleccionarTBody.addEventListener('dblclick',(e) =>{
    seleccionado = document.querySelector('.seleccionado');
    seleccionado ? cantidad(seleccionado) : sweet.fire({title:"Producto no seleccionado"});
});

buscarProducto.addEventListener('keyup',e=>{
    if (e.keyCode === 37) {
        if (buscarProducto.value === "") {
            select.focus();   
        };
    }
})

async function cantidad(e) {
    sweet.fire({
        title:"Cantidad",
        input:"text",
        returnFocus:false,
        showCancelButton:true,
        confirmButtonText:"Aceptar"
    }).then(async ({isConfirmed,value})=>{
        if (isConfirmed && value !== "" && value !== ".") {
            console.log(seleccionado)
            const pro = productos.find(e=>e._id === seleccionado.id)
        if (value === undefined || value === "" || parseFloat(value) === 0) {
            await seleccionado.classList.remove('seleccionado')
            seleccionado = "";
            buscarProducto.focus()
        }else{
            if(!Number.isInteger(parseFloat(value)) && pro.unidad==="U"){
                sweet.fire({title:"El producto no se puede escribir con decimal"})
            }else{
                parseFloat(e.children[4].innerHTML)<0 && await sweet.fire({title:"Stock Negativo"});
                (parseFloat(e.children[2].innerHTML) === 0 &&  await sweet.fire({title:"Precio del producto en 0"}));
                parseFloat(e.children[4].innerHTML) === 0 && await sweet.fire({title:"Producto con stock en 0"});
               ipcRenderer.send('mando-el-producto',{
                   _id: e.id
                    ,cantidad: value
                })
                await seleccionado.classList.remove('seleccionado');
                await subSeleccionado.classList.remove('subSeleccionado');
                seleccionado = "";
                subSeleccionado = "";
                buscarProducto.value = "";
                buscarProducto.focus();
            }
        }
        }
    })
};
