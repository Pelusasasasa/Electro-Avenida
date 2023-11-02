const axios = require("axios");
require('dotenv').config();
const URL = process.env.URL;

const { ipcRenderer } = require("electron");
const qrcode = require('qrcode');
const { configAxios } = require("../funciones");

const codFactura = document.querySelector('.codFactura');
const tipo = document.querySelector('.tipo');
const numeroFactura = document.querySelector('.numeroFactura');
const fecha = document.querySelector('.dia');
const hora = document.querySelector('.hora');


const nombre = document.querySelector('.nombre');
const cuit = document.querySelector('.cuit');
const condIva = document.querySelector('.condIva');
const direccion = document.querySelector('.direccion');
const numeroAsociado = document.querySelector('.numeroAsociado');

const listaProductos = document.querySelector('.listaProductos');
const discriminadorIva = document.querySelector('.discriminadorIva');


//En caso de recibo
const cantidadPrecio = document.querySelector('.cantidadPrecio');
const iva = document.querySelector('.iva');
const descri = document.querySelector('.descri');
const BI = document.querySelector('.BI');
const importe = document.querySelector('.importe');
const observaciones = document.querySelector('.observaciones');

//total
const descuento = document.querySelector('.descuento');
const total = document.querySelector('.total');
const tipoVenta = document.querySelector('.tipoVenta');
const divAfip = document.querySelector('.afip');

//afip
const qr = document.querySelector('.qr');
const cae = document.querySelector('.cae');
const venciCae = document.querySelector('.venciCae');


 ipcRenderer.on('info-para-imprimir',async (e,args)=>{
    [venta,afip,,movimientos,opciones] = JSON.parse(args);
    let cliente;

    if (venta.tipo_comp === "Recibos") {
        cliente = (await axios.get(`${URL}clientes/id/${venta.codigo}`,configAxios)).data;
    }else{
        cliente = (await axios.get(`${URL}clientes/id/${venta.cliente}`,configAxios)).data;
        cliente._id = venta.cliente;
        cliente.cliente = venta.nombreCliente;
        cliente.direcioon = venta.direccion;
        cliente.cuit = venta.dnicuit;
        cliente.cond_iva = venta.condIva;
    };
    await infoComprobante(venta);
    await listarCliente(cliente);
    movimientos ? await listaMovimientos(movimientos,venta) : await listar(venta,afip,opciones);
    await listarAfip(afip);
    await ipcRenderer.send('imprimir',JSON.stringify(opciones));
 });

async function infoComprobante(venta) {
    //fecha y hora
    let date = venta.fecha.slice(0,10).split('-',3).reverse().join('/')
    let time = venta.fecha.slice(11,19).split(':',3).join(':');

    const tipoFactura = verTipoFactura(venta.cod_comp)
    codFactura.innerHTML = venta.cod_comp ?  "0"+venta.cod_comp : "06";
    tipo.innerHTML = tipoFactura;
    numeroFactura.innerHTML = venta.nro_comp;

    fecha.innerHTML = date;
    hora.innerHTML = time;
    venta.numeroAsociado && (numeroAsociado.innerHTML = "Comp Original Nº:" + venta.numeroAsociado);

    //Totales
    descuento.innerHTML = venta.descuento ? parseFloat(venta.descuento).toFixed(2) : "0.00";
    total.innerHTML = parseFloat(venta.precioFinal).toFixed(2);
    tipoVenta.innerHTML = (venta.tipo_pago !== "CC" || venta.cliente === "M122" || venta.cliente === "A029") ? `Contado: ${parseFloat(venta.precioFinal).toFixed(2)}` : "Cuenta Corriente";
}

