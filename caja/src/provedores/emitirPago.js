const {redondear, generarMovimientoCaja, configAxios} = require('../assets/js/globales');

const sweet = require('sweetalert2');

const axios = require('axios');
const { ipcRenderer } = require('electron');
require('dotenv').config();
const URL = process.env.URL;

//Provedor
const provedores = document.getElementById('provedores');
const codigo = document.getElementById('codigo');
const saldo = document.getElementById('saldo');
const condIva = document.getElementById('condIva');
const cuit = document.getElementById('cuit');
const numeroVenta = document.getElementById('numeroVenta');
//comprobante
const puntoVenta = document.getElementById('puntoVenta');
const numero = document.getElementById('numero');
const tipo = document.getElementById('tipo');
const descuento = document.getElementById('descuento');
const importe = document.getElementById('importe');

//cheques
const numeroCheque = document.getElementById('numeroCheque');
const banco = document.getElementById('banco');
const fecha = document.getElementById('fecha');
const importeCheque = document.getElementById('importeCheque');

const tbodyComprobante = document.getElementById('tbodyComprobante');
const tbodyCheque = document.getElementById('tbodyCheque');

//totales
const total = document.getElementById('total');
const totalCheque = document.getElementById('totalCheque');

//botones
const aceptar = document.getElementById('aceptar');
const cancelar = document.getElementById('cancelar');

let listaCheques = [];
let provedor;
let totalInput;
let facturas = [];

window.addEventListener('load',async e=>{
    let numero = (await axios.get(`${URL}tipoVenta/name/Ultimo Pago`,configAxios)).data;
    numeroVenta.value = numero + 1;
    let provedores = (await axios.get(`${URL}provedor`,configAxios)).data;
    provedores.sort((a,b)=>{
        if (a.provedor > b.provedor) {
            return 1
        }else if(a.provedor < b.provedor){
            return -1
        }
        return 0;
    });

    listarProductos(provedores);
});

provedores.addEventListener('keypress',async e=>{
    if (e.keyCode === 13) {
        e.preventDefault();
        provedor = (await axios.get(`${URL}provedor/codigo/${provedores.value}`,configAxios)).data;
        codigo.value = provedor.codigo;
        saldo.value = provedor.saldo.toFixed(2);
        condIva.value = provedor.situa;
        cuit.value = provedor.cuit;
        puntoVenta.focus();
    }
});

const listarProductos = (lista)=>{
    for(let elem of lista){
        const option = document.createElement('option');
        option.value = elem.codigo;
        option.text = elem.provedor;

        provedores.appendChild(option);
    }
};

//INPUTS Y SELECT DE COMPROBANTES
puntoVenta.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        numero.focus();
    }
});

numero.addEventListener('keypress',async e=>{
    const punto = puntoVenta.value.padStart(4,'0');
    const num = numero.value.padStart(8,'0');
    if (e.keyCode === 13) {
        facturas = (await axios.get(`${URL}dat_comp/nro_Comp/${punto + '-' + num}/${codigo.value}`,configAxios)).data;
        facturas.reverse();
        for await(let {_id,nro_comp,tipo_comp,total:precio} of facturas){
            if (_id) {
                const tr = document.createElement('tr');
                tr.id = _id;
        
                const button = document.createElement('button');
                button.innerText = "Eliminar";
        
                const tdNumero = document.createElement('td');
                const tdTipo = document.createElement('td');
                const tdImporte = document.createElement('td');
                const tdDescuento = document.createElement('td');
                const tdAciones = document.createElement('td');
        
                tdNumero.innerHTML = nro_comp;
                tdTipo.innerHTML = tipo_comp;
                tdImporte.innerHTML = tipo_comp === "Nota Credito" ? redondear(precio * -1,2) : precio.toFixed(2);
                tdDescuento.innerHTML = "0.00";
                tdAciones.appendChild(button)
        
                tr.appendChild(tdNumero);
                tr.appendChild(tdTipo);
                tr.appendChild(tdDescuento);
                tr.appendChild(tdImporte);
                tr.appendChild(tdAciones);
        
                tbodyComprobante.appendChild(tr);
                total.value = tipo_comp === "Nota Credito" ? redondear(parseFloat(parseFloat(total.value) - precio),2) : redondear(parseFloat(parseFloat(total.value) + precio),2);
        
                puntoVenta.value = "0000";
                numero.value = "00000000";
                puntoVenta.focus();
            }
        }
    }

});

