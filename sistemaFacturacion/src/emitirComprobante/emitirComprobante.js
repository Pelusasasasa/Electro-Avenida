function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

const sweet = require('sweetalert2');
const {inputOptions,copiar, recorrerFlechas, redondear, subirAAfip, verCodComp, generarMovimientoCaja, verTipoPago, configAxios} = require('../funciones');
const { ipcRenderer } = require("electron");
const axios = require("axios");
require("dotenv").config;
const URL = process.env.URL;

//Es lo que viene en la URL
let vendedor = getParameterByName('vendedor');
let empresa = getParameterByName('empresa');
let botones = getParameterByName('botones') === "false" ? false : true;

const usuario = document.querySelector(".usuario")
const textoUsuario = document.createElement("P")
textoUsuario.innerHTML = vendedor
usuario.appendChild(textoUsuario)

const body = document.querySelector('body');
const resultado = document.querySelector('#resultado');

//Parte Cliente
const codigoC = document.querySelector('#codigoC')
const buscarCliente = document.querySelector('#nombre');
const saldo = document.querySelector('#saldo');
const localidad = document.querySelector('#localidad');
const direccion = document.querySelector('#direccion');
const provincia = document.querySelector('#provincia');
const dnicuit = document.querySelector('#dnicuit');
const telefono = document.querySelector('#telefono');
const conIva = document.querySelector('#conIva');
const observaciones = document.querySelector('#observaciones');
const buscarAfip = document.querySelector('.buscarAfip');//boton para buscr desde la afip

//parte buscador Producto
const codigo = document.querySelector('#codigo');
const cambioPrecio = document.querySelector('.nuevoPrecio');
const nuevaCantidadDiv = document.querySelector('.nuevaCantidad');
const descripcionAgregar = document.querySelector('.descripcion');
const precioAgregar = document.querySelector('.precio');
const agregariva = document.querySelector('.iva');

//
const total = document.querySelector('#total');
const ventaValorizado = document.querySelector('.ventaValorizado');
const valorizado = document.querySelector('.valorizado');
const imprimirCheck = document.querySelector('.imprimirCheck');
const impresion = document.querySelector('.impresion');
const cuentaC = document.querySelector('.cuentaC');
const cobrado = document.querySelector('#cobrado');

const nuevaCantidad = document.querySelector('#nuevaCantidad');

//tipo ventas
const tiposVentas = document.querySelectorAll('input[name="tipoVenta"]');
const remito = document.querySelector('.remito');
const presupuesto = document.querySelector('.presupuesto');
const ticketFactura = document.querySelector('.ticketFactura')

//botonones finales
const borrarProducto = document.querySelector('.borrarProducto')
const inputEmpresa = document.querySelector('#empresa');
const alerta = document.querySelector('.alerta');
const prestamo = document.querySelector('.prestamo');
const cancelar = document.querySelector('.cancelar');

//variables para caundo usamos el facturar varias facturas
let listaNumeros;
let variasFacturas = false;

inputEmpresa.value = empresa;

let situacion = "blanco"//para teclas alt y F9
let totalPrecioProductos = 0;
let seleccionado = "";
let subSeleccionado = ""
let tipoVenta;
let borraNegro = false;
let ventaDeCtaCte = "";
let arregloMovimiento= [];
let arregloProductosDescontarStock = [];

window.addEventListener('load',async e=>{
    copiar();
    if (!botones) {
        mostrarNegro();
        remito.classList.add('none');
        tiposVentas[1].parentNode.parentNode.classList.add('none'); 
        presupuesto.classList.add('none');
        tipoVenta = "Prestamo";
        prestamo.classList.remove('none');
        codigoC.value = "L083";
        codigoC.dispatchEvent(new KeyboardEvent('keypress', {'key': 'Enter'}));
    }
});

//funciones para alt f9 y alt f8
document.addEventListener('keydown',(event) =>{
    if (event.key === "Alt") {
        document.addEventListener('keydown',(e) =>{
            if (e.key === "F9" && situacion === "blanco") {
                mostrarNegro();
                situacion = 'negro'
            }else if(e.key === "F8" && situacion === "negro"){
                ocultarNegro();
                situacion = 'blanco'
            }
        })
    }
});

//lo usamos cunado reccorremos con flechas e la lista
body.addEventListener('keyup',e=>{
    recorrerFlechas(e);
});

let cliente = {};
let venta = {};
let listaProductos = [];
let Preciofinal = 0;
venta.vendedor = vendedor;

//abrimos una ventana para buscar el cliente
codigoC.addEventListener('keypress', async(e) =>{
    if (e.key === 'Enter') {//si apreta enter
        if (codigoC.value !== "") {//Si hay algo escrito en el input entonces buscamos el cliente directamente
            let cliente = (await axios.get(`${URL}clientes/id/${codigoC.value.toUpperCase()}`,configAxios)).data;
                if (cliente === "") {//si no se encontro nada poenemos un cartel
                    sweet.fire({title:"Cliente no encontrado"});
                    codigoC.value = "";
                }else{
                    await ponerInputsClientes(cliente)//ponemos los inputs
                    codigoC.value === "9999" ? buscarCliente.focus() : observaciones.focus()
                }
        }else{
            ipcRenderer.send('abrir-ventana',"clientes")
        }
     }
});

//recibimos el cliente
ipcRenderer.on('mando-el-cliente',async (e,args)=>{ 
    cliente = (await axios.get(`${URL}clientes/id/${args}`,configAxios)).data
    await ponerInputsClientes(cliente);//ponemos en los inputs los valores del cliente
    codigoC.value === "9999" ? buscarCliente.focus() : observaciones.focus()
});

//hacemos enter despues de agregar la descripcion al producto 999-999
descripcion.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
        agregariva.children[0].focus();
    }
});

//creamos un producto para listarlo en la pantalla
precioAgregar.addEventListener('keypress',e=>{
    if (e.key === "Enter" && codigo.value !== "888-888") {
        const product = {
            descripcion: descripcionAgregar.children[0].value.toUpperCase(),
            precio_venta: precioAgregar.children[0].value !== "" ? parseFloat(precioAgregar.children[0].value) : 0,
            _id:codigo.value,
            marca:"",
            unidad:"",
            iva: agregariva.children[0].value
        }
        sweet.fire({
            title:"Cantidad",
            input:"text",
            showCancelButton:true,
            confirmButtonText:"Aceptar"
        }).then(async ({isConfirmed,value})=>{
            if (isConfirmed && value !== "") {
                await mostrarVentas(product,parseFloat(value));
                codigo.value = await "";
                codigo.focus()
                precioAgregar.children[0].value = await "";
                precioAgregar.classList.add('none');
                agregariva.classList.add('none')
                descripcionAgregar.children[0].value = await "";
                descripcionAgregar.classList.add('none');
            }
        });
    }

})


