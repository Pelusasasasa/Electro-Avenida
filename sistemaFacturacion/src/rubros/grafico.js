const axios = require("axios");
const { cerrarVentana } = require("../funciones");
require("dotenv").config;
const URL = process.env.URL;

const desde = document.querySelector('#desde');
const hasta = document.querySelector('#hasta');
const select = document.querySelector('#rubros');
const total = document.querySelector('#total');

const tbody = document.querySelector('tbody');

let date = new Date();
let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();


month = month === 13 ? 1 : month;
day = day < 10 ? `0${day}` : day;
month = month < 10 ? `0${month}` : month;

window.addEventListener('load',async e=>{
    cerrarVentana();

    const rubros = (await axios.get(`${URL}rubros`)).data;
    listarRubros(rubros);
    desde.value = `${year}-${month}-${day}`;
    hasta.value = `${year}-${month}-${day}`;
    let nextDay = new Date(hasta.value);
    nextDay.setDate(date.getDate() + 1);
    const movimientos = (await axios.get(`${URL}movProductos/${desde.value}/${nextDay}/${select.value}`)).data;
    const movimientosSinPP = movimientos.filter(movimiento => movimiento.tipo_pago !== "PP")
    listarMovimientos(movimientosSinPP);
});

desde.addEventListener('keydown',e=>{
    if (e.keyCode === 13) {
        hasta.focus();
    }
});

select.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        e.preventDefault();
        desde.focus();
    }
})

const listarRubros = (lista)=>{
    for(let elem of lista){
        const option = document.createElement('option');
        option.value = elem.codigo
        option.text = elem.codigo + " - " + elem.nombre;
        select.append(option)
    }
};

const listarMovimientos = (lista)=>{
    tbody.innerHTML = ""
    let suma = 0;
    for(let movimiento of lista){
        const tr = document.createElement('tr');

        const tdFecha = document.createElement('td');
        const tdCodigoCliente = document.createElement('td');
        const tdCliente = document.createElement('td');
        const tdCodigoProducto = document.createElement('td');
        const tdProducto = document.createElement('td');
        const tdEgreso = document.createElement('td');
        const tdIngreso = document.createElement('td');
        const tdPrecio = document.createElement('td');
        const tdTotal = document.createElement('td');
        
        const fecha = movimiento.fecha.slice(0,10).split('-',3);
        tdFecha.innerHTML = `${fecha[2]}/${fecha[1]}/${fecha[0]}`;
        tdCodigoCliente.innerHTML = movimiento.codCliente;
        tdCliente.innerHTML = movimiento.cliente.slice(0,15);
        tdCodigoProducto.innerHTML = movimiento.codProd;
        tdProducto.innerHTML = movimiento.descripcion.slice(0,20);
        tdEgreso.innerHTML = movimiento.egreso.toFixed(2);
        tdIngreso.innerHTML = movimiento.ingreso.toFixed(2);
        tdPrecio.innerHTML = movimiento.precio_unitario.toFixed(2);
        tdTotal.innerHTML = movimiento.total.toFixed(2);

        tdEgreso.classList.add('text-right');
        tdIngreso.classList.add('text-right');
        tdPrecio.classList.add('text-right');
        tdTotal.classList.add('text-right');

        // tr.appendChild();
        tr.appendChild(tdFecha);
        tr.appendChild(tdCodigoCliente);
        tr.appendChild(tdCliente);
        tr.appendChild(tdCodigoProducto)
        tr.appendChild(tdProducto);
        tr.appendChild(tdEgreso);
        tr.appendChild(tdIngreso);
        tr.appendChild(tdPrecio);
        tr.appendChild(tdTotal);
        
        tbody.appendChild(tr);


        suma += movimiento.total;
    }
    total.value = suma.toFixed(2);
};

hasta.addEventListener('keypress',async e=>{
    if (e.keyCode === 13) {
        let nextDay = new Date(hasta.value);
        let hoy = (parseInt(hasta.value.split('-',3)[2]));
        nextDay.setDate(hoy + 1);
        const movimientos = (await axios.get(`${URL}movProductos/${desde.value}/${nextDay}/${select.value}`)).data;
        listarMovimientos(movimientos);
    }

});