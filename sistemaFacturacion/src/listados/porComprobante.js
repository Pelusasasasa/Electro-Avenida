
const axios = require("axios");
const { configAxios } = require("../funciones");
require("dotenv").config;
const URL = process.env.URL;

const hoy = new Date();
let dia = hoy.getDate();
let mes = hoy.getMonth() + 1

let totalRecibos = 0;
let totalFactura = 0;
let totalPresupuesto = 0;

dia = dia < 10 ? `0${dia}` : dia;
mes = (mes === 13) ? 1 : mes
mes = mes < 10 ? `0${mes}` : mes;

const fechaDeHoy = (`${hoy.getFullYear()}-${mes}-${dia}`)
const contado = document.querySelector('.contado');
const cteCorriente = document.querySelector('.cteCorriente');
const desde =  document.querySelector('#desde')
const hasta =  document.querySelector('#hasta')
desde.value = fechaDeHoy;
hasta.value = fechaDeHoy;
const tbody =  document.querySelector('.tbody')
let ventas = [];

window.addEventListener('load',async e=>{
    contado.classList.add('seleccionado');

    const desdefecha = new Date(desde.value);
    let tickets = (await axios.get(`${URL}ventas/${desdefecha}/${hasta.value}`,configAxios)).data;
    let presupuesto = (await axios.get(`${URL}presupuesto/${desdefecha}/${hasta.value}`,configAxios)).data;
    let recibos = (await axios.get(`${URL}recibos/getbetweenDates/${desdefecha}/${hasta.value}`,configAxios)).data;
    ventas = [...tickets,...presupuesto];
    const ventasContado = ventas.filter(venta=> venta.tipo_pago == "CD");

    listarVentas([...recibos,...ventasContado]);
});

desde.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
        hasta.focus();
    }
});

hasta.addEventListener('keypress',async e=>{
    if (e.key === "Enter") {
        const desdefecha = new Date(desde.value)
        let tickets = (await axios.get(`${URL}ventas/${desdefecha}/${hasta.value}`,configAxios)).data;
        let presupuesto = (await axios.get(`${URL}presupuesto/${desdefecha}/${hasta.value}`,configAxios)).data;
        let recibos = (await axios.get(`${URL}recibos/getbetweenDates/${desdefecha}/${hasta.value}`,configAxios)).data;
        ventas = [...tickets,...presupuesto,...recibos];
        contado.focus();
    }
});

contado.addEventListener('click',e=>{
    totalFactura = 0;
    totalPresupuesto = 0;
    totalRecibos = 0;

    const recibos_P = ventas.filter(venta=>venta.tipo_comp === "Recibos_P");
    const recibos = ventas.filter(venta=>venta.tipo_comp === "Recibos");
    const ventasContado = ventas.filter(venta => (venta.tipo_pago === "CD"))
    contado.classList.add('seleccionado');
    cteCorriente.classList.remove('seleccionado');
    listarVentas([...ventasContado,...recibos,...recibos_P]);
});

cteCorriente.addEventListener('click',e=>{
    totalFactura = 0;
    totalPresupuesto = 0;
    totalRecibos = 0;

    const ventasContado = ventas.filter(venta => venta.tipo_pago === "CC")
    cteCorriente.classList.add('seleccionado');
    contado.classList.remove('seleccionado');
    listarVentas(ventasContado);
});


