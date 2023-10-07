const { ipcRenderer } = require("electron");
const sweet = require('sweetalert2');


const axios = require('axios');
const { redondear, configAxios } = require("./assets/js/globales");
require('dotenv').config();
const URL = process.env.URL;

const ingresarFacturas = document.querySelector('.ingresarFacturas');
const emitirPago = document.querySelector('.emitirPago');
const cuentaCorriente = document.querySelector('.cuentaCorriente');
const cheques = document.querySelector('.cheques');
const tarjetas = document.querySelector('.tarjetas');
const cajaGeneral = document.querySelector('.cajaGeneral');

document.addEventListener('keyup',e=>{
    if (e.keyCode === 112) {
        location.href = 'compras/ingresoFacturas.html';
    }else if(e.keyCode === 113){
        location.href = 'provedores/emitirPago.html';
    }else if(e.keyCode === 114){
        const options = {
            path:"provedores/cuentaCorriente.html",
            width:1200,
            height:1000
        };
    
        ipcRenderer.send('abrir-ventana',options);
    }else if(e.keyCode === 115){
        location.href = 'cheques/cheques.html';
    }else if(e.keyCode === 116){
        location.href = 'tarjetas/tarjetas.html';
    }else if(e.keyCode === 117){
        const options = {
            path: "caja/informeCaja.html",
            width:1200,
            height:1200
        };
    
        ipcRenderer.send('abrir-ventana',options);
    };

});

ingresarFacturas.addEventListener('click',()=>{
    location.href = 'compras/ingresoFacturas.html';
});

emitirPago.addEventListener('click',()=>{
    location.href = 'provedores/emitirPago.html';
});

cuentaCorriente.addEventListener('click',()=>{
    const options = {
        path:"provedores/cuentaCorriente.html",
        width:1200,
        height:1000
    };

    ipcRenderer.send('abrir-ventana',options);
});

cheques.addEventListener('click',e=>{
    location.href = 'cheques/cheques.html';
});

tarjetas.addEventListener('click',e=>{
    location.href = 'tarjetas/tarjetas.html';
});

cajaGeneral.addEventListener('click',e=>{
    const options = {
        path: "caja/informeCaja.html",
        width:1200,
        height:1200
    };

    ipcRenderer.send('abrir-ventana',options);
});

ipcRenderer.on('fechas',async e=>{
    sweet.fire({
        html:`<section class=fechas>
                <main>
                    <label for="desde">Desde</label>
                    <input type="date" id="desde" name="desde" />
                </main>
                <main>
                <label for="hasta">Hasta</label>
                <input type="date" id="hasta" name="hasta" />
            </main>
              </section>`,
        confirmButtonText:"Aceptar",
        showCancelButton:true,
    }).then(({isConfirmed})=>{
        if (isConfirmed) {
            ipcRenderer.send('abrir-ventana',{
                path:"caja/resumenValores.html",
                width:1200,
                height:1000,
                informacion:{
                    desde:desde.value,
                    hasta:hasta.value
                }
            });
        }
    });

    fechaHoy('hasta')
    primeroDelMes('desde')
});

ipcRenderer.on('fecha',(e,args)=>{
    sweet.fire({
        html:"<input id='fecha' type='date'>",
        title:"Hasta Fecha",
        confirmButtonText:"Aceptar",
        showCancelButton:true,
    }).then(({isConfirmed})=>{
        if (isConfirmed) {
            ipcRenderer.send('abrir-ventana',{
                path:"datos/listaSaldo.html",
                width:1200,
                height:1200
            })
        }
    })

    fechaHoy('fecha')
});

ipcRenderer.on('saldoInicial',async (e,args)=>{
    const numeros = (await axios.get(`${URL}tipoVenta`,configAxios)).data;
    const saldo = numeros["saldo Inicial"];
    sweet.fire({
        title:"Saldo Inicial",
        html:`<input id='saldoInicial' value=${saldo} type:number>`,
        confirmButtonText:"Guardar",
        showCancelButton:true,
    }).then(async ({isConfirmed,value})=>{
        const saldoNuevo = parseFloat(document.getElementById('saldoInicial').value)
        if (isConfirmed && saldoNuevo !== saldo) {
            numeros["saldo Inicial"] = saldoNuevo
            try {
                console.log(numeros)
                await axios.put(`${URL}tipoVenta`,numeros,configAxios)
            } catch (error) {
                console.log(error)
            }
        }
    });
});

const fechaHoy = (id)=>{
    const input = document.getElementById(id);

    const now = new Date();
    let date = now.getDate();
    let month = now.getMonth() + 1;
    let year = now.getFullYear();

    month = month === 13 ? 1 : month;
    date = date < 10 ? `0${date}` : date ;
    month = month < 10 ? `0${month}` : month ;

    input.value = `${year}-${month}-${date}`;
};

const primeroDelMes = (id)=>{
    const input = document.getElementById(id);

    const now = new Date();
    let month = now.getMonth() + 1;
    let year = now.getFullYear();

    month = month === 13 ? 1 : month;
    month = month < 10 ? `0${month}` : month ;

    input.value = `${year}-${month}-01`;
}

ipcRenderer.on('modificar',async e=>{
    await reingresarContraseña();
});

ipcRenderer.on('reordenarSaldo',async e=>{
    let select = "";
    const provedores = (await axios.get(`${URL}provedor`,configAxios)).data;
    provedores.sort((a,b)=>{
        if (a.provedor>b.provedor) {
            return 1
        }else if(a.provedor < b.provedor){
            return -1
        }
        return 0
    });
    for(let provedor of provedores){
        const option = document.createElement('option');
        option.value = provedor._id;
        option.text = provedor.provedor;
        select += `<option value="${provedor.codigo}">${provedor.provedor}</option>`;
    }
    await sweet.fire({
        title:"Provedores",
        html:`
            <select name="provedores" autofocus id="provedores">
            ${select}
            </select>
        `,
        showCancelButton:true,
        confirmButtonText:"Aceptar",
    }).then(async({isConfirmed})=>{
        if (isConfirmed) {
            reodernarSaldos();
        }
    });
});

const reingresarContraseña = async()=>{ 
    let retorno = false
    await sweet.fire({
        title:"Contraseña",
        input:"password",
        confirmButtonText:"Aceptar",
        showCancelButton:true
    }).then(async({isConfirmed,value})=>{
        if (isConfirmed && value === "54321") {
            location.href = './caja/modificar.html';
        }else if(isConfirmed && value !== "54321"){
            await sweet.fire({
                title:"Contraseña Incorrecta"
            })
            reingresarContraseña();
        }
    });
};

async function reodernarSaldos(){
    const codigo = document.getElementById('provedores').value;
    const cuentas = (await axios.get(`${URL}ctactePro/codigo/${codigo}`,configAxios)).data;

    cuentas.sort((a,b)=>{
        if (a.fecha>b.fecha) {
            return 1
        }else if (a.fecha<b.fecha) {
            return -1
        }
        return 0
    });
    let saldo = 0;
    
    for await(let cuenta of cuentas){
        saldo =  parseFloat(redondear(saldo + cuenta.debe,2));
        saldo = parseFloat(redondear(saldo - cuenta.haber,2));
        cuenta.saldo = saldo;
        await axios.put(`${URL}ctactePro/id/${cuenta._id}`,cuenta,configAxios);
    };
    sweet.fire({
        title:"Saldo reodenado",
        icon:"success"
    });
}