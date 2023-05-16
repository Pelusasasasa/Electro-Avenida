const sweet = require('sweetalert2');

const axios = require('axios');
require('dotenv').config();
const URL = process.env.URL;

const select = document.getElementById('provedores');

const saldoActual = document.getElementById('saldoActual');
const concepto = document.getElementById('concepto');
const fecha = document.getElementById('fecha');
const puntoVenta = document.getElementById('puntoVenta');
const nro_comp = document.getElementById('nro_comp');
const debe = document.getElementById('debe');
const haber = document.getElementById('haber');
const saldo = document.getElementById('saldo');
const observaciones = document.getElementById('observaciones');

const aceptar = document.querySelector('.aceptar');
const cancelar = document.querySelector('.cancelar');

window.addEventListener('load',async e=>{
 const provedores = (await axios.get(`${URL}provedor`)).data;
 listarProvedores(provedores);

 const date = new Date();
 let day = date.getDate();
 let month = date.getMonth() + 1;
 let year = date.getFullYear();
 
 day = day < 10 ? `0${day}` : day;
 month = month === 13 ? 1 : month;
 month = month < 10 ? `0${month}` : month;

 fecha.value = `${year}-${month}-${day}`;
});

const listarProvedores = (lista)=>{
    lista.sort((a,b)=>{
        if (a.provedor > b.provedor) {
            return 1
        }else if(a.provedor < b.provedor){
            return -1
        }
        return 0
    });
    for(let elem of lista){
        const option = document.createElement('option');

        option.value = elem.codigo;
        option.text = elem.provedor;
        option.id = elem.saldo;

        select.appendChild(option);
    }
};

aceptar.addEventListener('click',async e=>{
    const cuenta = {};
    cuenta.tipo_comp = concepto.value.toUpperCase();
    cuenta.codProv = select.value;
    cuenta.nro_comp = puntoVenta.value.padStart(4,'0') + "-" + nro_comp.value.padStart(8,'0')
    cuenta.provedor = select.innerText;
    cuenta.fecha = fecha.value;
    cuenta.debe = debe.value;
    cuenta.haber = haber.value;
    cuenta.saldo = saldo.value;
    cuenta.observaciones = observaciones.value;

    sumarSaldoProvedor(cuenta)

    try {
        await axios.post(`${URL}ctactePro`,cuenta);
    } catch (error) {
        sweet.fire({
            title: "No se pudo cargar en la cueta corriente del provedor"
        })
    }

    window.close();
});

const sumarSaldoProvedor = async()=>{
    let provedor = (await axios.get(`${URL}provedor/codigo/${select.value}`)).data;
    provedor.saldo = saldo.value;
    try {
        await axios.put(`${URL}provedor/codigo/${provedor.codigo}`,provedor);
    } catch (error) {
        sweet.fire({
            title:"No se pudo modificar el saldo del provedor"
        })
    }
};

provedores.addEventListener('change',e=>{
    saldoActual.value = parseFloat(provedores.options[provedores.selectedIndex].id).toFixed(2);    
});

provedores.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        e.preventDefault();
        concepto.focus();
    }
});

concepto.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        fecha.focus();
    }
});

fecha.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        puntoVenta.focus();
    }
});

puntoVenta.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        nro_comp.focus();
    }
});

nro_comp.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        debe.focus();
    }
});


debe.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        haber.focus();
    }
});

haber.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        saldo.focus();
    }
});


saldo.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        observaciones.focus();
    }
});

observaciones.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        aceptar.focus();
    }
});

concepto.addEventListener('focus',e=>{
    concepto.select();
});

puntoVenta.addEventListener('focus',e=>{
    puntoVenta.select();
});

nro_comp.addEventListener('focus',e=>{
    nro_comp.select();
});

debe.addEventListener('focus',e=>{
    debe.select();
});

haber.addEventListener('focus',e=>{
    haber.select();
});

saldo.addEventListener('focus',e=>{
    saldo.select();
});

observaciones.addEventListener('focus',e=>{
    observaciones.select();
});

cancelar.addEventListener('click',e=>{
    window.close();
});

document.addEventListener('keyup',e=>{
    if (e.keyCode === 27) {
        window.close();
    }
});