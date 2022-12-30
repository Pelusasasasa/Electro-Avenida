const axios = require('axios');
const { ipcRenderer } = require('electron');
require('dotenv').config();
const URL = process.env.URL;

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

let numeroParaModifcar = getParameterByName('numero');
let numeroIvaAnterior = 0;

const sweet = require('sweetalert2');

const {redondear} = require('../assets/js/globales');

const provedor = document.getElementById('provedor');
const codigo = document.getElementById('codigo');
const cond_iva = document.getElementById('cond_iva');
const cuit = document.getElementById('cuit')

const puntoVenta = document.getElementById('puntoVenta');
const numero = document.getElementById('numero');78,5,80
const empresa = document.getElementById('empresa');

const factura = document.getElementById('Factura');
const notaCredito = document.getElementById('Nota Credito');
const presupuesto = document.getElementById('Presupuesto');

const fechaComp = document.getElementById('fechaComp');
const fechaImput = document.getElementById('fechaImput');
const fechaVencimiento = document.getElementById('fechaVencimiento');
const fechaVencimientoCAI = document.getElementById('fechaVencimientoCAI');

const netoNoGravado = document.getElementById('netoNoGravado');
const netoGravado = document.getElementById('netoGravado');
const iva = document.getElementById('iva');
const numeroIva = document.getElementById('numeroIva');
const percepcionIVA = document.getElementById('percepcionIVA');
const retencionDGR = document.getElementById('retencionDGR');
const percepcionDGR = document.getElementById('percepcionDGR');
const retencionIVA = document.getElementById('retencionIVA');
const total = document.getElementById('total');
const descuentoPor = document.getElementById('descuentoPor');
const descuento = document.getElementById('descuento');
const neto = document.getElementById('neto');

const contado = document.getElementById('contado');
const cuentaCorriente = document.getElementById('cuentaCorriente');


const aceptar = document.querySelector('.aceptar');
const modificar = document.querySelector('.modificar');
const cancelar = document.querySelector('.cancelar');

let aux = 0;

const date = new Date();
let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();

month = month === 13 ? 1 : month;
day = day < 10 ? `0${day}` : day;
month = month < 10 ? `0${month}` : month;

window.addEventListener('load',async e=>{
    fechaComp.value = `${year}-${month}-${day}`;
    fechaImput.value  = `${year}-${month}-${day}`;
    fechaVencimiento.value = `${year}-${month}-${day}`;
    fechaVencimientoCAI.value = `${year}-${month}-${day}`;

    if (numeroParaModifcar) {
        const factura = (await axios.get(`${URL}dat_comp/id/${numeroParaModifcar}`)).data;
        listarFactura(factura)
    }
    
});

provedor.addEventListener('keypress',e=>{
    if (e.keyCode === 13 && provedor.value === "") {
        ipcRenderer.send('abrir-ventana',{
            path:"datos/provedores.html",
            width:1200,
            height:700,
            informacion: {
                botones:false
            }
        })
    }else if(e.keyCode === 13 && provedor.value === "0"){
        codigo.value = "0000";
        provedor.value = "Provedor Eventual";
        cuentaCorriente.parentNode.classList.add('none');
        provedor.removeAttribute('disabled');
        cuit.removeAttribute('disabled');
        cond_iva.removeAttribute('disabled');
        cond_iva.focus();
    }
});

cond_iva.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        cuit.focus();
    }
});

puntoVenta.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        numero.focus();
    }
});

numero.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        empresa.focus();
    }
});


empresa.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        e.preventDefault();
        factura.focus();
    }
});

factura.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        notaCredito.focus();
    }
});

notaCredito.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        presupuesto.focus();
    }
});

presupuesto.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        fechaComp.focus();
    }
});

fechaComp.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        fechaImput.focus();
    }
});

fechaImput.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        fechaVencimiento.focus();
    }
});

fechaVencimiento.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        fechaVencimientoCAI.focus();
    }
});

fechaVencimientoCAI.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        netoNoGravado.focus();
    }
}); 

netoNoGravado.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        netoGravado.focus();
    }
});

netoGravado.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        iva.focus();
    }
});

iva.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        e.preventDefault();
        numeroIva.value = redondear(parseFloat(netoGravado.value) * parseFloat(iva.value) / 100,2)
        numeroIva.focus();
    }
});

numeroIva.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        percepcionIVA.focus();
        total.value = redondear(parseFloat(total.value) - numeroIvaAnterior + parseFloat(numeroIva.value),2)
        numeroIvaAnterior = numeroIva.value;
    }
});

percepcionIVA.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        retencionDGR.focus();
    }
});

retencionDGR.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        percepcionDGR.focus();
    }
});

retencionDGR.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        percepcionDGR.focus();
    }
});

percepcionDGR.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
            retencionIVA.focus();
    }
});

retencionIVA.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
            total.focus();
    }
});

total.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        descuentoPor.focus();
    }
});

descuentoPor.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        descuento.focus();
    }
});

descuento.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        neto.focus();
    }
});

neto.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        contado.focus();
    }
});

contado.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        contado.checked  = true;
        cuentaCorriente.focus();
    }
});

