const desde = document.getElementById('desde');
const hasta = document.getElementById('hasta');

const sweet = require('sweetalert2');

const axios = require('axios');
const { redondear, copiar,configAxios, cerrarVentana } = require('../assets/js/globales');
require('dotenv').config();
const URL = process.env.URL;

const modificar = document.getElementById('modificar');
const eliminar = document.getElementById('eliminar');
const salir = document.getElementById('salir');

const tbody = document.querySelector('tbody');

let facturas = [];
let seleccionado;
let subSeleccionado;

window.addEventListener('load',async e=>{
    copiar();

    const date = new Date();

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    month = month === 13 ? 1 : month;
    day = day < 10 ? `0${day}` : day;
    month = month < 10 ? `0${month}` : month;

    desde.value = `${year}-${month}-${day}`;
    hasta.value = `${year}-${month}-${day}`;

    facturas = (await axios.get(`${URL}dat_comp/between/${desde.value}/${hasta.value}`,configAxios)).data;
    listarCompras(facturas)
});

desde.addEventListener('change',async e=>{
    if (desde.value) {
        facturas = (await axios.get(`${URL}dat_comp/between/${desde.value}/${hasta.value}`,configAxios)).data;
        listarCompras(facturas)
    }
});

hasta.addEventListener('change',async e=>{
    if (hasta.value) {
        facturas = (await axios.get(`${URL}dat_comp/between/${desde.value}/${hasta.value}`,configAxios)).data;
        listarCompras(facturas);
    }
});

const listarCompras = async(lista)=>{
    tbody.innerHTML = "";
    for(let elem of lista){
        const tr = document.createElement('tr');
        tr.id = elem._id;

        const tdFechaComp = document.createElement('td');
        const tdFechaImp = document.createElement('td');
        const tdTipoComp = document.createElement('td');
        const tdNumeroComp = document.createElement('td');
        const tdCodProv = document.createElement('td');
        const tdProvedor = document.createElement('td');
        const tdNoGravado = document.createElement('td');
        const tdNetoGravado = document.createElement('td');
        const tdTasaIva = document.createElement('td');
        const tdIva = document.createElement('td');
        const tdPDGRC = document.createElement('td');
        const tdPIVAC = document.createElement('td');
        const tdRDGRC = document.createElement('td');
        const tdRIVAC = document.createElement('td');
        const tdTotal = document.createElement('td');

        let fechaComp = elem.fecha_comp.slice(0,10).split('-',3);
        let fechaImp = elem.fecha_imput.slice(0,10).split('-',3);

        tdFechaComp.innerHTML = `${fechaComp[2]}/${fechaComp[1]}/${fechaComp[0]}`;
        tdFechaImp.innerHTML = `${fechaImp[2]}/${fechaImp[1]}/${fechaImp[0]}`;
        tdTipoComp.innerHTML = elem.tipo_comp;
        tdNumeroComp.innerHTML = elem.nro_comp;
        tdCodProv.innerHTML = elem.codProv;
        tdProvedor.innerHTML = elem.provedor;
        tdNoGravado.innerHTML = redondear(elem.netoNoGravado,2);
        tdNetoGravado.innerHTML = redondear(elem.netoGravado,2);
        tdTasaIva.innerHTML = redondear(elem.tasaIva,2);
        tdIva.innerHTML = redondear(elem.iva,2);
        tdPDGRC.innerHTML = redondear(elem.p_dgr_c,2);
        tdPIVAC.innerHTML = redondear(elem.p_iva_c,2);
        tdRDGRC.innerHTML = redondear(elem.r_dgr_c,2);
        tdRIVAC.innerHTML = redondear(elem.r_iva_c,2);
        tdTotal.innerHTML = redondear(elem.total,2);

        tr.appendChild(tdFechaComp);
        tr.appendChild(tdFechaImp);
        tr.appendChild(tdTipoComp);
        tr.appendChild(tdNumeroComp);
        tr.appendChild(tdCodProv);
        tr.appendChild(tdProvedor);
        tr.appendChild(tdNoGravado);
        tr.appendChild(tdNetoGravado);
        tr.appendChild(tdTasaIva);
        tr.appendChild(tdIva);
        tr.appendChild(tdPDGRC);
        tr.appendChild(tdPIVAC);
        tr.appendChild(tdRDGRC);
        tr.appendChild(tdRIVAC);
        tr.appendChild(tdTotal);

        tbody.appendChild(tr)

    }
}

tbody.addEventListener('click',e=>{

    seleccionado && seleccionado.classList.remove('seleccionado');
    seleccionado = e.target.nodeName === "TD" ? e.target.parentNode : e.target;
    seleccionado.classList.add('seleccionado');

    subSeleccionado && subSeleccionado.classList.remove('subSeleccionado');
    subSeleccionado = e.target.nodeName === "TD" ? e.target : e.target.children[0];
    subSeleccionado.classList.add('subSeleccionado');
});

modificar.addEventListener('click',e=>{
    if (seleccionado) {
        location.href = `ingresoFacturas.html?numero=${seleccionado.id}`
    }else{
        sweet.fire({
            title:"Seleccionar un Comprobante"
        })
    }
});

eliminar.addEventListener('click',e=>{
    sweet.fire({
        title:"Eliminar compra?",
        confirmButtonText:"Aceptar",
        showCancelButton:true
    }).then(async ({isConfirmed})=>{
        if(isConfirmed){
            try {
                await axios.delete(`${URL}dat_comp/id/${seleccionado.id}`,configAxios);
            } catch (error) {
                console.log(error);
                sweet.fire({
                    title:"No se pudo eliminar la compra"
                })
            }
        }
    })
})

salir.addEventListener('click',e=>{
    location.href = '../index.html';
});

document.addEventListener('keyup',e=>{
    if (e.keyCode === 27) {
        location.href = '../index.html';
    }
});