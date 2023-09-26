//Esta funcion sirve para tomar lo que esta en la url
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
};

const sweet = require('sweetalert2');
const { ipcRenderer} = require("electron");

const axios = require("axios");
require("dotenv").config;
const URL = process.env.URL;

const { copiar, verCodComp, redondear, generarMovimientoCaja, configAxios, verNombrePc, ponerEnCuentaCorrienteCompensada, validarRecibo } = require('../funciones');

const hoy = new Date();
let diaDeHoy =  hoy.getDate();
let mesDeHoy = hoy.getMonth() + 1;
let anioDeHoy = hoy.getFullYear();

mesDeHoy = (mesDeHoy === 0) ? 1 : mesDeHoy;
mesDeHoy = (mesDeHoy<10) ? `0${mesDeHoy}`: mesDeHoy;
diaDeHoy = (diaDeHoy<10) ? `0${diaDeHoy}`: diaDeHoy;

const body = document.querySelector('body');
const informacionCliente = document.querySelector('.cliente')
const botones = document.querySelector('.botones')
const pagado = document.querySelector('.pagado')
const alerta = document.querySelector('.alerta')
const todo = document.querySelector('.todo');

//cliente
const codigo = document.querySelector('#codigo');
const nombre = document.querySelector('#nombre');
const saldo = document.querySelector('#saldo');
const saldo_p = document.querySelector('#saldo_p');
const direccion = document.querySelector('#direccion');
const localidad = document.querySelector('#localidad');
const fecha = document.querySelector('#fecha');
const cond_iva = document.querySelector('#cond_iva');
const cuit = document.querySelector('#cuit');

const listar = document.querySelector('.listar');

const valoresRecibidos = document.getElementById('valoresRecibidos');

//botones
const imprimir = document.querySelector('.imprimir');
const cancelar = document.querySelector('.cancelar');

const vendedor = document.querySelector('.vendedor');
const saldoAfavor = document.querySelector('#saldoAFavor');
const total = document.querySelector('#total');

const Vendedor = getParameterByName('vendedor');
let situacion = "blanco";//es con la situacion que empezamos a ver
let subseleccionado = "";
let inputSeleccionado  = listar
let trSeleccionado;
let cliente = {}
let nuevaLista = []
vendedor.innerHTML = `<h3>${Vendedor}</h3>`


window.addEventListener('load',e=>{
    fecha.value = `${anioDeHoy}-${mesDeHoy}-${diaDeHoy}`
    copiar();
});

document.addEventListener('keydown',(event) =>{
    if (event.key === "Alt") {
       document.addEventListener('keydown',(e) =>{
           if (e.key === "F9" && situacion === "blanco") {
               mostrarNegro();
               situacion = 'negro';
               (parseFloat(cliente.saldo_p)>0 && Vendedor !== "ELBIO") && saldoAfavor.setAttribute('disabled',"");
               listarLista(nuevaLista,situacion)
           }else if (e.key === "F8" && situacion === "negro") {
                ocultarNegro();
                situacion = 'blanco';
                (parseFloat(cliente.saldo)>0) && saldoAfavor.setAttribute('disabled',"");
                listarLista(nuevaLista,situacion);
        } 
       });
   }
});

//ocultamos lo que esta en negro y ponemos las cosas en blanco
const ocultarNegro = ()=>{
    pagado.classList.remove('mostrarNegro')
    informacionCliente.classList.remove('mostrarNegro')
    botones.classList.remove('mostrarNegro')
    saldo.parentNode.classList.remove('none')
    saldo_p.parentNode.classList.add('none')
    body.classList.remove('mostrarNegro')
}

//ocultamos las cosas en blanco y ponemos lo que esta en negro
const mostrarNegro = ()=>{
    pagado.classList.add('mostrarNegro')
    informacionCliente.classList.add('mostrarNegro')
    botones.classList.add('mostrarNegro')
    saldo.parentNode.classList.add('none');
    saldo_p.parentNode.classList.remove('none');
    body.classList.add('mostrarNegro')
};

//cuando apretamos enter y el codigo esta vacio se abre la ventana para buscar un cliente, sino traemos con el codigo
codigo.addEventListener('keypress', async (e)=>{
    if (e.key === 'Enter') {
        if (codigo.value !== "") {
            cliente = (await axios.get(`${URL}clientes/id/${codigo.value.toUpperCase()}`,configAxios)).data;
            if ((cliente === "")) {
                await sweet.fire({
                    title:"Cliente no encontrado",
                    returnFocus:false,
                })
                codigo.focus();
                codigo.value = "";
            }else{
                inputsCliente(cliente);
            }
        }else{
            ipcRenderer.send('abrir-ventana',"clientes")
        }
    }
});