//Cuando buscamos un producto
codigo.addEventListener('keypress',async (e) => {
    if((codigo.value.length===3 || codigo.value.length===7) && e.key != "Backspace" && e.key !== "-" && e.key !== "Enter"){
        codigo.value = codigo.value + "-"
    }
    if (e.key === 'Enter') {

        if (!nuevaCantidadDiv.classList.contains('none')) {
            nuevaCantidadDiv.classList.add('none');
            cambioPrecio.classList.add('none');
            agregariva.classList.add('none');
        }

        if (e.target.value !== "") {
            if (codigo.value === "999-999") {          
                //habilitamos para que podamos escribir un producto     
                descripcionAgregar.classList.remove('none');
                precioAgregar.classList.remove('none');
                agregariva.classList.remove('none');
                descripcionAgregar.children[0].focus();
                
            }else if(codigo.value === "888-888"){
                const precio = document.querySelector('.parte-producto_precio')
                let descripcion = document.querySelector('.parte-producto_descripcion');
                descripcion.classList.remove('none')
                let producto = (await axios.get(`${URL}productos/888-888`,configAxios)).data;
                descripcion.children[0].value = producto.descripcion;
                precio.classList.remove('none');
                precio.children[0].focus();
                precio.addEventListener('keypress',async e=>{
                    if (e.key === "Enter") {
                        const product = {
                            marca:"",
                            descripcion: descripcion.children[0].value,
                            precio_venta: parseFloat(precio.children[0].value === "" ? 0 :precio.children[0].value),
                            _id:codigo.value
                        }
                        sweet.fire({
                            title:"Cantidad",
                            showCancelButton:true,
                            confirmButtonText:"Aceptar",
                            input:"text"
                        }).then(async ({isConfirmed,value})=>{
                            if (isConfirmed && value !== "") {
                                await mostrarVentas(product,parseFloat(value));
                                codigo.value = "";
                                precio.children[0].value = "";
                                descripcion.children[0].value = "";
                                await codigo.focus();
                                precio.classList.add('none')
                                descripcion.classList.add('none')    
                            }
                        })
                    }
                })
            }else{
            let producto = (await axios.get(`${URL}productos/${e.target.value}`,configAxios)).data;
                if (producto.length === 0) {
                        sweet.fire({title:"No existe ese Producto"});
                        codigo.value = "";
                }else{
                    sweet.fire({
                        title:"Cantidad",
                        input:"text",
                        showCancelButton:true,
                        confirmButtonText:"Aceptar"
                    }).then(async ({isConfirmed,value})=>{
                        console.log(value)
                        if (isConfirmed && value !== "" && value !== ".") {
                            if (value === undefined || value === "" || parseFloat(value) === 0) {
                                e.target.value = await "";
                                codigo.focus()
                            }else{
                                if (!Number.isInteger(parseFloat(value)) && producto.unidad === "U") {
                                    await sweet.fire({title:"La cantidad de este producto no puede ser en decimal"});
                                }else{
                                    producto.stock < 0 && await sweet.fire({title:"Stock En Negativo"});
                                    (parseFloat(producto.precio_venta) === 0 && await sweet.fire({title:"Precio del producto en 0"}));
                                    parseFloat(producto.stock) === 0 && await sweet.fire({title:"Producto con Stock en 0"})
                                    await mostrarVentas(producto,parseFloat(value));
                                    e.target.value="";
                                    codigo.focus();
                                }}    
                        }
                    })
                }}
        }else{
            ipcRenderer.send('abrir-ventana',"productos")
        }
    }
})

ipcRenderer.on('mando-el-producto',async (e,args) => {
    const {id,cantidad} = JSON.parse(args);
    const producto = (await axios.get(`${URL}productos/${id}`,configAxios)).data;
    mostrarVentas(producto,parseFloat(cantidad))
})

let id = 1 //id de la tabla de ventas
function mostrarVentas(objeto,cantidad) {
    Preciofinal += (parseFloat(objeto.precio_venta)*cantidad);
    total.value = redondear(Preciofinal,2)
    resultado.innerHTML += `
        <tr id=${id}>
        <td class="tdEnd">${(cantidad).toFixed(2)}</td>
        <td>${objeto._id}</td>
        <td>${objeto.descripcion} ${objeto.marca}</td>
        <td class="tdEnd">${(objeto.iva === "R" ? 10.50 : 21).toFixed(2)}</td>
        <td class="tdEnd">${parseFloat(objeto.precio_venta).toFixed(2)}</td>
        <td class="tdEnd">${(parseFloat(objeto.precio_venta)*(cantidad)).toFixed(2)}</td>
        </tr>
    `
    objeto.identificadorTabla = `${id}`;
    id++;
    totalPrecioProductos += objeto.precio_venta * cantidad;
    listaProductos.push({objeto,cantidad});
}

resultado.addEventListener('click',e=>{
    seleccionado && seleccionado.classList.remove('seleccionado');
    subSeleccionado && subSeleccionado.classList.remove('subSeleccionado');
    
    if (e.target.nodeName === "TD") {
        seleccionado = e.target.parentNode;
        subSeleccionado = e.target;   
    }

    seleccionado.classList.add('seleccionado');
    subSeleccionado.classList.add('subSeleccionado');

    if (seleccionado) {
        borrarProducto.classList.remove('none');
        cambioPrecio.classList.remove('none');
        nuevaCantidadDiv.classList.remove('none');
        agregariva.classList.remove('none');
        agregariva.children[0].value = seleccionado.children[3].innerHTML === "10.50" ? "R" : "N";
    }
})

//Para Cambiar el precio de un producto
cambioPrecio.children[0].addEventListener('keypress',async (e)=>{
    if (e.key === "Enter") {
        const  producto = listaProductos.find(({objeto,cantidad})=> objeto.identificadorTabla === seleccionado.id);
        await borrarUnProductoDeLaLista(seleccionado);
        producto.objeto.precio_venta = cambioPrecio.children[0].value !== "" ? parseFloat(cambioPrecio.children[0].value) : producto.objeto.precio_venta;
        producto.cantidad = nuevaCantidad.value !== "" ? nuevaCantidad.value : producto.cantidad;
        producto.objeto.iva = agregariva.children[0].value;
        mostrarVentas(producto.objeto,parseFloat(producto.cantidad));
        cambioPrecio.children[0].value = "";
        nuevaCantidad.value = "";
        cambioPrecio.classList.add('none');
        agregariva.classList.add('none');
        borrarProducto.classList.add('none');
        nuevaCantidadDiv.classList.add('none');
        codigo.focus()
    }
})

//Para cambiar la cantidad
nuevaCantidad.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
        agregariva.children[0].focus();
    }
});

//hacemos enter al iva del producto 999-999
agregariva.children[0].addEventListener('keypress',e=>{
    e.preventDefault();
    if (e.key === "Enter") {
        if (precioAgregar.classList.contains('none')) {
            cambioPrecio.children[0].focus();
        }else{
            precio.focus();
        }
    }
})

//FIN TABLA PRODUCTOS

//INICIO PARTE DE DESCUENTO

//aplicamos el descuento
const descuento = document.querySelector('#descuento')
const descuentoN = document.querySelector('#descuentoN')

descuento.addEventListener('blur',()=>{
    verDescuento();
})

//aplicamos el descuento de cobrado
cobrado.addEventListener('blur',()=>{
    cobrado.value !== "" && inputCobrado(cobrado.value)
});

cobrado.addEventListener('keypress',e=>{
    if(e.key === "Enter"){
        contado.focus()
    }
});

//ver si hay un descuento 
let Total = 0
function verDescuento() {
     Total = totalPrecioProductos
    descuentoN.value = redondear(descuento.value*Total/100,2);
    total.value=redondear(Total - descuentoN.value,2);
}

//si se sobra menos que se muestre cuanto es la diferencia
function inputCobrado(numero) {
    Total=totalPrecioProductos
    descuentoN.value =  redondear(Total-numero,2)
    descuento.value = redondear(descuentoN.value*100/Total,2)
    total.value = parseFloat(numero).toFixed(2);
}
//FIN PARTE DE DESCUENTO

//Vemos el numero para saber de la ultima factura a o b
let texto = "";

//Vemos si la venta es cc, contando, presupuesto

async function verElTipoDeVenta(tipo) {
    let retornar = "Ninguno"
    tipo.forEach(e => {
        if (e.checked) {
          retornar =  e.value;
        }
    });
    return retornar;
}

