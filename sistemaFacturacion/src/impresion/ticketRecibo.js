const { ipcRenderer } = require("electron");

const dia = document.querySelector('.dia');
const hora = document.querySelector('.hora');

const nombre = document.querySelector('.nombre');
const cuit = document.querySelector('.cuit');
const condIva = document.querySelector('.condIva');
const direccion = document.querySelector('.direccion');

const listaComprobantes = document.querySelector('.listaComprobantes');

const descuento = document.querySelector('.descuento');
const total = document.querySelector('.total');
const observaciones = document.querySelector('.observaciones');

ipcRenderer.on('info-para-imprimir',async (e,args) =>{
    const [recibo,cliente,lista,tipo,opciones] = JSON.parse(args)
    await listaRecibo(recibo);
    await listarCliente(cliente);
    await listarComprobantes(lista);

    ipcRenderer.send('imprimir',JSON.stringify(opciones));
});

function listaRecibo(recibo) {
    console.log(recibo)
    dia.innerText = recibo.fecha.slice(0,10).split('-',3).reverse().join('/');
    hora.innerText = recibo.fecha.slice(11,19).split(':',3).join(':');

    descuento.innerText = "0.00";
    total.innerText = recibo.precioFinal.toFixed(2);
    observaciones.innerText = recibo.observaciones;
}

function listarCliente(cliente) {
    nombre.innerText = cliente.cliente;
    let auxcuit = cliente.cuit.length === 11 ? `CUIT: ` : `DNI: `;
    cuit.innerHTML = `<p>${auxcuit}<span>${cliente.cuit}</span></p>`;
    condIva.innerText = cliente.cond_iva.toUpperCase();
    direccion.innerText = cliente.direccion;
};

function listarComprobantes(lista){
    lista.forEach(elem =>{
        listaComprobantes.innerHTML += 
        `
        <div>
            <p>${elem.fecha}</p>
            <p>${elem.numero}</p>
            <p>${parseFloat(elem.pagado).toFixed(2)}</p>
        </div>`
    });
};