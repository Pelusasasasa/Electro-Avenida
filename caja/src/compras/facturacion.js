const axios = require('axios');
const { redondear } = require('../assets/js/globales');
require('dotenv').config();
const URL = process.env.URL;

const tbodyFacturas = document.querySelector('.tbodyFacturas');
const tbodyNotaCreditos = document.querySelector('.tbodyNotaCreditos');
const tbodyCompras = document.querySelector('.tbodyCompras');

const mes = document.getElementById('mes');
const buscar = document.getElementById('buscar');

window.addEventListener('load',inicio);
buscar.addEventListener('click',busqueda);

async function getFacturas() {
    const month = mes.value.split('-')[1];
    const year = mes.value.split('-')[0];

    const ventas = (await axios.get(`${URL}ventas/forMonthAndYear/${month}/${year}`)).data;
    return ventas
};

async function getCompras(){
    const month = mes.value.split('-')[1];
    const year = mes.value.split('-')[0];

    const compras = (await axios.get(`${URL}dat_comp/forMonthAndYear/${month}/${year}`)).data;

    return compras
};

async function inicio(){
    const year = new Date().getFullYear();
    let month = new Date().getMonth() + 1;

    month = month === 13 ? 1 : month;
    month = month < 10 ?  `0${month}` : month;

    mes.value = year + '-' + month;
};

async function busqueda(){
    const tickets = await getFacturas();
    const compras = await getCompras();
    const facturas = tickets.filter(ticket => ticket.tipo_comp === 'Ticket Factura');
    const notas = tickets.filter(ticket => ticket.tipo_comp === 'Nota Credito');
    

    listarFacturas(facturas);
    listarNotas(notas);
    listarCompras(compras);

    totales();
};

async function listarFacturas(facturas){

    let auxTotal = 0;
    let auxIva21 = 0;
    let auxIva105 = 0;

    let totalIva21 = 0;
    let totalIva105 = 0;
    let totalPrecio = 0;

    for(let i=0; i < facturas.length; i++){
        const factura = facturas[i];

        totalIva21 += factura.iva21;
        totalIva105 += factura.iva105;
        totalPrecio += factura.precioFinal;
        
        const  fechaSig = facturas[i+1] ? new Date(facturas[i+1].fecha).getDate() : -1;
        
        if (new Date(factura.fecha).getDate() !== fechaSig) {
            const tr = document.createElement('tr');

            const tdDia = document.createElement('td');
            const tdGravado = document.createElement('td');
            const tdIva21 = document.createElement('td');
            const tdIva105 = document.createElement('td');
            const tdTotal = document.createElement('td');
            
            const dia = new Date(factura.fecha).getDate();

            tdDia.innerText = dia < 10 ? `0${dia}` : dia;
            tdGravado.innerText = redondear(totalPrecio - totalIva21 - totalIva105,2);
            tdIva21.innerText = totalIva21.toFixed(2)
            tdIva105.innerText = totalIva105.toFixed(2);
            tdTotal.innerText = totalPrecio.toFixed(2);
            
            tr.appendChild(tdDia)
            tr.appendChild(tdGravado);
            tr.appendChild(tdIva21);
            tr.appendChild(tdIva105);
            tr.appendChild(tdTotal);
    
            tbodyFacturas.appendChild(tr);

            auxIva21 += totalIva21; 
            auxIva105 += totalIva105; 
            auxTotal += totalPrecio;

            totalIva21 = 0;
            totalIva105 = 0;
            totalPrecio = 0;
        };

        let gravado = document.getElementById('gravadoF');
        let iva21 = document.getElementById('iva21F');
        let iva105 = document.getElementById('iva105F');
        let totalF = document.getElementById('totalF');

        gravado.innerText = redondear(auxTotal - auxIva21 - auxIva105,2);
        iva21.innerText = auxIva21.toFixed(2);
        iva105.innerText = auxIva105.toFixed(2);
        totalF.innerText = auxTotal.toFixed(2);


    }
};