//Vemos que tipo de venta es
function verQueVentaEs(tipo,cod_comp) {
    if (tipo === "Presupuesto") {
        return "Ultimo Presupuesto"
    }else if(tipo === "Ticket Factura" && cod_comp === 1){
        return "Ultima Factura A"
    }else if(tipo ===  "Ticket Factura" && cod_comp === 6){
        return "Ultima Factura B"
    }else if(tipo === "Cuenta Corriente"){
        return "Ultimo Remito Cta Cte"
    }else if(tipo === "Contado"){
        return "Ultimo Remito Contado"
    }else if(tipo === "Remito"){
        return "Ultimo Remito";
    }
}

//numero de comprobante de ticket factura
async function traerUltimoNroComprobante(tipoCom,codigoComprobante,tipo_pago) {
        //tipoCom = Pesupuesto
        //ver que venta es retorna el atributo del bojeto guardado en la BD
        if (tipoCom==="Ticket Factura") {
            const numeroFactura = verQueVentaEs(tipoCom,codigoComprobante)
            let tipoVenta = ((await axios.get(`${URL}tipoVenta`,configAxios)).data)[numeroFactura];
            return tipoVenta
        }else if(tipoCom === "Presupuesto" & tipo_pago==="CD"){
            const numeroFactura =  verQueVentaEs("Contado")
            const tipoVenta = ((await axios.get(`${URL}tipoVenta`,configAxios)).data)[numeroFactura];
            return tipoVenta
        }else if(tipoCom === "Presupuesto" & tipo_pago === "CC"){
            const numeroFactura = verQueVentaEs("Cuenta Corriente")
            const tipoVenta = ((await axios.get(`${URL}tipoVenta`,configAxios)).data)[numeroFactura];
            return tipoVenta
        }else if(tipoCom === "Presupuesto" & tipo_pago === "PP"){
            const numeroFactura = verQueVentaEs("Presupuesto")
            const tipoVenta = ((await axios.get(`${URL}tipoVenta`,configAxios)).data)[numeroFactura];
            return tipoVenta
        }else if(tipoCom === "Remito"){
            const numeroFactura = verQueVentaEs("Remito")
            const tipoVenta = ((await axios.get(`${URL}tipoVenta`,configAxios))).data[numeroFactura];
            return tipoVenta
        }
}

    //propiedad comprobante
function numeroComprobante(tipo){
        if (tipo === "Ticket Factura") {
            venta.cod_doc = codDoc(dnicuit.value)
            venta.dnicuit = dnicuit.value
            venta.condIva = conIva.value
        }

}

//propiedad cod_doc vemos si es dni o cuit para retornar el codDoc
function codDoc(dniocuit) {
    if (dniocuit.length === 11) {
        return 80
    } else if(dniocuit.length === 8 && dniocuit !== "00000000") {
        return 96
    }
    return 99
}

//Vamos a descontar el stock 
async function sacarStock(cantidad,objeto) {
    let producto = (await axios.get(`${URL}productos/${objeto._id}`)).data;
    const descontar = parseInt(producto.stock) - parseFloat(cantidad);
    producto.stock = descontar.toFixed(2);
    arregloProductosDescontarStock.push(producto);
}

//INICIO MOVPRODUCTOS

//Registramos un movimiento de producto
async function movimientoProducto(cantidad,objeto,idCliente,cliente,tipo_pago,tipo_comp,nro_comp,vendedor){
    let movProducto = {}
    movProducto.codProd = objeto._id
    movProducto.descripcion = `${objeto.descripcion} ${objeto.marca ? objeto.marca :""} ${objeto.cod_fabrica ? objeto.cod_fabrica : ""}`;
    movProducto.codCliente = idCliente;
    movProducto.cliente = cliente;
    movProducto.comprobante = tipoVenta;
    movProducto.tipo_comp = tipo_comp;
    movProducto.nro_comp = nro_comp;
    movProducto.egreso = cantidad;
    movProducto.stock = tipo_pago === "PP" ? objeto.stock : parseFloat((parseFloat(objeto.stock) - cantidad).toFixed(2));
    movProducto.precio_unitario=objeto.precio_venta
    movProducto.total=(parseFloat(movProducto.egreso)*parseFloat(movProducto.precio_unitario)).toFixed(2)
    movProducto.vendedor = vendedor;
    movProducto.rubro = objeto.rubro;
    movProducto.tipo_pago = tipo_pago;
    console.log(movProducto.tipo_pago)
    arregloMovimiento.push(movProducto);
}

//FIN MOV PRODUCTOS
function verNumero(condicion) {
    if (condicion === "Inscripto") {
        return  "Ultima Factura A"
    }else{
        return  "Ultima Factura B"
    }
}

//Vemos el numero de factura para las tarjetas
const numeroDeFactura = document.querySelector('.numeroDeFactura')
numeroDeFactura.addEventListener('click', async () =>{
    const mostrar = document.querySelector('#numeroFactura');
    texto = verNumero(conIva.value);
     mostrar.value = ((await axios.get(`${URL}tipoVenta`,configAxios)).data)[texto];
})

async function actualizarNumeroComprobante(comprobante,tipo_pago,codigoComp) {
    let numero
    let tipoFactura
    let [n1,n2] = comprobante.split('-')
    n2 = parseFloat(n2)+1;
    n2 = n2.toString().padStart(8,0);
    numero = n1+'-'+n2;
    if (comprobante.split('-')[0] === "0006") {
        tipoFactura = verQueVentaEs("Remito");
    }else if (comprobante.split('-')[0] !== "0005") {
        if (tipo_pago==="CD") {
            tipoFactura = verQueVentaEs("Contado",codigoComp)
        }else if(tipo_pago==="CC"){
            tipoFactura = verQueVentaEs("Cuenta Corriente",codigoComp)
        }else{
            tipoFactura = verQueVentaEs("Presupuesto",codigoComp)
        }
    }else{
        tipoFactura = verQueVentaEs("Ticket Factura",codigoComp)
    }
    let numeros = (await axios.get(`${URL}tipoVenta`,configAxios)).data;
    numeros[tipoFactura] = numero;
    await axios.put(`${URL}tipoventa`,numeros,configAxios)
};

//pasamos el saldo en negro
async function sumarSaldoAlClienteEnNegro(precio,codigo,valorizado,venta){
    !valorizado ? precio = "0.1" : precio;
    let cliente = (await axios.get(`${URL}clientes/id/${codigo}`,configAxios)).data
    let saldo_p = (parseFloat(precio) + parseFloat(cliente.saldo_p)).toFixed(2);
    cliente.saldo_p = saldo_p;
    let lista = cliente.listaVentas;
    lista.push(venta);
    cliente.listaVentas = lista;
    await axios.put(`${URL}clientes/${codigo}`,cliente,configAxios);
};

async function sumarSaldoAlCliente(precio,codigo,venta) {
    let cliente = (await axios.get(`${URL}clientes/id/${codigo}`,configAxios)).data;
    cliente.listaVentas.push(venta);
    let saldo = (parseFloat(precio)+parseFloat(cliente.saldo)).toFixed(2);
    cliente.saldo = saldo;
    await axios.put(`${URL}clientes/${codigo}`,cliente,configAxios);
};

const sacarIdentificadorTabla = (arreglo)=>{
    arreglo.forEach(producto=>{
        delete producto.objeto.identificadorTabla  
    })
};

//Aca mandamos la venta en presupuesto

