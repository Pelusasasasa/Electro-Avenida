const axios = require('axios');
const { cerrarVentana } = require('../assets/js/globales');
require('dotenv').config();
const URL = process.env.URL;

let provedores;

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
console.log(anioAnterior)
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
    const cuentas = (await axios.get(`${URL}ctactePro/traerPorProvedorYDesde/${select.value}/${desde.value}`)).data;
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

        tdFecha.innerHTML = `${fecha[2]}/${fecha[1]}/${fecha[0]}`;
        tdConcepto.innerHTML = cuenta.tipo_comp;
        tdImp.innerHTML = cuenta.nro_comp;
        tdDebe.innerHTML = cuenta.debe.toFixed(2);
        tdHaber.innerHTML = cuenta.haber.toFixed(2);
        tdSaldo.innerHTML = cuenta.saldo.toFixed(2);
        tdComPago.innerHTML = cuenta.com_pago;

        tr.appendChild(tdFecha);
        tr.appendChild(tdConcepto);
        tr.appendChild(tdImp);
        tr.appendChild(tdDebe);
        tr.appendChild(tdHaber);
        tr.appendChild(tdSaldo);
        tr.appendChild(tdComPago);
        tbody.appendChild(tr)
    });

}

select.addEventListener('change',async e=>{
    const provedor = provedores.find(provedor=>provedor.codigo === select.value);
    const cuentas = (await axios.get(`${URL}ctactePro/traerPorProvedorYDesde/${select.value}/${desde.value}`)).data;
    listarCuentas(cuentas);
    codigo.value = provedor.codigo;
    saldo.value = provedor.saldo;
});