async function listarNotas(facturas){
    let totalIva21 = 0;
    let totalIva105 = 0;
    let totalPrecio = 0;

    let auxTotal = 0;
    let auxIva21 = 0;
    let auxIva105 = 0;

    for(let i=0; i < facturas.length; i++){
        const factura = facturas[i];

        totalIva21 += factura.iva21;
        totalIva105 += factura.iva105;
        totalPrecio += factura.precioFinal;

        const  fechaSig = facturas[i+1] ? new Date(facturas[i+1].fecha).getDate() : -1;
        
        if (new Date(factura.fecha).getDate() !== fechaSig) {
            const tr = document.createElement('tr');

            const tdDia = document.createElement('td');
            const tdGravado = document.createElement('td');
            const tdIva21 = document.createElement('td');
            const tdIva105 = document.createElement('td');
            const tdTotal = document.createElement('td');
            
            const dia = new Date(factura.fecha).getDate();

            tdDia.innerText = dia < 10 ? `0${dia}` : dia;
            tdGravado.innerText = redondear(totalPrecio - totalIva21 - totalIva105,2);
            tdIva21.innerText = totalIva21.toFixed(2)
            tdIva105.innerText = totalIva105.toFixed(2);
            tdTotal.innerText = totalPrecio.toFixed(2);
            
            tr.appendChild(tdDia)
            tr.appendChild(tdGravado);
            tr.appendChild(tdIva21);
            tr.appendChild(tdIva105);
            tr.appendChild(tdTotal);
    
            tbodyNotaCreditos.appendChild(tr);

            auxIva21 -= totalIva21; 
            auxIva105 -= totalIva105; 
            auxTotal -= totalPrecio;

            totalIva21 = 0;
            totalIva105 = 0;
            totalPrecio = 0;
        }
    };

    let gravado = document.getElementById('gravadoN');
    let iva21 = document.getElementById('iva21N');
    let iva105 = document.getElementById('iva105N');
    let totalF = document.getElementById('totalN');

    gravado.innerText = redondear(auxTotal - auxIva21 - auxIva105,2);
    iva21.innerText = auxIva21.toFixed(2);
    iva105.innerText = auxIva105.toFixed(2);
    totalF.innerText = auxTotal.toFixed(2);
};

async function listarCompras(compras){
    
    let auxIva = 0;
    let pDgrC = 0;
    let rDgrC = 0;
    let pIvaC = 0;
    let rIvaC = 0;

    compras.sort((a,b)=>{
        if (a.fecha_comp > b.fecha_comp) {
            return 1;
        }else if(b.fecha_comp > a.fecha_comp){
            return -1
        };
        return 0  
    });

    for (let i = 0; i < compras.length; i++) {
        const tr = document.createElement('tr');
        
        const {tipo_comp,iva,p_dgr_c,r_dgr_c,p_iva_c,r_iva_c} = compras[i];
        
        const tdIva = document.createElement('td'); 
        const tdPBrutos = document.createElement('td');
        const tdRBrutos = document.createElement('td');
        const tdPIva = document.createElement('td');
        const tdRIva = document.createElement('td');

        tdIva.innerText = tipo_comp !== "Nota Credito" ? iva.toFixed(2) : (iva * -1).toFixed(2);
        tdPBrutos.innerText = tipo_comp !== "Nota Credito" ? p_dgr_c.toFixed(2) : (p_dgr_c * -1).toFixed(2);
        tdRBrutos.innerText = tipo_comp !== "Nota Credito" ? r_dgr_c.toFixed(2) : (r_dgr_c * -1).toFixed(2);
        tdPIva.innerText = tipo_comp !== "Nota Credito" ? p_iva_c.toFixed(2) : (p_iva_c * -1).toFixed(2);
        tdRIva.innerText = tipo_comp !== "Nota Credito" ? r_iva_c.toFixed(2) : (r_iva_c * -1).toFixed(2);


        tr.appendChild(tdIva);
        tr.appendChild(tdPBrutos);
        tr.appendChild(tdRBrutos);
        tr.appendChild(tdPIva);
        tr.appendChild(tdRIva);

        tbodyCompras.appendChild(tr);

        if (tipo_comp === 'Nota Credito') {
            auxIva -= iva;
            pDgrC -= p_dgr_c;
            rDgrC -= r_dgr_c;
            pIvaC -= p_iva_c;
            rIvaC -= r_iva_c;
        }else{
            auxIva += iva;
            pDgrC += p_dgr_c;
            rDgrC += r_dgr_c;
            pIvaC += p_iva_c;
            rIvaC += r_iva_c;
        }
    };

    const ivaC = document.getElementById('ivaC');
    const pBru = document.getElementById('pBru');
    const rBru = document.getElementById('rBru');
    const pIva = document.getElementById('pIva');
    const rIva = document.getElementById('rIva');

    ivaC.innerText = auxIva.toFixed(2);
    pBru.innerText = pDgrC.toFixed(2);
    rBru.innerText = rDgrC.toFixed(2);
    pIva.innerText = pIvaC.toFixed(2);
    rIva.innerText = rIvaC.toFixed(2);

};

async function totales() {

    //gravado
    const gravadoF = document.getElementById('gravadoF');
    const gravadoN = document.getElementById('gravadoN');

    const gravadoT = document.getElementById('gravadoT');
    gravadoT.innerText = redondear(parseFloat(gravadoF.innerText) + parseFloat(gravadoN.innerText),2);

    //iva
    const iva21F = document.getElementById('iva21F');
    const iva105F = document.getElementById('iva105F');
    const iva21N = document.getElementById('iva21N');
    const iva105N = document.getElementById('iva105N');

    const ivaT = document.getElementById('ivaT');
    ivaT.innerText = redondear(parseFloat(iva21F.innerText) + parseFloat(iva105F.innerText) + parseFloat(iva21N.innerText) + parseFloat(iva105N.innerText),2);

    //total
    const total = document.getElementById('total');
    total.innerText = redondear(parseFloat(gravadoT.innerText) + parseFloat(ivaT.innerText),2);

};

document.addEventListener('keydown',(e)=>{

    if (e.keyCode === 27) {
        location.href = '../index.html';
    }

});


