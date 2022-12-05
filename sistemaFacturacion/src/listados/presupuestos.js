
const { DateTime } = require("luxon");
const axios = require("axios");
require("dotenv").config;
const URL = process.env.URL;


const hoy = new Date()
let dia = hoy.getDate()
if (dia<10) {
    dia = `0${dia}`
}
let mes = hoy.getMonth() + 1

mes = mes === 0 ? mes+1 : mes ;

if (mes<10) {
    mes = `0${mes}`
}
const desde =  document.querySelector('#desde')
const hasta =  document.querySelector('#hasta')
const fechaDeHoy = (`${hoy.getFullYear()}-${mes}-${dia}`)
const buscar = document.querySelector('.buscar');

desde.value = fechaDeHoy;
hasta.value = fechaDeHoy;

const tbody =  document.querySelector('.tbody');
const imprimir = document.querySelector('.imprimir');

window.addEventListener('load', async e=>{
    const desdeFecha = new Date(desde.value);
    let hastaFecha = DateTime.fromISO(hasta.value).endOf('day');
    let ventas = (await axios.get(`${URL}ventas/${desdeFecha}/${hastaFecha}`)).data;
    let presupuesto = (await axios.get(`${URL}presupuesto/${desdeFecha}/${hastaFecha}`)).data;
    const ventasPresupuestos = ventas.filter(venta => venta.tipo_pago === "PP")
    const presupuestoPresupuestos = presupuesto.filter(venta => venta.tipo_pago === "PP")
    listarVentas([...ventasPresupuestos,...presupuestoPresupuestos],tbody)
});

desde.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
        hasta.focus();
    };
});

hasta.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
        buscar.focus();
    };
});

buscar.addEventListener('click',async e=>{
    const desdeFecha = new Date(desde.value);
    let hastaFecha = DateTime.fromISO(hasta.value).endOf('day');
    let ventas = (await axios.get(`${URL}ventas/${desdeFecha}/${hastaFecha}`)).data;
    let presupuesto = (await axios.get(`${URL}presupuesto/${desdeFecha}/${hastaFecha}`)).data;
    const ventasPresupuestos = ventas.filter(venta => venta.tipo_pago === "PP")
    const presupuestoPresupuestos = presupuesto.filter(venta => venta.tipo_pago === "PP")
    listarVentas([...ventasPresupuestos,...presupuestoPresupuestos],tbody)
})

function listarVentas(lista,bodyelegido) {
    bodyelegido.innerHTML = "";
    for(let venta of lista){
        const fecha = new Date(venta.fecha);
        let hoy = fecha.getDate();
        let mes = fecha.getMonth();
        let anio = fecha.getFullYear();
        let hours = fecha.getHours();
        let minuts = fecha.getMinutes();
        let seconds = fecha.getSeconds();

        mes = (mes===0) ? mes + 1 : mes;
        mes = (mes<10) ? `0${mes}` : mes;
        hoy = (hoy<10) ? `0${hoy}` : hoy;
        hours = (hours<10) ? `0${hours}` : hours;
        minuts = minuts<10 ? `0${minuts}` : minuts;
        seconds = seconds<10 ? `0${seconds}` : seconds;

        for(let {cantidad,objeto} of venta.productos){

            const tr = document.createElement('tr');

            const tdFecha = document.createElement('td');
            const tdNumero = document.createElement('td');
            const tdCliente = document.createElement('td');
            const tdCodigo = document.createElement('td');
            const tdDescripcion = document.createElement('td');
            const tdEgreso = document.createElement('td');
            const tdPrecio = document.createElement('td');
            const tdTotal = document.createElement('td');
            const tdVend = document.createElement('td');
            
            tdFecha.innerHTML = `${hoy}/${mes}/${anio} - ${hours}:${minuts}:${seconds}`;
            tdNumero.innerHTML = venta.nro_comp;
            tdCliente.innerHTML = venta.nombreCliente.slice(0,20);
            tdCodigo.innerHTML = objeto._id;    
            tdDescripcion.innerHTML = objeto.descripcion.slice(0,30);
            console.log(cantidad)
            tdEgreso.innerHTML = parseFloat(cantidad).toFixed(2);
            tdPrecio.innerHTML = objeto.precio_venta;
            tdTotal.innerHTML = (parseFloat(objeto.precio_venta) * cantidad).toFixed(2);
            tdVend.innerHTML = venta.vendedor.slice(0,3);

            tr.appendChild(tdNumero);
            tr.appendChild(tdFecha);
            tr.appendChild(tdCliente);
            tr.appendChild(tdCodigo)
            tr.appendChild(tdDescripcion);
            tr.appendChild(tdEgreso);
            tr.appendChild(tdPrecio);
            tr.appendChild(tdTotal);
            tr.appendChild(tdVend)
            bodyelegido.appendChild(tr);
        }
        const tr = document.createElement('tr');
        const tdTotal = document.createElement('td');
        const td1 = document.createElement('td');
        const td2 = document.createElement('td');
        const td3 = document.createElement('td');
        const td4 = document.createElement('td');
        const td5 = document.createElement('td');
        const td6 = document.createElement('td');
        const td7 = document.createElement('td');
        tr.classList.add('total')
        tdTotal.innerHTML = venta.precioFinal;
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tr.appendChild(td5);
        tr.appendChild(td6);
        tr.appendChild(td7);
        tr.appendChild(tdTotal);


        bodyelegido.appendChild(tr)
    };
}

imprimir.addEventListener('click',e=>{
    //printPage()
    const buscador = document.querySelector('.buscador')
    buscador.classList.add('disable')
    buscador.classList.remove('buscador')
    window.print()
    buscador.classList.add('buscador')
    buscador.classList.remove('disable')
});

document.addEventListener('keydown',e=>{
    if(e.key === "Escape"){
        window.close()
    }
});