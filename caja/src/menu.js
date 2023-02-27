const { ipcRenderer } = require("electron");
const sweet = require('sweetalert2');


const axios = require('axios');
require('dotenv').config();
const URL = process.env.URL;

const cheques = document.querySelector('.cheques');
const tarjetas = document.querySelector('.tarjetas');

document.addEventListener('click',e=>{
    if (e.target.nodeName === "MAIN") {
        window.location = `${e.target.className}/${e.target.className}.html`;
    }else if(e.target.nodeName === "H1"){
        window.location = `${e.target.parentNode.className}/${e.target.parentNode.className}.html`;
    }
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
    const numeros = (await axios.get(`${URL}tipoVenta`)).data;
    const saldo = numeros["saldo Inicial"];
    console.log(saldo)
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
                await axios.put(`${URL}tipoVenta`,numeros)
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

ipcRenderer.on('facturas',(e,args)=>{
    location.href = "vales/facturasACobrar.html";
});

ipcRenderer.on('valesACobrar',(e,args)=>{
    location.href = "vales/valesACobrar.html";
});

ipcRenderer.on('valesPersonal',(e,args)=>{
    location.href = "vales/valesPersonal.html";
});

ipcRenderer.on('valesIncobrables',(e,args)=>{
    location.href = "vales/valesIncobrables.html";
});

ipcRenderer.on('tarjetas',(e,args)=>{
    location.href = "tarjetas/tarjetas.html";
});

ipcRenderer.on('cheques',(e,args)=>{
    location.href = "cheques/cheques.html";
});

ipcRenderer.on('ingresoFacturas',(e,args)=>{
    location.href = "compras/ingresoFacturas.html";
});

ipcRenderer.on('modificarCompras',(e,args)=>{
    location.href = "compras/modificarCompras.html";
});

ipcRenderer.on('deCompras',(e,args)=>{
    location.href = "compras/deCompras.html";
});

ipcRenderer.on('emitirPago',(e,args)=>{
    location.href = "provedores/emitirPago.html";
});

ipcRenderer.on('cobranzaFacturas',(e,args)=>{
    location.href = "caja/cobranzaFacturas.html"
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