presupuesto.addEventListener('click',async (e)=>{
    e.preventDefault();
    let seguro;
    await sweet.fire({
        title:"Presupuesto?",
        confirmButtonText:"Aceptar",
        showCancelButton:true
    }).then(async({isConfirmed})=>{
        if (isConfirmed) {
            seguro = true;
        }
    })
    if(!seguro){

    }else if (listaProductos.length===0) {
        //Avisamos que no se puede hacer una venta sin productos
        sweet.fire({title:"Cargar Productos"});
    }else if((parseFloat(descuento.value) < -10 || parseFloat(descuento.value) > 10) && codigoC.value !== "L082" && vendedor!=="ELBIO"){
        await sweet.fire({title:"Descuento no autorizado"});
    }else if(document.getElementById('cuentaCorriente').checked && listaProductos.find(producto => producto.objeto._id === "999-999")){
        await sweet.fire({title: "Producto con 999-999 no se puedo hacer Cuenta Corriente"});
    }else{
        venta.tipo_pago = await verElTipoDeVenta(tiposVentas); //vemos si es CD,CC o PP en el input[radio]
        if (venta.tipo_pago === "Ninguno") {
            await sweet.fire({title:"Seleccionar un modo de venta"});
        }else{
                //creamos una lista sin los descuentos para imprimirlos
                const listaSinDescuento = JSON.parse(JSON.stringify(listaProductos));
                venta.productos = listaProductos;
                try {
                    alerta.classList.remove('none');
                    venta.nombreCliente = buscarCliente.value;
                    tipoVenta="Presupuesto";
                    venta.descuento = (descuentoN.value);
                    venta.precioFinal = redondear(total.value,2);
                    venta.fecha = new Date();
                    venta.tipo_comp = tipoVenta;
                    venta.observaciones = observaciones.value;
                    //Le pasamos que es un presupuesto contado CD
                    venta.nro_comp = await traerUltimoNroComprobante(tipoVenta,venta.cod_comp,venta.tipo_pago);
                    venta.empresa = inputEmpresa.value;
                    let valorizadoImpresion = "valorizado"
                    if (!valorizado.checked && venta.tipo_pago === "CC") {
                        valorizadoImpresion="no valorizado";
                    }
                    
                        
                    for await (let producto of venta.productos){
                        if (parseFloat(descuentoN.value) !== 0 && descuentoN.value !== "" ) {
                            producto.objeto.precio_venta =  (parseFloat(producto.objeto.precio_venta)) - parseFloat(producto.objeto.precio_venta)*parseFloat(descuento.value)/100
                           producto.objeto.precio_venta = producto.objeto.precio_venta.toFixed(2)
                        }
                    }
                    
                    await axios.post(`${URL}presupuesto`,venta,configAxios);
                        
                    venta.tipo_pago === "CD" && await generarMovimientoCaja(venta.fecha,"I",venta.nro_comp,"Presupuesto","PP",venta.precioFinal,venta.nombreCliente ,venta.cliente,venta.nombreCliente,venta.vendedor);
                            
                    await actualizarNumeroComprobante(venta.nro_comp,venta.tipo_pago,venta.cod_comp)
                     //si la venta es CC Sumamos un saldo al cliente y ponemos en cuenta corriente compensada y historica
                     if (venta.tipo_pago === "CC") {
                        await sumarSaldoAlClienteEnNegro(venta.precioFinal,venta.cliente,valorizado.checked,venta.nro_comp);
                        await  ponerEnCuentaCorrienteCompensada(venta,valorizado.checked);
                        await ponerEnCuentaCorrienteHistorica(venta,valorizado.checked,saldo_p.value);
                    }

                    //si la venta es distinta de presupuesto sacamos el stock y movimiento de producto 
                    for(let producto of venta.productos){
                        if(venta.tipo_pago !== "PP"){
                            producto.objeto._id !== "999-999" &&  await sacarStock(producto.cantidad,producto.objeto);
                        }
                        await movimientoProducto(producto.cantidad,producto.objeto,venta.cliente,venta.nombreCliente,venta.tipo_pago,venta.tipo_comp,venta.nro_comp,venta.vendedor);
                    };

                    if (venta.tipo_pago !== "PP") {
                       await axios.put(`${URL}productos`,arregloProductosDescontarStock,configAxios);
                    };

                    await axios.post(`${URL}movProductos`,arregloMovimiento,configAxios);

                    if(impresion.checked) {
                        let cliente = {
                            id:codigoC.value,
                            cliente: buscarCliente.value,
                            cuit: dnicuit.value,
                            direccion: direccion.value,
                            localidad: localidad.value,
                            cond_iva: conIva.value
                        }
                        if (venta.tipo_pago === "CC") {
                            await ipcRenderer.send('imprimir-venta',[venta,cliente,true,2,"imprimir-comprobante",valorizadoImpresion,arregloMovimiento])
                        }else{
                            await ipcRenderer.send('imprimir-venta',[venta,cliente,false,1,"imprimir-comprobante",valorizadoImpresion,arregloMovimiento])
                        }
                    } 

                    arregloMovimiento = [];
                    arregloProductosDescontarStock = [];
                    window.location = "../index.html";  
                } catch (error) {
                    console.log(error)
                    await sweet.fire({title:"No se puedo cargar la venta"});
            }finally{
                alerta.classList.add('none');
            }       
        }
    }
});

prestamo.addEventListener('click',async e=>{
    let prestamo = {}

    prestamo.fecha = new Date();
    prestamo.codigo = codigoC.value;
    prestamo.cliente = nombre.value.toUpperCase();
    prestamo.direccion = direccion.value.toUpperCase();
    prestamo.localidad = localidad.value.toUpperCase();
    prestamo.telefono = telefono.value;
    prestamo.dnicuit = dnicuit.value;
    prestamo.condIva = conIva.value;
    prestamo.tipo_comp = "Prestamo";
    prestamo.vendedor = vendedor;
    prestamo.observaciones = observaciones.value.toUpperCase();
    let numeros = (await axios.get(`${URL}tipoVenta`,configAxios)).data;
    let ultimoNumeroPrestamo = parseInt(numeros["Ultimo Prestamo"].split('-',2)[1]) + 1;
    prestamo.nro_comp = "0007-" + ultimoNumeroPrestamo.toString().padStart(8,'0');
    numeros["Ultimo Prestamo"] = prestamo.nro_comp;
    //Actualizamos el ultimo prestamo
    await axios.put(`${URL}tipoventa`,numeros,configAxios);

    //Moviento de producto
    for(let {cantidad,objeto} of listaProductos){
        movimientoProducto(cantidad,objeto,prestamo.codigo,prestamo.cliente,"PR",prestamo.tipo_comp,prestamo.nro_comp,prestamo.vendedor);
        objeto._id !== "999-999" &&  await sacarStock(cantidad,objeto);
    };
    await axios.post(`${URL}movProductos`,arregloMovimiento,configAxios);
    //Fin Moviento de Producto

    //Descontar Stock
    await axios.put(`${URL}productos`,arregloProductosDescontarStock,configAxios);
    //Fin Descontar Stock
    await axios.post(`${URL}prestamos`,prestamo,configAxios);
    location.href = '../index.html';
});


//Cuando apretamos el boton de remito
remito.addEventListener('click',async e=>{
    e.preventDefault();

    tipoVenta = "Remito";

    venta = {};
    venta.fecha = new Date();
    venta.observaciones = "";
    venta.vendedor = vendedor;
    venta.tipo_comp = "Remito";
    // venta.productos = listaProductos;
    venta.cliente = nombre.value;
    venta.idCliente = codigoC.value;
    venta.nro_comp = await traerUltimoNroComprobante(tipoVenta,venta.cod_comp,venta.tipo_pago);
    console.log(venta)

    for await(let producto of listaProductos){
        await movimientoProducto(producto.cantidad,producto.objeto,codigoC.value,nombre.value,"RT",venta.tipo_pago,venta.tipo_comp,venta.nro_comp,venta.vendedor);
    }

    await axios.post(`${URL}movProductos`,arregloMovimiento,configAxios);

    let cliente = (await axios.get(`${URL}clientes/id/${codigoC.value.toUpperCase()}`,configAxios)).data;

    let valorizadoImpresion="no valorizado";

    await axios.post(`${URL}remitos`,venta,configAxios);
    await actualizarNumeroComprobante(venta.nro_comp,venta.tipo_pago,venta.cod_comp);
    ipcRenderer.send('imprimir-venta',[venta,cliente,false,1,"imprimir-comprobante",valorizadoImpresion,listaProductos]);

    window.location = "../index.html";
});