//traemos el cliente de otra ventana
ipcRenderer.on('mando-el-cliente',async(e,args)=>{
    cliente = (await axios.get(`${URL}clientes/id/${args}`,configAxios)).data;
    inputsCliente(cliente);
});

//rellenamos los inputs del cliente
const inputsCliente = async (cliente)=>{
    const obtenerFecha = new Date();

    let dia = obtenerFecha.getDate();
    let mes = obtenerFecha.getMonth() + 1;
    let anio = obtenerFecha.getFullYear();

    dia < 10 ? dia=`0${dia}` : dia;
    mes = (mes === 0) ? mes + 1 : mes;
    mes < 10 ? mes=`0${mes}` : mes;
    const mostrarFecha =`${anio}-${mes}-${dia}`;
    fecha.value = mostrarFecha;

    codigo.value = cliente._id;
    nombre.value = cliente.cliente;
    (cliente.cond_iva === "") ? (cond_iva.value = "Consumidor Final") : (cond_iva.value = cliente.cond_iva);
    saldo.value = cliente.saldo.toFixed(2);
    saldo_p.value = cliente.saldo_p.toFixed(2);
    direccion.value = cliente.direccion;
    localidad.value = cliente.localidad;
    cuit.value = cliente.cuit;
    
    if (Vendedor !== "ELBIO") {//Lo que hacemos es ver si el vendedor es elbio no cancelamos el saldo a favor
        if (situacion === "blanco" && parseFloat(cliente.saldo) > 0)  {
            saldoAFavor.setAttribute("disabled","")
        }else if(situacion === "negro" && parseFloat(cliente.saldo_p) > 0){
            saldoAFavor.setAttribute("disabled","")
        }
    }

    let conpensada = (await axios.get(`${URL}cuentaComp/cliente/${cliente._id}`,configAxios)).data; //traemos las compensadas
    nuevaLista = conpensada
    listarLista(conpensada,situacion)

    trSeleccionado = listar.firstElementChild
    if (trSeleccionado) {
        inputSeleccionado = trSeleccionado.children[5].children[0];  
    }

    codigo.setAttribute('disabled','');
}   


const listarLista = (lista,situacion)=>{
    let aux;
    let auxRecibo = situacion === "negro" ? "Recibos_P" : "Recibos";

    (situacion === "negro") ? (aux = "Presupuesto") : (aux = "Ticket Factura");
    const listaRecibo = lista.filter(e=>e.tipo_comp === auxRecibo);
    const listaVenta = lista.filter(e=>e.tipo_comp === aux );
    const listaNota = situacion === "blanco" ? lista.filter(e=>e.tipo_comp === "Nota Credito") : [];

    const arreglo = [...listaRecibo,...listaVenta,...listaNota];//este arreglo contiene las compensadas dependiendo la situacion

    arreglo.sort((a,b)=>{//ordenamos la lista por fecha
        if (a.fecha>b.fecha) {
            return 1;
        }else if(a.fecha<b.fecha){
            return -1;
        }
        return 0
    });

    listar.innerHTML = " ";

    arreglo.forEach(venta => {
        if (venta.length !== 0) {
            let saldo = parseFloat(venta.importe) - parseFloat(venta.pagado)
            let fecha = new Date(venta.fecha) 
            let dia = fecha.getDate()
            let mes = fecha.getMonth() + 1;
            let anio = fecha.getFullYear();
            
            mes = (mes === 0 ) ? (mes + 1) : mes;
            mes = (mes < 10) ? `0${mes}` : mes;
            dia = (dia < 10) ? `0${dia}` : dia ;

            const tr = document.createElement('tr');
            tr.id = venta.nro_comp;

            const tdFecha = document.createElement('td');
            const tdTipo = document.createElement('td');
            const tdNumero = document.createElement('td');
            const tdImporte = document.createElement('td');
            const tdPagado = document.createElement('td');
            const tdActual = document.createElement('td');
            const inputActual = document.createElement('input');
            const tdSaldo = document.createElement('td');
            const tdObservaciones = document.createElement('td');
            tdObservaciones.setAttribute('contentEditable',true);

            inputActual.type = "number";
            inputActual.value = "0.00";

            inputActual.addEventListener('blur',saldoPagado);
            inputActual.addEventListener('blur',calculartotal);
            inputActual.addEventListener('keypress',saltoAOtroPago);

            if (venta.importe === 0.1) {
                inputActual.setAttribute('disabled','')
            }

            tdFecha.innerHTML = `${dia}/${mes}/${anio}`;
            tdTipo.innerHTML = venta.tipo_comp;
            tdNumero.innerHTML = venta.nro_comp;
            tdImporte.innerHTML = venta.tipo_comp === "Nota Credito" ? (venta.importe * -1).toFixed(2) : (venta.importe).toFixed(2);
            tdPagado.innerHTML = venta.pagado.toFixed(2);
            tdSaldo.innerHTML = venta.tipo_comp === "Nota Credito" ? (saldo*-1).toFixed(2) : saldo.toFixed(2);
            tdSaldo.classList.add('saldop')
            
            tdActual.appendChild(inputActual);
            tdObservaciones.innerHTML = venta.observaciones;

            tr.appendChild(tdFecha);
            tr.appendChild(tdTipo);
            tr.appendChild(tdNumero);
            tr.appendChild(tdImporte);
            tr.appendChild(tdPagado);
            tr.appendChild(tdActual);
            tr.appendChild(tdSaldo);
            tr.appendChild(tdObservaciones);

            listar.appendChild(tr);
        }
    });

}
//Vemos que tr se selecciono y lo guardamos en una varaible
listar.addEventListener('click',e=>{

    trSeleccionado = e.target.nodeName === "TD" ? e.target.parentNode : e.target.parentNode.parentNode;
    inputSeleccionado = trSeleccionado.children[5].children[0];

    e.target.nodeName === "INPUT" && inputSeleccionado.select();

    subseleccionado && subseleccionado.classList.remove('subseleccionado');
    subseleccionado = e.target.nodeName === "INPUT" ? e.target.parentNode : e.target;
    subseleccionado.classList.add('subseleccionado');
});