function listarVentas(lista) {
    tbody.innerHTML = "";

    lista.sort((a,b)=>{
        if (a.fecha>b.fecha) {
            return 1;
        }else if(a.fecha<b.fecha){
            return -1;
        }
        return 0;
    })

    lista.forEach(venta => {
        let tipo  = "";
        if (venta.tipo_comp === "Presupuesto") {
            tipo = "P";
        }else if(venta.tipo_comp === "Ticket Factura"){
            tipo = "T";
        }else if(venta.tipo_comp === "Nota Credito"){
            tipo = "N";
        }else{
            tipo = "R";
        };
        const fecha = venta.fecha.slice(0,10).split('-',3);
        const hora = venta.fecha.slice(11,19).split(':',3);
        let hoy = fecha[2]
        let mes = fecha[1]
        let hours = hora[0]
        let minutes = hora[1]
        let seconds = hora[2]
        let anio = fecha[0]


        if (venta.productos) {
            venta.productos.forEach(({objeto,cantidad})=>{

                const tr = document.createElement('tr');
    
                const tdTipo = document.createElement('td');
                const tdNumero = document.createElement('td');
                const tdFecha = document.createElement('td');
                const tdCliente = document.createElement('td');
                const tdId = document.createElement('td');
                const tdDescripcion = document.createElement('td');
                const tdVendedor = document.createElement('td');
                const tdCantidad = document.createElement('td');
                const tdPrecio = document.createElement('td');
                const tdTotal = document.createElement('td');
                
                tdTipo.innerHTML = tipo;
                tdNumero.innerHTML = venta.nro_comp;
                tdFecha.innerHTML = `${hoy}/${mes}/${anio} - ${hours}:${minutes}:${seconds}`;
                tdCliente.innerHTML = venta.nombreCliente.slice(0,18);
                tdId.innerHTML = objeto._id;
                tdDescripcion.innerHTML = objeto.descripcion.slice(0,22);
                tdVendedor.innerHTML = venta.vendedor.substr(-20,3);
                tdCantidad.innerHTML = venta.tipo_comp === "Nota Credito" ? (cantidad * -1).toFixed(2) : cantidad.toFixed(2);
                tdPrecio.innerHTML = objeto.precio_venta;
                tdTotal.innerHTML = venta.tipo_comp === "Nota Credito" ? (objeto.precio_venta*cantidad*-1).toFixed(2) : (objeto.precio_venta*cantidad).toFixed(2);
    
                tr.appendChild(tdTipo);
                tr.appendChild(tdNumero);
                tr.appendChild(tdFecha);
                tr.appendChild(tdCliente);
                tr.appendChild(tdId);
                tr.appendChild(tdDescripcion);
                tr.appendChild(tdVendedor);
                tr.appendChild(tdCantidad);
                tr.appendChild(tdPrecio);
                tr.appendChild(tdTotal);
    
                tbody.appendChild(tr);
            });
        }

        if (venta.tipo_comp === "Recibos" || venta.tipo_comp === "Recibos_P") {
            tbody.innerHTML += `
                <tr>
                    <td>${tipo}</td>
                    <td>${venta.nro_comp}</td>
                    <td>${hoy}/${mes}/${anio} - ${hours}:${minutes}:${seconds}</td>
                    <td>${(venta.cliente).slice(0,18)}</td>
                    <td></td>
                    <td></td>
                    <td>${venta.vendedor.substr(-20,3)}</td>
                    <td></td>
                    <td></td>
                    <td>${venta.precioFinal}</td>
                </tr>
            `
        }
        if (venta.tipo_comp === "Ticket Factura") {
            totalFactura += venta.precioFinal;
        }else if(venta.tipo_comp === "Nota Credito"){
            totalFactura -= venta.precioFinal;
        }else if(venta.tipo_comp === "Presupuesto"){
            totalPresupuesto += venta.precioFinal;
        }else{
            totalRecibos += venta.precioFinal;
        }
        tbody.innerHTML += `
        <tr class="total"><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td class=tdTotal>${venta.tipo_comp === "Nota Credito" ? (parseFloat(venta.precioFinal)*-1).toFixed(2)  : parseFloat(venta.precioFinal).toFixed(2)}</td></tr>`
    });

    tbody.innerHTML += `
        <tr class="total">
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>Presupuesto: </td>
            <td>${totalPresupuesto.toFixed(2)}</td>
        </tr>
        <tr class="total">
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>Facturas: </td>
            <td>${totalFactura.toFixed(2)}</td>
        </tr>
        <tr class="total">
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>Recibos: </td>
            <td>${totalRecibos.toFixed(2)}</td>
        </tr>
    `
}


document.addEventListener('keydown',e=>{
    if (e.key === "Escape") {
        window.close()
    }
})