//Aca mandamos la venta con tikect Factura
ticketFactura.addEventListener('click',async (e) =>{
    e.preventDefault();
    tipoVenta = "Ticket Factura";
    venta.tipo_pago = await verElTipoDeVenta(tiposVentas)//vemos si es contado,cuenta corriente o presupuesto en el input[radio]
    //Vemos si algun producto tiene lista negativa
    const stockNegativo = listaProductos.find(producto=>producto.cantidad < 0);
    //mostramos alertas
    if(stockNegativo){
        sweet.fire({title:"Ticket Factura no puede ser productos en negativo"});
    }else if(( parseFloat(descuento.value) < -10 || parseFloat(descuento.value) > 10) && vendedor!=="ELBIO"){
        await sweet.fire({title:"Descuento No Autorizado"})
    }else if(listaProductos.length===0){
        await sweet.fire({title:"Ningun producto cargado"});
    }else if(dnicuit.value.length === 11 && conIva.value === "Consumidor Final"){
        await sweet.fire({title:"No se puede Consumidor Final con Cuit"});
    }else if(dnicuit.value.length === 8 && conIva.value !== "Consumidor Final"){
        await sweet.fire({title: "No se puede Factura A con DNI, Poner Cuit"})
    }else{
        if (venta.tipo_pago === "Ninguno") {
            sweet.fire({title:"Seleccionar un modo de venta"});
        }else{
            alerta.classList.remove('none');
            const listaSinDescuento = JSON.parse(JSON.stringify(listaProductos));
            venta.productos = listaProductos;
            venta.nombreCliente = buscarCliente.value;
            venta.observaciones = observaciones.value;
            venta.fecha = new Date();
            venta.direccion = direccion.value;
            venta.localidad = localidad.value;
            venta.descuento = (descuentoN.value);
            venta.precioFinal = redondear(total.value,2);
            venta.tipo_comp = tipoVenta;
            numeroComprobante(tipoVenta);
            venta.empresa = inputEmpresa.value;
            venta.cod_comp = verCodComp(tipoVenta,conIva.value);
            if (venta.precioFinal >= 10000 && (buscarCliente.value === "A CONSUMIDOR FINAL" || dnicuit.value === "00000000")) {
                sweet.fire({title:"Factura mayor a 10000, poner datos cliente"});
                alerta.classList.add('none');
            }else{
                try {
                    for(let producto of venta.productos){
                        if (parseFloat(descuentoN.value) !== 0 && descuentoN.value !== "" ) {
                            producto.objeto.precio_venta = (parseFloat(producto.objeto.precio_venta)) - parseFloat(producto.objeto.precio_venta)*parseFloat(descuento.value)/100
                            producto.objeto.precio_venta = producto.objeto.precio_venta.toFixed(2)
                        }
                    };
                    const [iva21,iva105,gravado21,gravado105,cant_iva] = gravadoMasIva(venta.productos);
                    //Ponemos en la venta los distintos ivas
                    venta.gravado21 = gravado21;
                    venta.gravado105 = gravado105;
                    venta.iva21 = iva21;
                    venta.iva105 = iva105;
                    venta.cant_iva = cant_iva;

                    borraNegro && (venta.observaciones = ventaAnterior.nro_comp);//Se hace por si pasamos de presupuesto a factura

                    const afip = await subirAAfip(venta);
                    venta.nro_comp = `0005-${(afip.numero).toString().padStart(8,'0')}`;
                    venta.comprob = venta.nro_comp;

                    venta.tipo_pago === "CC" && sumarSaldoAlCliente(venta.precioFinal,venta.cliente,venta.nro_comp);
                    venta.tipo_pago === "CC" && ponerEnCuentaCorrienteCompensada(venta,true);
                    venta.tipo_pago === "CC" && ponerEnCuentaCorrienteHistorica(venta,true,saldo.value);
                    venta.tipo_pago === "CD" && generarMovimientoCaja(venta.fecha,"I",venta.nro_comp,venta.cod_comp === 1 ? "Factura A" : "Factura B",venta.cod_comp === 1 ? "FA" : "FB",venta.precioFinal,venta.nombreCliente,venta.cliente,venta.nombreCliente,venta.vendedor);

                    await actualizarNumeroComprobante(venta.nro_comp,venta.tipo_pago,venta.cod_comp);
                    nuevaVenta = await axios.post(`${URL}ventas`,venta,configAxios);
                    const cliente = (await axios.get(`${URL}clientes/id/${codigoC.value.toUpperCase()}`,configAxios)).data;

                    alerta.children[1].children[0].innerHTML = "Imprimiendo Venta";//cartel de que se esta imprimiendo la venta

                    //mandamos a imprimir el ticket
                    ipcRenderer.send('imprimir-venta',[venta,afip,true,1,'Ticket Factura']);
                        
                    //Le mandamos al servidor que cree un pdf con los datos
                    await axios.post(`${URL}crearPdf`,[venta,cliente,afip],configAxios);
                        
                    if(!borraNegro && !variasFacturas){
                        for(let producto of venta.productos){
                            if (venta.tipo_pago !== "PP") {
                                producto.objeto._id !== "999-999" &&  await sacarStock(producto.cantidad,producto.objeto);
                            }
                            await movimientoProducto(producto.cantidad,producto.objeto,venta.cliente,venta.nombreCliente,venta.tipo_pago,venta.tipo_comp,venta.nro_comp,venta.vendedor);
                        }
                        if (venta.tipo !== "PP") {
                           await axios.put(`${URL}productos`,arregloProductosDescontarStock,configAxios);
                        };
                        await axios.post(`${URL}movProductos`,arregloMovimiento,configAxios);
                        arregloMovimiento = [];
                        arregloProductosDescontarStock = [];
                    }
            
                    if (borraNegro) {
                        //traemos los movimientos de productos de la venta anterior y lo modificamos a la nueva venta
                        const movimientosViejos = (await axios.get(`${URL}movProductos/${ventaAnterior.nro_comp}/Presupuesto`,configAxios)).data;
                        for await (let mov of movimientosViejos){
                            mov.nro_comp = venta.nro_comp;
                            mov.tipo_comp = "Ticket Factura";
                        }
                        await axios.put(`${URL}movProductos`,movimientosViejos,configAxios);

                        //borramos la cuenta compensada
                        await borrrarCuentaCompensada(ventaDeCtaCte);
                        //descontamos el saldo del cliente y le borramos la venta de la lista
                        await descontarSaldo(ventaAnterior.cliente,ventaAnterior.precioFinal,ventaAnterior.nro_comp,venta.nro_comp);
                        await borrarCuentaHistorica(ventaAnterior.nro_comp,ventaAnterior.cliente,ventaAnterior.tipo_comp);
                        await borrarVenta(ventaAnterior.nro_comp)

                    }else if(variasFacturas){
                        for await(let numero of listaNumeros){
                            //traemos los movimientos de productos de la venta anterior y lo modificamos a la nueva venta
                            const movimientosViejos = (await axios.get(`${URL}movProductos/${numero}/Presupuesto`,configAxios)).data;
                            for await (let mov of movimientosViejos){
                                mov.nro_comp = venta.nro_comp;
                                mov.tipo_comp = "Ticket Factura";
                            }
                            await axios.put(`${URL}movProductos`,movimientosViejos,configAxios);
                            await borrrarCuentaCompensada(numero)
                            await borrarCuentaHistorica(numero,codigoC.value,"Presupuesto");
                            await borrarVenta(numero)
                        };
                        await descontarSaldo(codigoC.value,total.value);
                        
                    };
                    !borraNegro ? (window.location = '../index.html') : window.close();
                } catch (error) {
                        await sweet.fire({title:"No se puedo generar la Venta"});
                        console.log(error)
                    }finally{
                        alerta.classList.add('none')
                    }
            }
            }
    };
    });

 //sacamos el gravado y el iva de una venta
 const gravadoMasIva = (ventas)=>{
    let totalIva105 = 0
    let totalIva21=0
    let gravado21 = 0 
    let gravado105 = 0 
    ventas.forEach(({objeto,cantidad}) =>{
        if (objeto.iva === "N") {
            gravado21 += parseFloat(cantidad)*(parseFloat(objeto.precio_venta)/1.21) ;
            totalIva21 += parseFloat(cantidad)*(parseFloat(objeto.precio_venta)/1.21) * 21 / 100;
        }else{
            gravado105 += parseFloat(cantidad)*(parseFloat(objeto.precio_venta/1.105));
            totalIva105 += parseFloat(cantidad)*(parseFloat(objeto.precio_venta/1.105)) * 10.5 / 100;
        }
    })
    let cantIva = 1
    if (gravado105 !== 0 && gravado21 !== 0) {
        cantIva = 2;
    }
    return [parseFloat(totalIva21.toFixed(2)),parseFloat(totalIva105.toFixed(2)),parseFloat(gravado21.toFixed(2)),parseFloat(gravado105.toFixed(2)),cantIva]
}