cuentaCorriente.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        cuentaCorriente.checked = true;
        aceptar.focus();
    }
});

netoNoGravado.addEventListener('change',e=>{
    console.log(aux)
    total.value = redondear(parseFloat(netoNoGravado.value) + parseFloat(total.value) - aux,2);
});

netoGravado.addEventListener('change',e=>{
    total.value = parseFloat(netoGravado.value) + parseFloat(total.value) - aux;
});

percepcionIVA.addEventListener('change',e=>{
    total.value = parseFloat(total.value) + parseFloat(percepcionIVA.value)
});

retencionDGR.addEventListener('change',e=>{
    total.value = parseFloat(total.value) + parseFloat(retencionDGR.value)
});

percepcionDGR.addEventListener('change',e=>{
    total.value = parseFloat(percepcionDGR.value) + parseFloat(total.value);
});

retencionIVA.addEventListener('change',e=>{
    total.value = parseFloat(retencionIVA.value) + parseFloat(total.value);
});

puntoVenta.addEventListener('focus',e=>{
    puntoVenta.select();
});

numero.addEventListener('focus',e=>{
    numero.select();
});

netoNoGravado.addEventListener('focus',e=>{
    aux = parseFloat(netoNoGravado.value);
    netoNoGravado.select();
});

netoGravado.addEventListener('focus',e=>{
    aux = parseFloat(netoGravado.value);
    netoGravado.select();
});

percepcionIVA.addEventListener('focus',e=>{
    percepcionIVA.select();
});

retencionDGR.addEventListener('focus',e=>{
    retencionDGR.select();
});

percepcionDGR.addEventListener('focus',e=>{
    percepcionDGR.select();
});

retencionIVA.addEventListener('focus',e=>{
    retencionIVA.select();
});

total.addEventListener('focus',e=>{
    total.select();
});

descuentoPor.addEventListener('focus',e=>{
    descuentoPor.select();
});

descuento.addEventListener('focus',e=>{
    descuento.select();
});

neto.addEventListener('focus',e=>{
    neto.select();
});

descuentoPor.addEventListener('change',e=>{
    descuento.value = redondear(parseFloat(total.value) * parseFloat(descuentoPor.value) / 100,2);
});

descuento.addEventListener('focus',e=>{
    neto.value = redondear(parseFloat(total.value) - parseFloat(descuento.value),2)
});

document.addEventListener('keyup',e=>{
    if (e.keyCode === 27) {
        location.href = "../index.html";
    }
});

aceptar.addEventListener('click',async e=>{
    
    const dat_comp = {};

    dat_comp.provedor = provedor.value;
    dat_comp.codProv = codigo.value;
    dat_comp.cuit = cuit.value;
    dat_comp.nro_comp = puntoVenta.value.padStart(4,'0') + "-" + numero.value.padStart(8,'0');
    dat_comp.tipo_comp = await verTipoComprobante();
    dat_comp.empresa = empresa.value;

    dat_comp.fecha_comp = fechaComp.value;
    dat_comp.fecha_imput = fechaImput.value;
    
    dat_comp.netoNoGravado = netoNoGravado.value;
    dat_comp.netoGravado = netoGravado.value;
    dat_comp.tasaIva = iva.value;
    dat_comp.iva = numeroIva.value;
    dat_comp.p_dgr_c = percepcionDGR.value;
    dat_comp.p_iva_c = percepcionIVA.value;
    dat_comp.r_dgr_c = retencionDGR.value;
    dat_comp.r_iva_c = retencionIVA.value;
    dat_comp.total = neto.value;

    if (cuentaCorriente.checked) {
        await ponerEnCuentaCorrienteProvedor(dat_comp);
        await ponerSaldoAlProvedor(dat_comp);

        if (parseFloat(descuento.value) !== 0) {
            await ponerEnCuentaCorrienteProvedorDescuento(dat_comp);
        }
    }

    try {
        await axios.post(`${URL}dat_comp`,dat_comp);
        location.reload();
    } catch (error) {
        await sweet.fire({
            title:"No se pudo cargar la Compra"
        })
    }
    console.log(dat_comp)
});

const ponerEnCuentaCorrienteProvedor = async(datos)=>{
    const cuenta = {};
    cuenta.fecha = datos.fecha_comp;
    cuenta.codProv = datos.codProv;
    cuenta.provedor = datos.provedor;
    cuenta.tipo_comp = datos.tipo_comp;
    cuenta.nro_comp = datos.nro_comp;
    cuenta.debe = datos.total;
    cuenta.haber = 0;
    cuenta.saldo = parseFloat(total.value) + provedorTraido.saldo;
    cuenta.emp = datos.empresa;
    console.log(cuenta)
    try {
        await axios.post(`${URL}ctactePro`,cuenta);
    } catch (error) {
        console.log(error)
        sweet.fire({
            title:"No se pudo cargar a cuenta corriente provedor"
        });
    }

};

