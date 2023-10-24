
const axios = require("axios");
const { configAxios } = require("../funciones");
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

desde.value = fechaDeHoy;
hasta.value = fechaDeHoy;

const tbody =  document.querySelector('.tbody');
const imprimir = document.querySelector('.imprimir');

window.addEventListener('load', async e=>{
    const desdeFecha = new Date(desde.value);
    let ventas = (await axios.get(`${URL}ventas/${desdeFecha}/${hasta.value}`,configAxios)).data;
    let presupuesto = (await axios.get(`${URL}presupuesto/${desdeFecha}/${hasta.value}`,configAxios)).data;
    const ventasPresupuestos = ventas.filter(venta => venta.tipo_pago === "PP")
    const presupuestoPresupuestos = presupuesto.filter(venta => venta.tipo_pago === "PP")
    listarVentas([...ventasPresupuestos,...presupuestoPresupuestos],tbody)
});

desde.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
        hasta.focus();
    };
});

hasta.addEventListener('keypress',async e=>{
    if (e.key === "Enter") {
        const desdeFecha = new Date(desde.value);

        let ventas = (await axios.get(`${URL}ventas/${desdeFecha}/${hasta.value}`,configAxios)).data;
        let presupuesto = (await axios.get(`${URL}presupuesto/${desdeFecha}/${hasta.value}`,configAxios)).data;
        const ventasPresupuestos = ventas.filter(venta => venta.tipo_pago === "PP")
        const presupuestoPresupuestos = presupuesto.filter(venta => venta.tipo_pago === "PP")
        listarVentas([...ventasPresupuestos,...presupuestoPresupuestos],tbody)
    };
});

async function listarVentas(lista,bodyelegido) {
    bodyelegido.innerHTML = "";
    for await(let venta of lista){
        const fecha = venta.fecha.slice(0,10).split('-',3)
        const hora = venta.fecha.slice(11,19).split(':',3)
        let hoy = fecha[2];
        let mes = fecha[1];
        let anio = fecha[0];
        let hours = hora[0];
        let minuts = hora[1];
        let seconds = hora[2];
        const movimientos = (await axios.get(`${URL}movProductos/movimientosPorCliente/${venta.nro_comp}/${venta.tipo_comp}/${venta.cliente}`)).data;
        for await (let mov of movimientos){
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
            tdNumero.innerHTML = mov.nro_comp;
            tdCliente.innerHTML = mov.cliente.slice(0,20);
            tdCodigo.innerHTML = mov.codProd;    
            tdDescripcion.innerHTML = mov.descripcion.slice(0,30);
            tdEgreso.innerHTML = mov.egreso.toFixed(2);
            tdPrecio.innerHTML = mov.precio_unitario;
            tdTotal.innerHTML = (parseFloat(mov.precio_unitario) * mov.egreso).toFixed(2);
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