//funcion que busca en la afip a una persona
buscarAfip.addEventListener('click',  async (e)=>{
    let cliente = (await axios.get(`${URL}clientes/cuit/${dnicuit.value}`,configAxios)).data;
        if (cliente !== "") {
            await ponerInputsClientes(cliente)
        }else{
                if (dnicuit.value) {
                   if (dnicuit.value.length>8) {
                        buscarPersonaPorCuit(dnicuit.value)
                   }else{
                    const Http = new XMLHttpRequest();
                    const url=`https://afip.tangofactura.com/Index/GetCuitsPorDocumento/?NumeroDocumento=${dnicuit.value}`;
                    Http.open("GET", url);
                    Http.send()
                    Http.onreadystatechange = (e) => {
                        buscarPersonaPorCuit(JSON.parse(Http.responseText).data[0])
                        }
                   }
                }
            }
    cuentaC.classList.add('none');
    observaciones.focus();
});

 //Funcion para buscar una persona directamente por el cuit
 async function buscarPersonaPorCuit(cuit) {
        const Https = new XMLHttpRequest();
        const url=`https://afip.tangofactura.com/REST/GetContribuyente?cuit=${cuit}`;
        await Https.open("GET", url);
        await Https.send()
        Https.onreadystatechange =async  (e) => {
            if (Https.responseText !== "") {
                const persona = JSON.parse(Https.responseText)
                if (persona.errorGetData === false) {
                    const {nombre,domicilioFiscal,EsRI,EsMonotributo,EsExento,EsConsumidorFinal} = persona.Contribuyente;
                    const cliente = {};
                    cliente.cliente=nombre;
                    cliente.localidad = domicilioFiscal.localidad;
                    cliente.direccion = domicilioFiscal.direccion;
                    cliente.provincia = domicilioFiscal.nombreProvincia;
                    buscarCliente.value = nombre;
                    localidad.value=domicilioFiscal.localidad;
                    direccion.value = domicilioFiscal.direccion;
                    provincia.value = domicilioFiscal.nombreProvincia;
                    if (EsRI) {
                        cliente.cond_iva="Inscripto";
                    }else if (EsExento) {
                        cliente.cond_iva="Exento";
                    } else if (EsMonotributo) {
                        cliente.cond_iva="Monotributista";
                    } else if(EsConsumidorFinal) {
                        cliente.cond_iva="Consumidor Final";
                    }
                    cliente.cuit = dnicuit.value;
                    cliente._id = "9999";
                    await ponerInputsClientes(cliente);
                }else{
                    sweet.fire({title:"Persona no encontrada"});
                }
            }
        }
         
}

 //lo usamos para borrar un producto de la tabla
borrarProducto.addEventListener('click',e=>{
    nuevaCantidadDiv.classList.add('none');
    cambioPrecio.classList.add('none');
    borrarUnProductoDeLaLista(seleccionado);
});

const borrarUnProductoDeLaLista =async  (productoSeleccionado)=>{
        if (productoSeleccionado) {
            
            producto = listaProductos.find(e=>e.objeto.identificadorTabla === productoSeleccionado.id);
            
            //tomamos el precio del producto que borramos
            const aDescontar = parseFloat(productoSeleccionado.children[5].innerHTML);
            //si hay un descuento ya prehecho tomamos ese descuento
            const descuentoProducto = parseFloat((aDescontar*parseFloat((descuento.value)/100).toFixed(2)).toFixed(2));

            total.value = (parseFloat(total.value)-(aDescontar - descuentoProducto)).toFixed(2);
            
            Preciofinal = (Preciofinal - (parseFloat(productoSeleccionado.children[5].innerHTML)).toFixed(2)) 
            for await(let e of listaProductos){
                if (productoSeleccionado.id === e.objeto.identificadorTabla) {
                        listaProductos = listaProductos.filter(e=>e.objeto.identificadorTabla !== productoSeleccionado.id);
                        totalPrecioProductos -= (e.objeto.precio_venta*e.cantidad);
                }
            };
            productoSeleccionado.parentNode.removeChild(productoSeleccionado);
            seleccionado = "";
            subSeleccionado = "";
        }
        let nuevoTotal = 0;
        listaProductos.forEach(({objeto,cantidad})=>{
            nuevoTotal += (objeto.precio_venta * cantidad);
        })
        descuentoN.value = (nuevoTotal*parseFloat(descuento.value)/100).toFixed(2);
        borrarProducto.classList.add('none');
        codigo.focus();
} 

//Cuando se hace un click en cancelar y se confirma, vemos si hay productos para que se guarde en una base de datos
cancelar.addEventListener('click',async e=>{
    e.preventDefault()
    await sweet.fire({
        title:"Cancelar el Presupuesto",
        showCancelButton:true,
        confirmButtonText:"Aceptar"
    }).then(async ({isConfirmed})=>{
        if (isConfirmed) {
            if (listaProductos.length !== 0) {
                const ventaCancelada = {};
                if (cliente._id) {
                    ventaCancelada.cliente = cliente._id;
                }
                ventaCancelada.productos = listaProductos;
                ventaCancelada._id = await tamanioCancelados();
                ventaCancelada.vendedor = vendedor;
                await axios.post(`${URL}cancelados`,ventaCancelada,configAxios);
            }
                window.location = "../index.html";    
        }
    })
});

// Vemos el tamanio de los Cancelados
const tamanioCancelados = async() =>{
    let tamanio = (await axios.get(`${URL}cancelados/tamanio`,configAxios)).data;
    return `${tamanio + 1}`;
};

 //Ponemos valores a los inputs del cliente