const ponerEnCuentaCorrienteProvedorDescuento = async(datos)=>{
    const cuenta = {};
    cuenta.fecha = datos.fecha_comp;
    cuenta.codProv = datos.codProv;
    cuenta.provedor = datos.provedor;
    cuenta.tipo_comp = "Descuento";
    cuenta.nro_comp = datos.nro_comp;
    cuenta.debe = 0;
    cuenta.haber = descuento.value;
    console.log(provedorTraido.saldo);
    console.log(total.value);
    console.log(descuento.value)
    cuenta.saldo = (parseFloat(provedorTraido.saldo) - parseFloat(descuento.value));
    console.log(cuenta.saldo)
    cuenta.emp = datos.empresa;
    try {
        await axios.post(`${URL}ctactePro`,cuenta);
    } catch (error) {
        console.log(error)
        sweet.fire({
            title:"No se pudo cargar a cuenta corriente provedor"
        });
    }
}

const ponerSaldoAlProvedor = async(datos)=>{
    provedorTraido.saldo = redondear(provedorTraido.saldo + parseFloat(datos.total),2)
    try {
        await axios.put(`${URL}provedor/codigo/${datos.codProv}`,provedorTraido);
    } catch (error) {
        sweet.fire({title:"No se pudo modificar el saldo del provedor"})
    }
}

const verTipoComprobante = ()=>{
    const radios =  document.querySelectorAll('input[name=tipoComprobante]')
    for(let radio of radios){
        if (radio.checked) {
            return radio.id;
        }
    }
}

modificar.addEventListener('click',async e=>{
    const factura = {};

    factura.provedor =provedor.value;
    factura.codProv = codigo.value;
    factura.cuit = cuit.value;
    factura.nro_comp = `${puntoVenta.value.padStart(4,'0')}-${numero.value.padStart(8,'0')}`;
    factura.tipo_comp = await verTipoComprobante();
    factura.empresa = empresa.value;

    factura.fecha_comp = fechaComp.value;
    factura.fechaImput = fechaImput.value;

    factura.netoNoGravado = redondear(netoNoGravado.value,2);
    factura.netoGravado = redondear(netoGravado.value,2);
    factura.tasaIva = redondear(iva.value,2);
    factura.iva = redondear(numeroIva.value,2);
    factura.p_iva_c = redondear(percepcionIVA.value, 2);
    factura.p_dgr_c = redondear(percepcionDGR.value,2);
    factura.r_dgr_c = redondear(retencionDGR.value,2); 
    factura.r_iva_c = redondear(retencionIVA.value,2);
    factura.total = redondear(neto.value,2);
    try {
        await axios.put(`${URL}dat_comp/id/${numeroParaModifcar}`,factura);
        if (aceptar.classList.contains('none')) {
            location.href = '../compras/modificarCompras.html'
        }else{
            location.href = '../index.html'
        }
    } catch (error) {
        console.log(error)
        await sweet.fire({
            title:"No se Puedo modificar la factura"
        })
    }
})

cancelar.addEventListener('click',e=>{
    location.href = "../index.html"
});


ipcRenderer.on('recibir-informacion',async (e,args)=>{
    provedorTraido = (await axios.get(`${URL}provedor/codigo/${args}`)).data;
    provedor.value = provedorTraido.provedor;
    codigo.value = provedorTraido.codigo;
    cond_iva.value = provedorTraido.condIva
    cuit.value = provedorTraido.cuit;
    puntoVenta.focus(); 
});



const listarFactura = async(factura)=>{
    const fecha_comp = factura.fecha_comp.slice(0,10).split('-',3);
    const fecha_imput = factura.fecha_imput.slice(0,10).split('-',3);

    provedor.value = factura.provedor;
    codigo.value = factura.codProv;
    cuit.value = factura.cuit;
    puntoVenta.value = factura.nro_comp.split('-',2)[0];
    numero.value = factura.nro_comp.split('-',2)[1];
    document.getElementById(factura.tipo_comp).checked = true;
    fechaComp.value = `${fecha_comp[0]}-${fecha_comp[1]}-${fecha_comp[2]}`;
    fechaImput.value = `${fecha_imput[0]}-${fecha_imput[1]}-${fecha_imput[2]}`;

    netoNoGravado.value = redondear(factura.netoNoGravado,2);
    netoGravado.value = redondear(factura.netoGravado,2);
    iva.value = redondear(factura.tasaIva,2);
    numeroIva.value = redondear(factura.iva,2);
    numeroIvaAnterior = factura.iva;

    percepcionIVA.value = redondear(factura.p_iva_c,2);
    percepcionDGR.value = redondear(factura.p_dgr_c,2);
    retencionDGR.value = redondear(factura.r_dgr_c,2);
    retencionIVA.value = redondear(factura.r_iva_c,2);

    total.value = redondear(factura.netoNoGravado + factura.netoGravado + factura.iva + factura.p_iva_c + factura.p_dgr_c + factura.r_dgr_c + factura.r_iva_c,2)

    descuentoPor.value =  redondear(100-(factura.total * 100 / parseFloat(total.value)),2);
    descuento.value = redondear(parseFloat(total.value) - factura.total ,2);

    neto.value = factura.total;

    cuentaCorriente.parentNode.parentNode.classList.add('none')

    modificar.classList.remove('none');
    aceptar.classList.add('none');
}