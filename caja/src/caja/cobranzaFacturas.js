const axios = require('axios');
const { redondear, cerrarVentana, configAxios } = require('../assets/js/globales');
require('dotenv').config();
const URL = process.env.URL;

const sweet = require('sweetalert2');
const { ipcRenderer } = require('electron/renderer');

const tbody = document.querySelector('tbody');

const efectivo = document.getElementById('efectivo');
const cheque = document.getElementById('cheque');
const tarjeta = document.getElementById('tarjeta');
const transferencia = document.getElementById('transferencia');

const total = document.getElementById('total');
const cobrado = document.getElementById('cobrado');
const descuento = document.getElementById('descuento');

const aceptar = document.getElementById('aceptar');
const salir = document.getElementById('salir');

let seleccionado;
let subSeleccionado;
let movimientos;

setInterval(async () => {
    let movimientosAux = (await axios.get(`${URL}movCajas/forPased`,configAxios)).data;

    if (movimientos.length > movimientosAux.length) {
      listar(movimientosAux);
      movimientos = movimientosAux;
    };

    if (movimientos.length !== movimientosAux.length && movimientos.length < movimientosAux.length) {
        listarUltimoMovimiento(movimientosAux[movimientosAux.length - 1]);
        movimientos.push(movimientosAux[movimientosAux.length - 1]);
    }
}, 2000);

window.addEventListener('load',async e=>{  
    movimientos = (await axios.get(`${URL}movCajas/forPased`,configAxios)).data;
    listar(movimientos);
});

const listar = async(lista)=>{
    tbody.innerHTML = "";
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
        tdImporte.innerHTML = elem.imp.toFixed(2);
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

    if (parseFloat(descuento.value) !== 0 && descuento.value) {
        const mov = {};
        mov.tMov = "E";
        mov.fecha = new Date();
        mov.nro_comp = movimiento.nro_comp;
        mov.desc = "DESCUENTO " + movimiento.cliente;
        mov.idCuenta = "DES";
        mov.pasado = true;
        mov.imp = redondear(-1 * parseFloat(descuento.value),2);
        mov.cuenta = "DESCUENTO";
        mov.vendedor = movimiento.vendedor;
        mov.codigo = movimiento.codigo;
        mov.cliente = movimiento.cliente;

        try {
            await axios.post(`${URL}movCajas`,mov,configAxios);
        } catch (error) {
            console.log(error);
            await sweet.fire({
                title:"No se pudo cargar el descuento en caja"
            })
            
        };
    };

    movimiento.pasado = true;
    const now = new Date();
    const p = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString();
    movimiento.fecha = p;
    try {
        await axios.put(`${URL}movCajas/id/${movimiento._id}`,movimiento,configAxios);
        movimientos = movimientos.filter(mov => mov._id !== seleccionado.id);
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
    cobrado.value = total.value;
    cobrado.focus();
});

tarjeta.addEventListener('click',e=>{
    ipcRenderer.send('abrir-ventana',{
        path:"tarjetas/agregarTarjeta.html",
        width:500,
        height:600,
        cerrarVentana:true,
        informacionAgregar:{
            cliente:seleccionado.children[2].innerHTML,
            vendedor:seleccionado.children[6].innerHTML,
            imp:parseFloat(seleccionado.children[5].innerHTML)
        }
    });
});

cheque.addEventListener('click',e=>{
    ipcRenderer.send('abrir-ventana',{
        path:"cheques/agregar-modificarCheques.html",
        width:500,
        height:600,
        cerrarVentana:true,
        informacionAgregar:{
            cliente:seleccionado.children[2].innerText,
            vendedor:seleccionado.children[6].innerText,
            imp:parseFloat(seleccionado.children[5].innerText)
        }
    });
});

transferencia.addEventListener('click',async e=>{
    const egreso = {}
    egreso.tMov = 'E';
    egreso.fecha = new Date();
    egreso.nro_comp = seleccionado.children[4].innerText;
    egreso.desc = "DEPOSITO BANCO DE ENTRE RIOS";
    egreso.idCuenta = "DEP";
    egreso.pasado = true;
    const {value} = await sweet.fire({
        title:"Importe",
        input:"text",
        inputValue:seleccionado.children[5].innerText,
        confirmButtonText:"Aceptar"
    });
    egreso.imp = value;
    egreso.cuenta = "DEPOSITO BANCO DE ENTRE RIOS";
    egreso.vendedor = seleccionado.children[6].innerText;
    egreso.codigo = seleccionado.children[1].innerText;
    egreso.cliente = seleccionado.children[2].innerText;

    try {
        await axios.post(`${URL}movCajas`,egreso,configAxios);
    } catch (error) {
        console.log(error);
        await sweet.fire({
            title:"No se pudo cargar el descuento en caja"
    });    
    };

    aceptar.click();
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
    if(args.tipo === "Tarjeta"){
        aceptar.click();
    }else if(args === "Cheque cargado"){
        aceptar.click();
    }
});

salir.addEventListener('click',e=>{
    location.href = '../index.html'
});

document.addEventListener('keydown',e=>{
    if (e.keyCode === 27) {
        location.href = '../index.html';
    }
});

function listarUltimoMovimiento(mov) {
    const tr = document.createElement('tr');

    tr.id = mov._id;

    const tdFecha = document.createElement('td');
    const tdCodigo = document.createElement('td');
    const tdCliente = document.createElement('td');
    const tdComprob = document.createElement('td');
    const tdNumero = document.createElement('td');
    const tdImporte = document.createElement('td');
    const tdVendedor = document.createElement('td');

    tdImporte.classList.add('text-right');
    console.log(mov.fecha.slice(0,10).split('-',3).reverse().join('/'));
    tdFecha.innerText = mov.fecha.slice(0,10).split('-',3).reverse().join('/');
    tdCodigo.innerText = mov.codigo;
    tdCliente.innerText = mov.cliente;
    tdComprob.innerText = mov.cuenta;
    tdNumero.innerText = mov.nro_comp;
    tdImporte.innerText = mov.imp.toFixed(2);
    tdVendedor.innerText = mov.vendedor;

    tr.appendChild(tdFecha);
    tr.appendChild(tdCodigo);
    tr.appendChild(tdCliente);
    tr.appendChild(tdComprob);
    tr.appendChild(tdNumero);
    tr.appendChild(tdImporte);
    tr.appendChild(tdVendedor);

    tbody.appendChild(tr);
};