async function listar(venta,afip,opciones){
    
    if (venta.tipo_comp !== "Recibos") {
        if(venta.productos){    
            for await(let {objeto,cantidad} of venta.productos){
                const iva = objeto.iva === "N" ? 1.21 : 1.105;
                listaProductos.innerHTML += `
                    <div class="cantidad">
                        <p>${cantidad}/${venta.condIva === "Inscripto" ? (objeto.precio_venta/iva).toFixed(2)  : objeto.precio_venta}</p>
                        <p class=iva>${objeto.iva === "N" ? "(21.00)" : "(10.50)"}</p>
                        <p></p>
                    </div>
                    <div class="descripcionProducto">
                        <p>${objeto.descripcion.slice(0,27)}</p>
                        <p>${venta.condIva === "Inscripto" ? ((objeto.precio_venta/iva)*cantidad).toFixed(2) : (objeto.precio_venta * cantidad).toFixed(2)}</p>
                    </div>
                `
        
        }};
    }else{
        cantidadPrecio.innerHTML = "";
        iva.innerHTML = "";
        descri.innerHTML = "Fecha";
        BI.innerHTML = "Numero";
        importe.innerHTML = "Pagado";
        observaciones.parentNode.classList.remove('none');
        observaciones.innerText = venta.observaciones;
        for await(let producto of venta.comprobantes){
            listaProductos.innerHTML += `
                <div class="cantidad  recibo">
                    <p>${producto.fecha}</p>
                    <p>${producto.numero}</p>
                    <p>${parseFloat(producto.pagado).toFixed(2)}</p>
                </div>
            `
        }
    }

    if (venta.condIva === "Inscripto" && venta.tipo_comp !== "Recibos") {
        if (venta.gravado21 !== 0) {
            discriminadorIva.innerHTML += `
                <div class="margin-1-t">
                    <p>NETO SIN IVA</p>
                    <p>${venta.gravado21}</p>
                </div>
                <div>
                <p>IVA 21.00/</p>
                <p>${venta.iva21}</p>
                </div>
            `
        }
        if (venta.gravado105 !== 0) {
            discriminadorIva.innerHTML += `
                <div class="margin-1-t">
                    <p>NETO SIN IVA</p>
                    <p>${venta.gravado105}</p>
                </div>
                <div>
                    <p>IVA 10.50/</p>
                    <p>${venta.iva105}</p>
                </div>
            `
        }
    }
};

async function listaMovimientos(movimientos) {
    movimientos.map(({tipo_comp,iva,egreso,ingreso,descripcion,precio_unitario})=>{
        const ivaAux = iva === "N" ? 1.21 : 1.105;
        listaProductos.innerHTML += `
                    <div class="cantidad">
                        <p>${tipo_comp === "Nota Credito" ? ingreso/ivaAux.toFixed(2) : egreso.toFixed(2)}
                        /${venta.condIva === "Inscripto" ? (precio_unitario/ivaAux).toFixed(2)  : precio_unitario.toFixed(2)}</p>
                        <p class=iva>${iva === "N" ? "(21.00)" : "(10.50)"}</p>
                        <p></p>
                    </div>
                    <div class="descripcionProducto">
                        <p>${descripcion.slice(0,27)}</p>
                        <p>${venta.condIva === "Inscripto" ? ((precio_unitario/ivaAux)*egreso).toFixed(2) : (precio_unitario * egreso).toFixed(2)}</p>
                    </div>
                `

                if (venta.condIva === "Inscripto" && venta.tipo_comp !== "Recibos") {
                    if (venta.gravado21 !== 0) {
                        discriminadorIva.innerHTML += `
                            <div class="margin-1-t">
                                <p>NETO SIN IVA</p>
                                <p>${venta.gravado21}</p>
                            </div>
                            <div>
                            <p>IVA 21.00/</p>
                            <p>${venta.iva21}</p>
                            </div>
                        `
                    }
                    if (venta.gravado105 !== 0) {
                        discriminadorIva.innerHTML += `
                            <div class="margin-1-t">
                                <p>NETO SIN IVA</p>
                                <p>${venta.gravado105}</p>
                            </div>
                            <div>
                                <p>IVA 10.50/</p>
                                <p>${venta.iva105}</p>
                            </div>
                        `
                    }
                }
    })
}

async function listarCliente(cliente) {
       nombre.innerText = cliente.cliente;
       cuit.innerText = cliente.cuit.length === 11 ? `CUIT: ${cliente.cuit}` : `DNI: ${cliente.cuit}`;
       condIva.innerHTML = venta.condIva.toUpperCase();
       direccion.innerHTML = venta.direccion + " - " + (venta.localidad ? venta.localidad : "CHAJARI");
};

async function listarAfip(afip) {
    if (afip && venta.tipo_comp !== "Recibos") {
        qr.children[0].src = afip.QR;
        cae.innerHTML = afip.cae;
        venciCae.innerHTML = afip.vencimientoCae;
    }else{
        divAfip.classList.add('none');
    }
}

const verTipoFactura = (codigo)=>{
     if (codigo === 6) {
         return "Factura B";
     }else if(codigo === 1){
         return "Factura A";
     }else if(codigo === 3){
         return "Nota Credito A"
     }else if(codigo === 8){
        return "Nota Credito B"
    }else if(codigo === 4){
        return "Recibos"
    }else if(codigo === 9){
        return "Recibos"
    }else{
        return "Recibos"
    }
};