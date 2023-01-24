const axios = require('axios');
const { redondear, cerrarVentana } = require('../assets/js/globales');
require('dotenv').config();
const URL = process.env.URL;

const sweet = require('sweetalert2');
const { ipcRenderer } = require('electron/renderer');

const tbody = document.querySelector('tbody');

const efectivo = document.getElementById('efectivo');
const cheque = document.getElementById('cheque');
const tarjeta = document.getElementById('tarjeta');

const total = document.getElementById('total');
const cobrado = document.getElementById('cobrado');
const descuento = document.getElementById('descuento');

const aceptar = document.getElementById('aceptar');
const salir = document.getElementById('salir');

let seleccionado;
let subSeleccionado;
let movimientos;

window.addEventListener('load',async e=>{
    cerrarVentana();
    movimientos = (await axios.get(`${URL}movCajas/forPased`)).data;
    listar(movimientos);
});

const listar = async(lista)=>{
    
    for await(let elem of lista){
        const tr = document.createElement('tr');
        tr.id = elem._id;

        const tdFecha = document.createElement('td');
        const tdCodigo = document.createElement('td');
        const tdCliente = document.createElement('td');
        const tdComprob = document.createElement('td');
        const tdNumero = document.createElement('td');
        const tdImporte = document.createElement('td');
        const tdVendedor = document.createElement('td');

        const fecha = elem.fecha.slice(0,10).split('-',3);
        tdFecha.innerHTML = `${fecha[2]}/${fecha[1]}/${fecha[0]}`;
        tdCodigo.innerHTML = elem.codigo;
        tdCliente.innerHTML = elem.cliente;
        tdComprob.innerHTML = elem.cuenta;
        tdNumero.innerHTML = elem.nro_comp;
        tdImporte.innerHTML = elem.imp;
        tdVendedor.innerHTML = elem.vendedor

        tdImporte.classList.add('text-right')

        tr.appendChild(tdFecha);
        tr.appendChild(tdCodigo);
        tr.appendChild(tdCliente);
        tr.appendChild(tdComprob);
        tr.appendChild(tdNumero);
        tr.appendChild(tdImporte);
        tr.appendChild(tdVendedor);


        tbody.appendChild(tr);
    }
};

tbody.addEventListener('click',e=>{

    seleccionado && seleccionado.classList.remove('seleccionado');
    subSeleccionado && subSeleccionado.classList.remove('subSeleccionado');

    seleccionado = e.target.parentNode;
    subSeleccionado = e.target;

    seleccionado.classList.add('seleccionado');
    subSeleccionado.classList.add('subSeleccionado');
});

aceptar.addEventListener('click',async e=>{
    const movimiento = movimientos.find(mov=>mov._id === seleccionado.id);

    if (parseFloat(descuento.value) !== 0) {
        const mov = {};
        mov.tMov = "E";
        mov.fecha = new Date();
        mov.nro_comp = movimiento.nro_comp;
        mov.desc = "DESCUENTO " + movimiento.cliente;
        mov.idCuenta = "DE";
        mov.pasado = true;
        mov.imp = redondear(-1 * parseFloat(descuento.value),2);
        mov.cuenta = "DESCUENTO";
        mov.vendedor = movimiento.vendedor;
        mov.codigo = movimiento.codigo;
        mov.cliente = movimiento.cliente;

        try {
            await axios.post(`${URL}movCajas`,mov);
        } catch (error) {
            console.log(error);
            await sweet.fire({
                title:"No se pudo cargar el descuento en caja"
            })
            
        };
    };

    movimiento.pasado = true;
    try {
        await axios.put(`${URL}movCajas/id/${movimiento._id}`,movimiento);
        tbody.removeChild(seleccionado);
        total.value = "0.00";
        cobrado.value = "0.00";
        descuento.value = "0.00";

    } catch (error) {
        await sweet.fire({
            title:"No se pudo cargar la factura"
        });
        console.log(error)
    };
});

efectivo.addEventListener('click',e=>{
    total.value = seleccionado.children[5].innerHTML;
    cobrado.focus();
});

tarjeta.addEventListener('click',e=>{
    ipcRenderer.send('abrir-ventana',{
        path:"tarjetas/agregarTarjeta.html",
        width:500,
        height:400,
        cerrarVentana:true
    });
});

cobrado.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        if (parseFloat(cobrado.value) !== parseFloat(total.value)) {
            descuento.value = redondear(parseFloat(cobrado.value) - parseFloat(total.value),2);
        }
        descuento.focus();
    }
});

descuento.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
       aceptar.focus();
    }
});

cobrado.addEventListener('focus',e=>{
    cobrado.select();
});

descuento.addEventListener('focus',e=>{
    descuento.select();
});


ipcRenderer.on('recibir-informacion',(e,args)=>{
    if(args === "tarjeta cargada"){
        aceptar.click();
    }
})