let saldoAFavorAnterior = "0"
saldoAfavor.addEventListener('change',e=>{
    if (!total.value) {
        total.value = 0;
    }
    if (saldoAfavor.value !== "") {
        total.value = (parseFloat(total.value) + parseFloat(saldoAfavor.value) -parseFloat(saldoAFavorAnterior)).toFixed(2);
        saldoAFavorAnterior = saldoAfavor.value;
        saldoAfavor.value = parseFloat(saldoAfavor.value).toFixed(2)
        imprimir.focus();
    }
});

imprimir.addEventListener('click',async e=>{
    e.preventDefault();
    if(parseFloat(total.value) === 0 ){
        await sweet.fire({
            title:"Recibo en 0, Desea Continuar",
            showCancelButton:true,
            confirmButtonText: "Aceptar"
        }).then(({isConfirmed}) =>{
            if (isConfirmed) {
                hacerRecibo();
            }
        })
    }else{
           hacerRecibo();
    }
    
});

const hacerRecibo = async()=>{
    //Pnemos en un arreglo las ventas que se modificaron, asi despues imprimimos el recibo
    let arregloParaImprimir = [];
    let maquina = verNombrePc();

    alerta.classList.remove('none');
    const trs = document.querySelectorAll('tbody tr');
    for await (let tr of trs){
        if (tr.children[5].children[0].value !== "" && parseFloat(tr.children[5].children[0].value) !== 0) {
            arregloParaImprimir.push({
                fecha: tr.children[0].innerHTML,
                comprobante: tr.children[1].innerHTML,
                numero: tr.children[2].innerHTML,
                pagado:tr.children[5].children[0].value,
                saldo:tr.children[6].innerHTML
            })
        }
    };
     const recibo = {}
     recibo.fecha = new Date();
     recibo.codigo = codigo.value;
     recibo.cliente = nombre.value;
     recibo.vendedor = Vendedor;
     recibo.tipo_comp = (situacion === "blanco" ? "Recibos" : "Recibos_P" );
     recibo.localidad = localidad.value;
     recibo.direccion = direccion.value;
     recibo.condIva = cond_iva.value;
     recibo.dnicuit = cuit.value;
     recibo.observaciones = valoresRecibidos.value ? valoresRecibidos.value.toUpperCase() : "EFECTIVO";
     recibo.comprobantes = arregloParaImprimir;
     recibo.maquina = maquina;
     const aux = (situacion === "negro") ? "saldo_p" : "saldo";
     let saldoFavor = 0;
     recibo.descuento = 0;
     saldoFavor = (saldoAfavor.value !== "") && parseFloat(saldoAFavor.value);
     recibo.saldoAFavor = saldoFavor;
     recibo.precioFinal = parseFloat(total.value);
     const saldoNuevo = redondear(parseFloat(cliente[aux]) - parseFloat(total.value),2);

     //Tomamos el cliente y modificamos su saldo
     let clienteTraido = (await axios.get(`${URL}clientes/id/${recibo.codigo}`,configAxios)).data;
     clienteTraido[aux] = parseFloat(saldoNuevo);
     clienteTraido.vendedor = Vendedor;
     clienteTraido.maquina = maquina;
     recibo.nro_comp = await traerUltimoNroRecibo();

     const {bandera,message} = await validarRecibo(recibo);
     console.log(message)
     if(bandera) {
        //modificamos las ventas en cuentas compensada
        await modificarVentasConpensadas(nuevaLista);


        //modificamos el numero del recibo
        const numeroAModificar = parseFloat(recibo.nro_comp.split('-')[1])
        await modifcarNroRecibo(numeroAModificar,recibo.tipo_comp,clienteTraido.cond_iva);

        //Ponemos en la historica el Recibo
        await ponerEnCuentaCorrienteHistorica(recibo,Vendedor,maquina);

        //Ponemos en la compensada si le queda saldo a favor
        parseFloat(saldoAfavor.value) !== 0 && await ponerEnCuentaCorrienteCompensada(recibo.codigo,recibo.cliente,recibo.tipo_comp,recibo.nro_comp,parseFloat(saldoAfavor.value),parseFloat(saldoAfavor.value),Vendedor,maquina);
        
        await axios.put(`${URL}clientes/${recibo.codigo}`,clienteTraido,configAxios);
        await axios.post(`${URL}recibos`,recibo,configAxios);
        await generarMovimientoCaja(recibo.fecha,"I",recibo.nro_comp,recibo.tipo_comp,"RC",recibo.precioFinal,recibo.cliente,recibo.codigo,recibo.cliente,recibo.vendedor,maquina);
        //Hacemos que los productos sean las cuentas conpensadas
        recibo.productos = arregloParaImprimir;
        // arregloParaImprimir contiene todos las ventas que tiene pagadas y total contiene el total del recibo
        alerta.children[1].children[0].innerHTML = "Imprimiendo Recibo";
        recibo.tipo_comp === "Recibos_P" ? await ipcRenderer.send('imprimir-recibo',[recibo,cliente,arregloParaImprimir,recibo.tipo_comp]) : await ipcRenderer.send('imprimir-recibo',[recibo,cliente,arregloParaImprimir,recibo.tipo_comp]);
        //Mandar Recibo para que se guarde como pdf
        recibo.tipo_comp === "Recibos" && (alerta.children[1].children[0].innerHTML = "Guardando Recibo Como PDF");
        recibo.tipo_comp === "Recibos" && await axios.post(`${URL}crearPdf`,[recibo,cliente,{}],configAxios);
        location.href = "../index.html";
    }else{
        alerta.classList.add('none');
        await sweet.fire({
            title:message
        })
    }
};