tipo.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        e.preventDefault();
        if (descuento.classList.contains('none')) {
            importe.focus();
        }else{
            descuento.focus();
        }
    }
});

tipo.addEventListener('change',e=>{
    if (tipo.value === "Descuento") {
        descuento.classList.remove('none')
    }else{
        descuento.classList.add('none')
    }
});

descuento.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        const tr = document.getElementById('tbodyComprobante').lastElementChild;
        importe.value = redondear(-parseFloat(tr.children[3].innerHTML)*parseFloat(descuento.value)/100,2)
        importe.focus();
    }
});

importe.addEventListener('keypress',async e=>{
    if (e.keyCode === 13) {
        await agregarComprobante();
        importe.value = "0.00"
        puntoVenta.value = "0000";
        numero.value = "00000000";
        puntoVenta.focus();
    }
});

puntoVenta.addEventListener('focus',e=>{
    puntoVenta.select();
});

numero.addEventListener('focus',e=>{
    numero.select();
});

descuento.addEventListener('focus',e=>{
    descuento.select();
});

importe.addEventListener('focus',e=>{
    importe.select();
});

const agregarComprobante = ()=>{
    const tr = document.createElement('tr');

    const button = document.createElement('button');
    button.innerText = "Eliminar";

    const tdNumero = document.createElement('td');
    const tdTipo = document.createElement('td');
    const tdDescuento = document.createElement('td');
    const tdImporte = document.createElement('td');
    const tdEliminar = document.createElement('td');

    tdNumero.innerHTML = puntoVenta.value.padStart(4,'0') + '-' + numero.value.padStart(8,'0');
    tdTipo.innerHTML = tipo.value;
    tdDescuento.innerHTML = "0.00";
    tdImporte.innerHTML = parseFloat(importe.value).toFixed(2);
    tdEliminar.appendChild(button);

    tr.appendChild(tdNumero);
    tr.appendChild(tdTipo);
    tr.appendChild(tdDescuento);
    tr.appendChild(tdImporte);
    tr.appendChild(tdEliminar);

    tbodyComprobante.appendChild(tr);

    total.value = redondear(parseFloat(importe.value) + parseFloat(total.value),2);
}

//cheques

//cuanado apretamos enter si hay un numero buscamos en la base de datos el cheque y sino lo pasamos a banco
numeroCheque.addEventListener('keypress',async e=>{
    if (e.keyCode === 13) {
        if (numeroCheque.value !== "") {
            const cheque = (await axios.get(`${URL}cheques/numero/${numeroCheque.value}`,configAxios)).data;
            if (cheque && !cheque.entreg_a) {
                const fechaCheque = cheque.f_cheque.slice(0,10).split('-',3);
                const option = document.createElement('option');
                option.value = cheque.banco;
                option.text = cheque.banco;
                banco.appendChild(option);
                banco.value = option.value;
                fecha.value = `${fechaCheque[0]}-${fechaCheque[1]}-${fechaCheque[2]}`;
                importeCheque.value = redondear(cheque.i_cheque,2);
                banco.focus();
            }else if(cheque && cheque.entreg_a){
                await sweet.fire({
                    title:`Cheque Entregado a ${cheque.entreg_a}`
                });
                numeroCheque.value = "";
            }else{
                banco.focus();
            }
        }else{
            banco.focus();
        }
    }
});

banco.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        e.preventDefault();
        fecha.focus();
    }
});

fecha.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        importeCheque.focus();
    }
});

importeCheque.addEventListener('keypress',e=>{
   if (e.keyCode === 13) {
        agregarCheque();
   }
});

