const { ipcRenderer } = require("electron");
const sweet = require('sweetalert2');

const axios = require("axios");
const { configAxios } = require("../funciones");
require("dotenv").config;
const URL = process.env.URL;

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

const vendedor = getParameterByName('vendedor')
const nombre = document.querySelector("#nombre");
const numero = document.querySelector("#telefono");
const codigo = document.querySelector("#codigo");
const cantidad = document.querySelector('#cantidad');
const descripcion = document.querySelector('#descripcion')
const tbody = document.querySelector('#tbody');

const cantidadMain = document.querySelector('.cantidad');
const descripcionMain = document.querySelector('.descripcion');
const grabar = document.querySelector(".grabar");
const volver = document.getElementById("volver");


codigo.addEventListener('keypress', async (e) => {
    if (e.key === 'Enter') {
        if (codigo.value === "") {
            ipcRenderer.send('abrir-ventana',"productos");
        }else if(codigo.value === "999-999"){
            cantidadMain.classList.remove('none')
            descripcionMain.classList.remove('none')
            descripcion.focus();
        }else{
            let producto = (await axios.get(`${URL}productos/${codigo.value}`,configAxios)).data;
                if (producto !== "") {
                    sweet.fire({
                        title:"Cantidad",
                        input:"text",
                        showCancelButton:true,
                        confirmButtonText:"Aceptar"
                    }).then(async ({isConfirmed,value})=>{
                        if (isConfirmed && value !== "") {
                            await mostrarVentas(producto,value);
                            codigo.value = "";
                        }
                    })
                }else{
                    sweet.fire({title:"El producto no existe"})
                    codigo.value = ""
                }
        }
    }else if((codigo.value.length === 3 || codigo.value.length === 7) && e.key !== "-" && e.key !== "Backspace"){
        codigo.value = codigo.value + "-"
    }
})

descripcion.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
        cantidad.focus();
    }
})

cantidad.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
        const producto = {
            _id: "999-999",
            descripcion:descripcion.value,
            stock:0
        }
        const valorDeCantidad = cantidad.value === "" ? 0 : cantidad.value;
        mostrarVentas(producto,valorDeCantidad)
        cantidad.classList.add('none')
        cantidad.value = "";
        descripcion.value = "";
        descripcion.classList.add('none');
        codigo.value = "";
        codigo.focus();
    }
    
});

ipcRenderer.on('mando-el-producto',async(e,args) => {
    const {id,cantidad} = JSON.parse(args);
    const producto = (await axios.get(`${URL}productos/${id}`,configAxios)).data;
    mostrarVentas(producto,cantidad)
});

function mostrarVentas(objeto,cantidad) {
    const marca = objeto.marca ? objeto.marca : "";
    const codfabrica = objeto.cod_fabrica ? objeto.cod_fabrica : "";
    tbody.innerHTML += `
        <tr>
        <td>${objeto._id}</td>
        <td class=text-end>${parseFloat(cantidad).toFixed(2)}</td>
        <td>${objeto.descripcion}  ${marca}  ${codfabrica}</td>
        <td>${nombre.value.toUpperCase()}</td>
        <td>${numero.value}</td>
        <td class=text-end>${objeto.stock.toFixed(2)}</td>
        <td><input type:"text" class=observaciones id=${objeto._id}></td>
        <td id=eliminar>Eliminar</td>
        </tr>
    `
};

tbody.addEventListener('click',e=>{
    if (e.target.id === "eliminar") {
        tbody.removeChild(e.target.parentNode)
    }
});

grabar.addEventListener('click', async e =>{
    //Mandar Pedido a La Base de Datos
    const trs = document.querySelectorAll('#tbody tr');
    trs.forEach(async td=>{
        const Pedido = {};
        Pedido.fecha = new Date();
        Pedido.codigo = td.children[0].innerHTML;
        Pedido.cantidad = td.children[1].innerHTML; 
        Pedido.producto = td.children[2].innerHTML; 
        Pedido.cliente = td.children[3].innerHTML.toUpperCase();
        Pedido.telefono = td.children[4].innerHTML;
        Pedido.stock = td.children[5].innerHTML;
        Pedido.observacion = td.children[6].children[0].value.toUpperCase();
        Pedido.vendedor = vendedor;
        try {
            await axios.post(`${URL}pedidos`,Pedido,configAxios);
        } catch (error) {
            await sweet.fire({
                title:"No se pudo cargar el pedido"
            });
            console.log(error)
        }
    })
    window.location.href = '../index.html'
});

//al precionar enter le damos el foco a numero
nombre.addEventListener('keypress',e=>{
    if(e.key === 'Enter'){
        numero.focus()
    }
});

//al precionar enter le damos el foco a codigo
numero.addEventListener('keypress',e=>{
    if(e.key === 'Enter'){
        codigo.focus()
    }
});

volver.addEventListener('click',e=>{
    location.href = '../index.html';
});


document.addEventListener('keydown',e=>{
    if(e.key === "Escape"){
        location.href = '../index.html';
    }
});