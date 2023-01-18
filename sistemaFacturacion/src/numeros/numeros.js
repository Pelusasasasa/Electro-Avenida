const { ipcRenderer } = require("electron");

const inputs = document.querySelectorAll('input');
const modificar = document.querySelector('#modificar');
const grabar = document.querySelector('#grabar');
const cancelar = document.querySelector('#cancelar');
const axios = require("axios");
const { ultimasFacturas, redondear } = require("../funciones");
require("dotenv").config;
const URL = process.env.URL;

let dolarAux; 

modificar.addEventListener('click' , (e) => {
    e.preventDefault();
    modificar.classList.add('none');
    grabar.classList.remove('none');
    inputs.forEach(input => {
        input.removeAttribute("disabled")
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
const reciboA = document.querySelector('#reciboA');
const reciboB = document.querySelector('#reciboB');
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
        "Ultima Recibo A":reciboA.value,
        "Ultima Recibo B":reciboB.value,
        "Ultima N Credito B":creditoB.value,
        "Ultimo Recibo": recibo.value,
        "Ultimo Presupuesto":presupuesto.value,
        "Ultimo Remito": remito.value,
        "Ultimo Remito Contado": remitoC.value,
        "Ultimo Remito Cta Cte": remitoCorriente.value,
        "dolar":dolar.value
    };
    (parseFloat(dolarAux) !== parseFloat(dolar.value)) && cambiarPrecios(parseFloat(dolar.value));
    await axios.put(`${URL}tipoVenta`,numeros);
    
    // location.reload();
}

const recibirNumeros = async()=>{
    let numeros = await axios.get(`${URL}tipoVenta`);
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
    reciboA.value =numeros["Ultima Recibo A"];
    reciboB.value =numeros["Ultima Recibo B"];
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
    let productos = (await axios.get(`${URL}productos/buscarProducto/textoVacio/dolar`)).data;
    productos.sort((a,b)=>{
        if (a.descripcion>b.descripcion) {
            return 1
        }else if(a.descripcion<b.descripcion){
            return -1
        }

        return 0
    });
    const esperar = document.querySelector('.esperar');
    const a = productos.filter(producto => producto.costodolar !== 0);
    console.log(a)

    for await(let producto of a) {
        esperar.classList.remove('none');
        const costoMasIva = parseFloat(redondear((parseFloat(producto.impuestos)+parseFloat(producto.costodolar)),2))
        const costoTotal = parseFloat(redondear(dolar * costoMasIva,2));
        producto.precio_venta = (costoTotal+((parseFloat(producto.utilidad)*costoTotal/100))).toFixed(2);
        await axios.put(`${URL}productos/${producto._id}`,producto);
    };
        esperar.classList.add('none');
};


document.addEventListener('keydown',e=>{
    if (e.key === "Escape") {
        window.close();
    }
})
