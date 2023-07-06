const { ipcRenderer } = require("electron");

const inputs = document.querySelectorAll('input');
const modificar = document.querySelector('#modificar');
const grabar = document.querySelector('#grabar');
const alerta = document.querySelector('.alerta');

const cancelar = document.querySelector('#cancelar');
const axios = require("axios");
const { ultimasFacturas, redondear, configAxios, cerrarVentana } = require("../funciones");
require("dotenv").config;
const URL = process.env.URL;

let dolarAux; 

modificar.addEventListener('click' , (e) => {
    e.preventDefault();
    modificar.classList.add('none');
    grabar.classList.remove('none');
    inputs.forEach(input => {
        if (input.id !== "facturaA" && input.id !== "facturaB") {
            input.removeAttribute("disabled");
        };
    })
})

grabar.addEventListener('click',e=>{
    guardarDatos();
    modificar.classList.remove("none");
    grabar.classList.add('none');
    inputs.forEach(input => {
        input.setAttribute("disabled","")
    })
    
})
const facturaA = document.querySelector('#facturaA');
const facturaB = document.querySelector('#facturaB');
const creditoA = document.querySelector('#creditoA');
const creditoB = document.querySelector('#creditoB');
const recibo = document.querySelector('#recibo');
const presupuesto= document.querySelector('#presupuesto');
const remito= document.querySelector('#remito');
const remitoC= document.querySelector('#remitoC');
const remitoCorriente = document.querySelector('#remitoCorriente');
const dolar = document.querySelector('#dolar');


async function guardarDatos() {    
    const numeros = {
        "Ultima Factura A": facturaA.value,
        "Ultima Factura B": facturaB.value,
        "Ultima N Credito A":creditoA.value,
        "Ultima N Credito B":creditoB.value,
        "Ultimo Recibo": recibo.value,
        "Ultimo Presupuesto":presupuesto.value,
        "Ultimo Remito": remito.value,
        "Ultimo Remito Contado": remitoC.value,
        "Ultimo Remito Cta Cte": remitoCorriente.value,
        "dolar":dolar.value
    };
    (parseFloat(dolarAux) !== parseFloat(dolar.value)) && cambiarPrecios(parseFloat(dolar.value));
    await axios.put(`${URL}tipoVenta`,numeros,configAxios);
    
    // location.reload();
}

const recibirNumeros = async()=>{
    let numeros = await axios.get(`${URL}tipoVenta`,configAxios);
    numeros=numeros.data;
    ponerInpusnumero(numeros)
}
recibirNumeros()

const ponerInpusnumero = async(objeto)=>{
    const numeros = objeto

    setTimeout(async () => {
        facturaA.value = await ultimasFacturas(5,1)
        facturaB.value = await ultimasFacturas(5,6) 
    }, 0);

    creditoA.value = numeros["Ultima N Credito A"];
    creditoB.value = numeros["Ultima N Credito B"];
    recibo.value =numeros["Ultimo Recibo"];
    presupuesto.value =numeros["Ultimo Presupuesto"];
    remito.value =numeros["Ultimo Remito"];
    remitoC.value =numeros["Ultimo Remito Contado"];
    remitoCorriente.value =numeros["Ultimo Remito Cta Cte"];
    dolarAux = numeros.dolar;
    dolar.value = numeros.dolar;
}

cancelar.addEventListener('click', ()=>{
    window.close()
})


async function cambiarPrecios(dolar) {
    dolarAux = dolar;
    //cambiamos el precio de los productos con dolares
    let productos = (await axios.get(`${URL}productos/buscarProducto/textoVacio/dolar`,configAxios)).data;
    productos.sort((a,b)=>{
        if (a.descripcion>b.descripcion) {
            return 1
        }else if(a.descripcion<b.descripcion){
            return -1
        }

        return 0
    });
    const a = productos.filter(producto => producto.costodolar !== 0);

    for await(let producto of a) {
        alerta.classList.remove('none');
        const costoMasIva = parseFloat(redondear((parseFloat(producto.impuestos)+parseFloat(producto.costodolar)),2))
        const costoTotal = parseFloat(redondear(dolar * costoMasIva,2));
        producto.precio_venta = (costoTotal+((parseFloat(producto.utilidad)*costoTotal/100))).toFixed(2);
        await axios.put(`${URL}productos/${producto._id}`,producto,configAxios);
    };
    alerta.classList.add('none')
        
};


document.addEventListener('keydown',cerrarVentana);

creditoA.addEventListener('keyup',(e)=>{
    if (e.keyCode === 13) {
        creditoB.focus();
    }
});

creditoB.addEventListener('keyup',(e)=>{
    if (e.keyCode === 13) {
        recibo.focus();
    }
});

recibo.addEventListener('keyup',(e)=>{
    if (e.keyCode === 13) {
        presupuesto.focus();
    }
});

presupuesto.addEventListener('keyup',(e)=>{
    if (e.keyCode === 13) {
        remito.focus();
    }
});

remito.addEventListener('keyup',(e)=>{
    if (e.keyCode === 13) {
        remitoC.focus();
    }
});

remitoC.addEventListener('keyup',(e)=>{
    if (e.keyCode === 13) {
        remitoCorriente.focus();
    }
});

remitoCorriente.addEventListener('keyup',(e)=>{
    if (e.keyCode === 13) {
        dolar.focus();
    }
});

dolar.addEventListener('keyup',(e)=>{
    if (e.keyCode === 13) {
        grabar.focus();
    }
});