const agregarCheque = ()=>{
    const tr = document.createElement('tr');

    const button = document.createElement('button');
    button.innerHTML = "Eliminar";

    const tdNumero = document.createElement('td');
    const tdBanco = document.createElement('td');
    const tdFechaCheque = document.createElement('td');
    const tdImporteCheque = document.createElement('td');
    const tdEliminar = document.createElement('td');

    tdNumero.innerHTML = numeroCheque.value;
    tdBanco.innerHTML = banco.value.toUpperCase();
    tdFechaCheque.innerHTML = fecha.value;
    tdImporteCheque.innerHTML = importeCheque.value;
    tdEliminar.appendChild(button)

    tr.appendChild(tdNumero);
    tr.appendChild(tdBanco);
    tr.appendChild(tdFechaCheque);
    tr.appendChild(tdImporteCheque);
    tr.appendChild(tdEliminar);
    tbodyCheque.appendChild(tr);
    totalCheque.value = redondear(parseFloat(totalCheque.value) + parseFloat(importeCheque.value),2);

    const cheque = {};
    cheque.f_recibido = new Date();
    cheque.n_cheque = numeroCheque.value;
    cheque.banco = banco.value.toUpperCase();
    cheque.f_cheque = fecha.value;
    cheque.i_cheque = importeCheque.value;
    cheque.tipo = "P";
    cheque.vendedor;
    cheque.entreg_a = provedor.provedor;

    if (banco.value === "BANCO DE ENTRE RIOS") {
        listaCheques.push(cheque);
    }

    numeroCheque.value = "";
    banco.value = "BANCO DE ENTRE RIOS";
    fecha.value = "";
    importeCheque.value = "";

    numeroCheque.focus();
};

tbodyComprobante.addEventListener('click',e=>{
    if (e.target.nodeName === "BUTTON") {
        const tr = e.target.parentNode.parentNode
        total.value = redondear(parseFloat(total.value) - parseFloat(tr.children[3].innerHTML),2) ;
        tbodyComprobante.removeChild(tr);
    }
});

tbodyCheque.addEventListener('click',e=>{
    if (e.target.nodeName === "BUTTON") {
        const tr = e.target.parentNode.parentNode;
        totalCheque.value = redondear(parseFloat(totalCheque.value) - parseFloat(tr.children[3].innerHTML),2);
        tbodyCheque.removeChild(tr);
        const index = listaCheques.findIndex(elem=>elem.n_cheque = e.target.parentNode.parentNode.children[0].innerText);
        listaCheques.splice(index,1);
    }
});

aceptar.addEventListener('click',async e=>{
    await cambiarNumeroComprobantePago(document.querySelectorAll('#tbodyComprobante tr'));
    await cargarChequesPropios(listaCheques)
    await ponerEnComprobantePagos();
    if (parseFloat(total.value) === parseFloat(totalCheque.value)) {
         const comprobante = {};

        comprobante.fecha = new Date();
        const now = new Date();
        comprobante.fecha = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString();
        comprobante.codProv = codigo.value;
        comprobante.rSocial = provedores.value;
        comprobante.n_cheque = numeroCheque.value;

        await ponerEnCuentaCorriente();
        await descontarSaldoProvedor();
        await sumarNumeroPago();

        if (facturas.length !== 0) {
            for await(let fact of facturas){
                const cuenta = (await axios.get(`${URL}ctactePro/numero/${fact.nro_comp}`,configAxios)).data;
                cuenta.com_pago = numeroVenta.value;
                try {
                    await axios.put(`${URL}ctactePro/id/${cuenta._id}`,cuenta,configAxios);
                } catch (error) {
                    console.log(error)
                    await sweet.fire({
                        title:"No se pudo pone en cuenta corriente el comprobante de pago en el comprobante  numero " + cuenta.nro_comp
                    });
                }
            }
        };

        for await(let elem of listaCheques){
             await generarMovimientoCaja(elem.f_recibido,"I",elem.n_cheque,elem.banco,"BE",elem.i_cheque,elem.entreg_a)
        };
        await generarMovimientoCaja(comprobante.fecha,"E",numeroVenta.value,"FACTURA PROVEDORES","FP",total.value,provedor.provedor);


    const trs = document.querySelectorAll('#tbodyComprobante tr');
    const trs2 = document.querySelectorAll('#tbodyCheque tr');
    let arrayARecorrer = trs.length > trs2.length ? trs : trs2;
    let comprobantes = [];
    let i = 0;
    for await(let elem of arrayARecorrer){
        let aux = {}
        aux.numero = trs[i] ? trs[i].children[0].innerHTML : "";
        aux.tipo = trs[i] ? trs[i].children[1].innerHTML : "";
        aux.imp = trs[i] ? parseFloat(trs[i].children[3].innerHTML) : "";
        aux.remitidos = trs2[i] ? trs2[i].children[0].innerHTML  + " " + trs2[i].children[1].innerHTML : "";
        aux.importe = trs2[i] ? parseFloat(trs2[i].children[3].innerHTML) : "";
        i++;
        comprobantes.push(aux);
    }

    await ipcRenderer.send('imprimirComprobantePago',{
        provedor:provedor.provedor,
        fecha:comprobante.fecha,
        comprobantes:JSON.stringify(comprobantes),
        total: total.value
    });
    location.reload();
    }
});