const traerUltimoNroRecibo = async ()=>{
    let numero = await axios.get(`${URL}tipoVenta`,configAxios);
    numero = numero.data["Ultimo Recibo"];
    return numero
};

const modifcarNroRecibo = async(numero,tipo_comp,iva)=>{
    let numeros = (await axios.get(`${URL}tipoVenta`,configAxios)).data;
    numeros["Ultimo Recibo"] = `0004-${(numero + 1).toString().padStart(8,'0')}`;    
    try {
        await axios.put(`${URL}tipoventa`,numeros,configAxios);
    } catch (error) {
        await sweet.fire({
            title:"No se pudo modifcar el numero de recibo en las variales de numeros, pero si se modifico las cuentas compensadas"
        })
    }

};

const modificarVentasConpensadas = async (lista)=>{
    const trs = document.querySelectorAll('tbody tr');
    for await(let tr of trs){
        for await(let venta of nuevaLista){
            if(tr.id === venta.nro_comp){
                venta.pagado = (tr.children[5].children[0].value !== "") ? parseFloat(redondear(parseFloat(tr.children[4].innerHTML) + parseFloat(tr.children[5].children[0].value),2)) : parseFloat(venta.pagado);
                venta.pagado = venta.tipo_comp === "Nota Credito" ? parseFloat(redondear(venta.pagado * -1,2)) : venta.pagado;
                venta.saldo = venta.tipo_comp === "Nota Credito" ? parseFloat(tr.children[6].innerHTML) * -1 : parseFloat(tr.children[6].innerHTML);
                try {
                    await axios.put(`${URL}cuentaComp/numeroYCliente/${venta.nro_comp}/${venta.codigo}`,venta,configAxios);
                } catch (error) {
                    await sweet.fire({
                        title:`No se pudo modifcar la cuenta compensada ${venta.nro_comp}, Anotalo!!`
                    })
                }
            }
        }
    }
};

