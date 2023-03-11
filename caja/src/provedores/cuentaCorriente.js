const axios = require('axios');
const { cerrarVentana } = require('../assets/js/globales');
require('dotenv').config();
const URL = process.env.URL;

const sweet = require('sweetalert2');

let provedores;
let cuentas;

const select = document.getElementById('provedores');
const desde = document.getElementById('desde');
const hasta = document.getElementById('hasta');

const codigo = document.getElementById('codigo');
const saldo = document.getElementById('saldo');
const salir = document.getElementById('salir');

const tbody = document.querySelector('tbody');

const date = ((new Date()).toISOString()).slice(0,10);
const dateSeparado = date.split('-',3)
let mesAnterior = parseFloat(dateSeparado[1]-1);
mesAnterior = mesAnterior === 0 ? 12 : mesAnterior;
mesAnterior = mesAnterior < 10 ? `0${mesAnterior}` : mesAnterior;
let anioAnterior = mesAnterior === 12 ? parseFloat(dateSeparado[0]) - 1 : dateSeparado[0];
desde.value = `${anioAnterior}-${mesAnterior}-${dateSeparado[2]}`;
hasta.value = date;

window.addEventListener('load',async e=>{
    cerrarVentana();
    provedores = (await axios.get(`${URL}provedor`)).data;
    provedores.sort((a,b)=>{
        if (a.provedor < b.provedor) {
            return -1;
        } else if(a.provedor>b.provedor) {
            return 1;
        }
        return 0
    });
    await listarProvedores(provedores);
    cuentas = (await axios.get(`${URL}ctactePro/traerPorProvedorYDesde/${select.value}/${desde.value}`)).data;
    listarCuentas(cuentas);
    const provedor = provedores.find(provedor=>provedor.codigo === select.value);
    saldo.value = provedor.saldo.toFixed(2);
    codigo.value = provedor.codigo.padStart(4,"0");
});

const listarProvedores = (lista)=>{
    lista.forEach(provedor => {
        const option = document.createElement('option');
        option.text = provedor.provedor;
        option.value = provedor.codigo;
        select.appendChild(option)
    });
};

const listarCuentas = (lista) => {
    lista.sort((a,b)=>{
        if (a.fecha > b.fecha) {
            return 1
        }else if(a.fecha < b.fecha){
            return -1
        }
        return 0;
    });
    tbody.innerHTML = "";
    lista.forEach(cuenta => {
        const tr = document.createElement('tr');
        const fecha = cuenta.fecha.slice(0,10).split('-',3);
        const tdFecha = document.createElement('td');
        const tdConcepto = document.createElement('td');
        const tdImp = document.createElement('td');
        const tdDebe = document.createElement('td');
        const tdHaber = document.createElement('td');
        const tdSaldo = document.createElement('td');
        const tdComPago = document.createElement('td');
        const tdObservaciones = document.createElement('td');

        tdObservaciones.classList.add('botonFalso');
        tdObservaciones.id = cuenta._id;

        tdFecha.innerHTML = `${fecha[2]}/${fecha[1]}/${fecha[0]}`;
        tdConcepto.innerHTML = cuenta.tipo_comp;
        tdImp.innerHTML = cuenta.nro_comp;
        tdDebe.innerHTML = cuenta.debe.toFixed(2);
        tdHaber.innerHTML = cuenta.haber.toFixed(2);
        tdSaldo.innerHTML = cuenta.saldo.toFixed(2);
        tdComPago.innerHTML = cuenta.com_pago;
        tdObservaciones.innerHTML = cuenta.observaciones ? cuenta.observaciones : "Agregar", //Aca vamos a poner lo que diga la observacion

        tr.appendChild(tdFecha);
        tr.appendChild(tdConcepto);
        tr.appendChild(tdImp);
        tr.appendChild(tdDebe);
        tr.appendChild(tdHaber);
        tr.appendChild(tdSaldo);
        tr.appendChild(tdComPago);
        tr.appendChild(tdObservaciones);
        tbody.appendChild(tr)
    });

}

tbody.addEventListener('click',async e=>{
    if (e.target) {
        if (e.target.classList.contains("botonFalso")) {
            await sweet.fire({
                title:"Observaciones",
                input:"text",
                confirmButtonText:"Aceptar",
                showCancelButton:true,

            }).then(async ({isConfirmed,value})=>{
                if (isConfirmed) {
                    const cuenta = cuentas.find(cuenta=>cuenta._id === e.target.id);
                    cuenta.observaciones = value.toUpperCase();
                    try {
                        await axios.put(`${URL}ctactePro/id/${cuenta._id}`,cuenta);
                        e.target.innerHTML = cuenta.observaciones
                    } catch (error) {
                        console.log(error)
                    }
                }
            })
        }
    }
});

select.addEventListener('change',async e=>{
    const provedor = provedores.find(provedor=>provedor.codigo === select.value);
    cuentas = (await axios.get(`${URL}ctactePro/traerPorProvedorYDesde/${select.value}/${desde.value}`)).data;
    listarCuentas(cuentas);
    codigo.value = provedor.codigo;
    saldo.value = provedor.saldo.toFixed(2);
});


desde.addEventListener('keypress',async e=>{
    if (e.keyCode === 13) {
        cuentas = (await axios.get(`${URL}ctactePro/traerPorProvedorYDesde/${select.value}/${desde.value}`)).data;
        listarCuentas(cuentas)
        hasta.focus();
    }
})