const cargarChequesPropios = async(lista)=>{
    lista.forEach(async cheque => {
        await axios.post(`${URL}cheques`,cheque,configAxios);
    });
}

const ponerEnComprobantePagos = async() =>{
    const trComprobantes = document.querySelectorAll('#tbodyComprobante tr');
    const trValores = document.querySelectorAll('#tbodyCheque tr');

    for (let i = 0; i < trComprobantes.length; i++) {
        const comp_pago = {};

        comp_pago.codProv = codigo.value;
        comp_pago.rSocial = provedores.innerText;
        if (trValores[i]) {
            comp_pago.n_cheque = trValores[i].children[0].innerHTML;
            comp_pago.banco = trValores[i].children[1].innerHTML;
            comp_pago.imp_cheque = trValores[i].children[3].innerHTML;
        }else{
            comp_pago.imp_cheque = 0.00
        }
        comp_pago.nrm_comp = trComprobantes[i].children[0].innerHTML;
        comp_pago.tipo_comp = trComprobantes[i].children[1].innerHTML;
        comp_pago.imp_Fact = trComprobantes[i].children[3].innerHTML;
        comp_pago.n_opago = numeroVenta.value;
        try {
            await axios.post(`${URL}compPagos`,comp_pago,configAxios);
        } catch (error) {
            await sweet.fire({
                title:"No se pudo cargar la venta"
            });
            console.log(error)
        }
    }
}

const ponerEnCuentaCorriente = async()=>{
    const cuenta = {}
    cuenta.fecha = (new Date()).toISOString().slice(0,10);
    cuenta.codProv = codigo.value;
    cuenta.provedor = provedor.provedor;
    cuenta.tipo_comp = "Pago";
    cuenta.nro_comp = numeroVenta.value;
    cuenta.debe = 0;
    cuenta.haber = total.value;
    cuenta.saldo = redondear(provedor.saldo -  parseFloat(total.value),2);
    cuenta.com_pago = numeroVenta.value;
    try {
        await axios.post(`${URL}ctactePro`,cuenta,configAxios);
    } catch (error) {
        sweet.fire({
            title:"No se pudo cargar en cuenta corriente provedor"
        });
        console.log(error)
    }
};

const descontarSaldoProvedor = async()=>{
    provedor.saldo = redondear(provedor.saldo - parseFloat(total.value),2);
    try {
        await axios.put(`${URL}provedor/codigo/${provedor.codigo}`,provedor,configAxios)
    } catch (error) {
        sweet.fire({
            title: "No se pudo modificar el saldo del provedor, pero si se cargo en la cuenta corriente"
        })
    }
};

const sumarNumeroPago = async()=>{
    try {
        await axios.put(`${URL}tipoVenta/name/Ultimo Pago`,{valor:numeroVenta.value},configAxios);
    } catch (error) {
        sweet.fire({
            title:"No se pudo modifacar el numero de pago, pero si se cargo en la cuenta corriente y se desconto el saldo"
        });
    }
}

cancelar.addEventListener('click',e=>{
    location.href = '../index.html';
});


async function cambiarNumeroComprobantePago(lista) {
    for await(let elem of lista){
        if (elem.children[1].innerText !== "Pago Anticipado" && elem.children[1].innerText !== "Pago A Cuenta") {
            const comprobante = (await axios.get(`${URL}ctactePro/numero/${elem.children[0].innerText}`,configAxios)).data;
            comprobante.com_pago = numeroVenta.value;
            (await axios.put(`${URL}ctactePro/id/${comprobante._id}`,comprobante,configAxios));
        }
    }
}