cancelar.addEventListener('click',async e=>{
    await sweet.fire({
        title:"Desea cancelar el Recibo",
        showCancelButton:true,
        confirmButtonText:"Aceptar"
    }).then(({isConfirmed})=>{
        if (isConfirmed) {
            location.href = "../index.html";
        }
    })
});

const ponerEnCuentaCorrienteHistorica = async(recibo,vendedor,maquina)=>{
    const cuenta = {};
    cuenta.codigo = recibo.codigo;
    cuenta.cliente = cliente.cliente;
    cuenta.tipo_comp = recibo.tipo_comp;
    cuenta.nro_comp = recibo.nro_comp;
    cuenta.haber = parseFloat(recibo.precioFinal);
    cuenta.saldo = cuenta.tipo_comp === "Recibos" ? parseFloat((parseFloat(saldo.value) - cuenta.haber).toFixed(2))  : parseFloat((parseFloat(saldo_p.value) - cuenta.haber).toFixed(2));
    cuenta.vendedor = vendedor;
    cuenta.maquina = maquina
    try {
        await axios.post(`${URL}cuentaHisto`,cuenta,configAxios);
    } catch (error) {
        await sweet.fire({
            title:"No se pudo poner en historica el recibo, Anotalo!!"
        })
    }
};

//Calculamos el td saldo
async function saldoPagado(e){
    const tr = e.target.parentNode.parentNode;
    const aux = tr.children[6].innerText;
    e.target.value === "" && (e.target.value = "0.00");
    tr.children[6].innerText = redondear(parseFloat(tr.children[3].innerText) - parseFloat(tr.children[4].innerText) - parseFloat(e.target.value),2);

    if ((tr.children[6].innerText < 0 && parseFloat(tr.children[3].innerText) > 0) || (tr.children[6].innerText > 0 && parseFloat(tr.children[3].innerText) < 0)) {
        await sweet.fire({
            title:"Pagado Actual Es Mayor Al saldo",
            showConfirmButton:true,
            timer:1600,
            icon:"error"
        });
        tr.children[6].innerText = aux;
        tr.children[5].children[0].value = "0.00";
        tr.children[5].children[0].focus();
        tr.children[5].children[0].select();
        trSeleccionado = tr;

        total.value = redondear(parseFloat(total.value) - parseFloat(aux)),2;
    };
};

//Saltamos a otro tr si hay lugar
function saltoAOtroPago(e) {
    if (e.keyCode === 13) {
        if (trSeleccionado.nextElementSibling) {
            trSeleccionado.nextElementSibling.children[5].children[0].focus();
            trSeleccionado.nextElementSibling.children[5].children[0].select();
            trSeleccionado = trSeleccionado.nextElementSibling;
        }else{
            imprimir.focus();
        }
    }
};

//Calculamos el total de los inputs
async function calculartotal() {
    const trs = document.querySelectorAll('.listar tr');

    let sum = 0;
    for await(let tr of trs){
        sum += parseFloat(tr.children[5].children[0].value);
    };

    if (situacion === "negro" && cliente.saldo_p === sum) {
        saldoAfavor.removeAttribute('disabled');
    };

    if(situacion === 'blanco' && cliente.saldo === sum){
        saldoAfavor.removeAttribute('disabled');
    };

    total.value = redondear(sum + parseFloat(saldoAfavor.value),2);  
};

//si hacemos click en pagar todo se compensan todas las ventas que aparecen
todo.addEventListener('click',e=>{
    total.value = situacion === "blanco" ? saldo.value : saldo_p.value;
    saldoAfavor.removeAttribute('disabled');

    const trs = document.querySelectorAll('.listar tr');
    for(let tr of trs){
        if (tr.children[3].innerHTML !== "0.10") {
            tr.children[5].children[0].value = tr.children[6].innerHTML;
            tr.children[6].innerHTML = "0.00";
        }else{
            total.value = redondear(parseFloat(total.value) - parseFloat(tr.children[3].innerHTML),2);
        }
    }
});

codigo.addEventListener('focus',e=>{
    codigo.select();
});

document.addEventListener('keydown',e=>{
    if(e.key === "Escape"){
        location.href = '../index.html';
    }
});