async function ponerInputsClientes(cliente) {
    cliente._id && (codigoC.value = cliente._id);
    buscarCliente.value = cliente.cliente;
    cliente.saldo && (saldo.value = cliente.saldo);
    cliente.saldo_p && (saldo_p.value = cliente.saldo_p);
    localidad.value = cliente.localidad;
    direccion.value = cliente.direccion;
    provincia.value = cliente.provincia;
    dnicuit.value = cliente.cuit;
    cliente.telefono && (telefono.value = cliente.telefono);
    conIva.value = cliente.cond_iva;
    venta.cliente = cliente._id;
    if (cliente.condicion==="M") {
        await sweet.fire({title:`${cliente.observacion}`,returnFocus:false});
    }
    (cliente.cond_fact !== "1") ? cuentaC.classList.add('none') : cuentaC.classList.remove('none');
    if (codigoC.value === "9999"){
        buscarCliente.removeAttribute('disabled');
        telefono.removeAttribute('disabled');
        localidad.removeAttribute('disabled');
        direccion.removeAttribute('disabled');
        provincia.removeAttribute('disabled');
        dnicuit.removeAttribute('disabled');
        telefono.removeAttribute('disabled');
        conIva.removeAttribute('disabled');
    }else{
        buscarCliente.setAttribute('disabled',"");
        telefono.setAttribute('disabled',"");
        localidad.setAttribute('disabled',"");
        direccion.setAttribute('disabled',"");
        provincia.setAttribute('disabled',"");
        dnicuit.setAttribute('disabled',"");
        telefono.setAttribute('disabled',"");
        conIva.setAttribute('disabled',"");
    }
}

let ventaAnterior;
ipcRenderer.once('venta',async (e,args)=>{
    borraNegro = true;
    const [usuario,numero,empresa] = JSON.parse(args);
    inputEmpresa.value = empresa;
    ventaDeCtaCte = numero;
    textoUsuario.innerHTML = usuario;
    ventaAnterior = (await axios.get(`${URL}presupuesto/${numero}`,configAxios)).data;
    let cliente = (await axios.get(`${URL}clientes/id/${ventaAnterior.cliente}`,configAxios)).data;
    await ponerInputsClientes(cliente)
    ventaAnterior.productos.forEach(producto =>{
        const {objeto,cantidad} = producto;
        mostrarVentas(objeto,cantidad)
    })
});

ipcRenderer.on('informacion',async (e,args)=>{
    const [vendedor,numeros,empresa,codigoCliente] = args;
    inputEmpresa.value = empresa;
    textoUsuario.innerHTML = vendedor;
    variasFacturas = true;
    listaNumeros = numeros

    
    let cliente = (await axios.get(`${URL}clientes/id/${codigoCliente}`,configAxios)).data;
    ponerInputsClientes(cliente);
    let ventas = [];
    console.log(numeros)
    for await (let numero of numeros){
        ventas.push((await axios.get(`${URL}presupuesto/${numero}`,configAxios)).data);
    };

    for await(let venta of ventas){
        venta.productos.forEach(producto=>{
            mostrarVentas(producto.objeto,producto.cantidad)
        });
    };
});

//descontamos el saldo del cliente
const descontarSaldo = async(codigo,precio,numero="",venta="")=>{
    const cliente = (await axios.get(`${URL}clientes/id/${codigo}`,configAxios)).data;
    const index = cliente.listaVentas.indexOf(numero);
    cliente.listaVentas.splice(index);
    cliente.listaVentas = venta;
    cliente.saldo_p = parseFloat(cliente.saldo_p) - precio;
    try {
        await axios.put(`${URL}clientes/${codigo}`,cliente,configAxios);
    } catch (error) {
        console.log(error)
        await sweet.fire({
            title:"No se puede descontar el saldo del cliente"
        })
    }
};

const borrrarCuentaCompensada = async(numero)=>{
    await axios.delete(`${URL}cuentaComp/id/${numero}`);
}

const borrarCuentaHistorica = async(numero,cliente,tipoComp)=>{
    const eliminada = (await axios.delete(`${URL}cuentaHisto/id/${numero}`,configAxios)).data;
    const importeEliminado = eliminada.debe;
    const historicas = (await axios.get(`${URL}cuentaHisto/cliente/${cliente}`,configAxios)).data;
    let cuentaHistoricas = historicas.filter(historica => historica.tipo_comp === tipoComp);
    cuentaHistoricas = cuentaHistoricas.filter(historica => historica.fecha > eliminada.fecha);
    cuentaHistoricas.forEach(async cuenta=>{
        cuenta.saldo = cuenta.saldo - importeEliminado;
        await axios.put(`${URL}cuentaHisto/id/${cuenta.nro_comp}`,cuenta,configAxios);
    });
};

const borrarVenta = async(numero)=>{
    await axios.delete(`${URL}presupuesto/${numero}`,configAxios);
};

telefono.addEventListener('focus',e=>{
    telefono.select()
});

buscarCliente.addEventListener('focus',e=>{
    buscarCliente.select()
});

localidad.addEventListener('focus',e=>{
    localidad.select()
});

provincia.addEventListener('focus',e=>{
    provincia.select()
});

direccion.addEventListener('focus',e=>{
    direccion.select()
});

dnicuit.addEventListener('focus',e=>{
    dnicuit.select()
});

descuento.addEventListener('focus',e=>{
    descuento.select()
});

cobrado.addEventListener('focus',e=>{
    cobrado.select()
});

buscarCliente.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
        telefono.focus()
    }
});

telefono.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
        direccion.focus()
    }
});

direccion.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
        localidad.focus()
    }
});

localidad.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
        provincia.focus()
    }
});

provincia.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
        conIva.focus()
    }
});

conIva.addEventListener('keypress',e=>{
    e.preventDefault()
    if (e.key === "Enter") {
        dnicuit.focus()
    }
});

dnicuit.addEventListener('blur',async e=>{
    if (dnicuit.value.length !== 8 && dnicuit.value.length !== 11 && dnicuit.value.length !== 0) {
        await sweet.fire({
            title:"Cadena DNI o CUIT Erronea",
        }).then(() => {
            dnicuit.focus();
        })
    }
});

dnicuit.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
        observaciones.focus();
    }
});

descuento.addEventListener('keypress',e=>{
    if (e.key === "Enter" && situacion==="blanco") {
        ticketFactura.focus()
    }else if(e.key === "Enter" && situacion==="negro"){
        presupuesto.focus()
    }
});

//Inicio Compensada
const ponerEnCuentaCorrienteCompensada = async(venta,valorizado)=>{
    const cuenta = {};
    cuenta.codigo = venta.cliente;
    cuenta.fecha = new Date();
    cuenta.cliente = buscarCliente.value;
    cuenta.tipo_comp = venta.tipo_comp;
    cuenta.nro_comp = venta.nro_comp;
    cuenta.importe = valorizado ? parseFloat(venta.precioFinal) : 0.1;
    cuenta.saldo = valorizado ? parseFloat(venta.precioFinal) : 0.1;
    cuenta.observaciones = venta.observaciones;
    await axios.post(`${URL}cuentaComp`,cuenta,configAxios)
}

//inicio historica
const ponerEnCuentaCorrienteHistorica = async(venta,valorizado,saldo)=>{
    const cuenta = {}
    cuenta.codigo = venta.cliente;
    cuenta.cliente = buscarCliente.value;
    cuenta.tipo_comp = venta.tipo_comp;
    cuenta.nro_comp = venta.nro_comp;
    cuenta.debe = valorizado ? parseFloat(venta.precioFinal) : 0.1;
    cuenta.saldo = parseFloat(saldo) + cuenta.debe;
    cuenta.observaciones = venta.observaciones;
    await axios.post(`${URL}cuentaHisto`,cuenta,configAxios);
}

 //Musetra las cosas en negro
 function mostrarNegro() {
    const bodyNegro = document.querySelector('.emitirComprobante')
    const saldoNegro = document.querySelector(".saldoNegro")
    const saldo = document.querySelector(".saldo")
    const table = document.querySelector('.tabla');
    const ventaNegro = document.querySelector(".ventaNegro")
    const ticketFactura = document.querySelector('.ticketFactura');
    table.classList.add('enNegro')
    saldoNegro.classList.remove('none')
    saldo.classList.add('none')
    bodyNegro.classList.add('mostrarNegro')
    ventaNegro.classList.remove('none')
    ticketFactura.classList.add('none')
    ventaValorizado.classList.remove('none')
    imprimirCheck.classList.remove('none')
}

function ocultarNegro() {
    const bodyNegro = document.querySelector('.emitirComprobante')
    const saldoNegro = document.querySelector(".saldoNegro")
    const saldo = document.querySelector(".saldo")
    const ventaNegro = document.querySelector(".ventaNegro")
    const ticketFactura = document.querySelector('.ticketFactura')
    const parteNegra = document.querySelector('.parteNegra')
    parteNegra.classList.remove('formulario-negro')
    parteNegra.classList.add('formulario-verde')
    const tipoVenta = document.querySelector('.tipoVenta')
    tipoVenta.classList.remove('formulario-negro')
    tipoVenta.classList.add('formulario-verde')
    const total = document.querySelector('.total')
    total.classList.remove('formulario-negro')
    total.classList.add('formulario-verde')
    saldoNegro.classList.add('none')
    saldo.classList.remove('none')
    bodyNegro.classList.remove('mostrarNegro')
    ventaNegro.classList.add('none')
    ticketFactura.classList.remove('none')
    ventaValorizado.classList.add('none')
    imprimirCheck.classList.add('none')
}


//Seccion de Facturar Prestamos
let facturarPrestamo = getParameterByName('facturarPrestamo');
facturarPrestamo = facturarPrestamo ? JSON.parse(facturarPrestamo) : false
let botonFacturarPrestamos = document.getElementById('facturar-prestamo');
botonFacturarPrestamos.addEventListener('click',hacerFacturaParaPrestamos);

if (facturarPrestamo) {
    let arregloPrestamo = JSON.parse(getParameterByName('arregloPrestamo'));
    mostrarNegro();//Mostramos devuelta en negro

    observaciones.value = getParameterByName('observaciones');
    inputEmpresa.value = "Electro Avenida";
    buscarAfip.classList.add('none')//Saco boton Inecesario
    botonFacturarPrestamos.classList.remove('none');//Saco boton Inecesario
    ticketFactura.classList.add('none');//Saco boton Inecesario
    remito.classList.add('none')//Saco boton Inecesario
    presupuesto.classList.add('none');//Saco boton Inecesario
    cuentaCorriente.parentNode.parentNode.classList.add('none');//Saco input Inecesario

    rellenarConPrestamo(arregloPrestamo);
};
//En esta funcion rellenamos los datos del cliente, productos con los prestamos;

async function rellenarConPrestamo(arreglo) {
    //Traemos los movimientos del prestamo
    let aux = [];
    movimientos = await traerMovimientosPrestamo(arreglo);
    const productos = await traerProductosPrestamo(movimientos);
    for (let i = 0; i < productos.length; i++){
        mostrarVentas(productos[i],movimientos[i].egreso);
    };
    await listarClientePrestamo(movimientos[0]);
    
}

async function listarClientePrestamo(movimiento) {
    console.log(movimiento)
    let {codCliente} = movimiento;
    console.log(movimiento)
    codigoC.value = codCliente;
    codigoC.dispatchEvent(new KeyboardEvent('keypress', {'key': 'Enter'}));
}

async function traerMovimientosPrestamo(arreglo){
    let moviminetosPrestamos = [];
    for(let elem of arreglo){
        const movimientos = (await axios.get(`${URL}movProductos/${elem}/Prestamo`,configAxios)).data;
        moviminetosPrestamos.push(...movimientos);
    };    
    return moviminetosPrestamos;
};

async function traerProductosPrestamo(arreglo) {
    let listaProductos = [];
    for await(let {codProd} of arreglo){
        const producto = (await axios.get(`${URL}productos/${codProd}`,configAxios)).data;
        listaProductos.push(producto)
    };
    return listaProductos
};

async function hacerFacturaParaPrestamos(){
    const presupuesto = {};
    const numero = (await axios.get(`${URL}tipoVenta`,configAxios)).data;
    const puntoVenta = numero["Ultimo Presupuesto"].split('-',2)[0];
    const numeroPresupuesto = numero["Ultimo Presupuesto"].split('-',2)[1];
    numero['Ultimo Presupuesto'] = `${puntoVenta}-${(parseInt(numeroPresupuesto) + 1).toString().padStart(8,'0')}`;

    presupuesto.fecha = new Date();
    presupuesto.nombreCliente = nombre.value;
    presupuesto.cliente = codigoC.value;
    presupuesto.tipo_comp = "Presupuesto";
    presupuesto.tipo_pago = "CD"
    presupuesto.nro_comp = numero["Ultimo Presupuesto"];
    presupuesto.observaciones = observaciones.value;
    presupuesto.vendedor = "GONZALO";
    presupuesto.precioFinal = total.value;
    presupuesto.descuento = descuentoN.value;
    presupuesto.empresa = inputEmpresa.value;

    //Datos del cliente
    const cliente = {};
    cliente._id = codigoC.value;
    cliente.cliente = nombre.value;
    cliente.cuit = dnicuit.value;
    cliente.direccion = direccion.value;
    cliente.localidad = localidad.value;
    cliente.telefono = telefono.value;

    //Imprimiendo venta
    await ipcRenderer.send('imprimir-venta',[presupuesto,cliente,false,1,"imprimir-comprobante","true",listaProductos]);
    
    // //Actualizamos el numero de presupuesto
    (await axios.put(`${URL}tipoVenta`,numero,configAxios));

    //posts
    await axios.post(`${URL}presupuesto`,presupuesto,configAxios);
    generarMovimientoCaja(presupuesto.fecha,"I",presupuesto.nro_comp,"Presupuesto","PP",presupuesto.precioFinal,presupuesto.nombreCliente,presupuesto.cliente,presupuesto.nombreCliente,presupuesto.vendedor);

    //Modificamos los movimientos de productos para que pasen de prestamo a presupuesto
    for await(let mov of movimientos){
        mov.nro_comp = presupuesto.nro_comp;
        mov.tipo_comp = presupuesto.tipo_comp;
        mov.tipo_pago = "CD";
        mov.precio_unitario = parseFloat(listaProductos.find(elem=>elem._id = mov.codProd).objeto.precio_venta);
        mov.total = (mov.egreso * mov.precio_unitario).toFixed(2);
        await axios.put(`${URL}movProductos/${mov._id}`,mov,configAxios);
    };

    //Lo que hacemos es anular los prestamos
    let arregloPrestamo = JSON.parse(getParameterByName('arregloPrestamo'));
    for(let elem of arregloPrestamo){
        const prestamo  = (await axios.get(`${URL}Prestamos/forNumber/${elem}`,configAxios)).data;
        prestamo.anulado = true;
        prestamo.nroPresupuesto = presupuesto.nro_comp;
        await axios.put(`${URL}Prestamos/forNumber/${elem}`,prestamo,configAxios)
    };


    location.href = '../index.html';
};
//Seccion de Facturar Prestamos

observaciones.addEventListener('keypress',e=>{
    if (e.key==='Enter') {
        codigo.focus()
    }
});

codigoC.addEventListener('focus',e=>{
    codigoC.select();
});

nombre.addEventListener('focus',e=>{
    nombre.select();
});

telefono.addEventListener('focus',e=>{
    telefono.focus();
});

direccion.addEventListener('focus',e=>{
    direccion.select();
});

localidad.addEventListener('focus',e=>{
        localidad.select();
});

provincia.addEventListener('focus',e=>{
    provincia.select();
});

observaciones.addEventListener('focus',e=>{
    observaciones.select();
});