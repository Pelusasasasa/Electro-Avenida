const { ipcRenderer } = require("electron")
const sweet = require('sweetalert2');


const axios = require("axios");
const { copiar,recorrerFlechas } = require("../funciones");
require("dotenv").config;
const URL = process.env.URL;

const codigoCliente = document.querySelector('#codigoCliente');
const cliente = document.querySelector('#buscador');
const saldo = document.querySelector('#saldo');
const listar = document.querySelector('.listar');
const compensada = document.querySelector('.compensada');
const historica = document.querySelector('.historica');
const actualizar = document.querySelector('.actualizar');
const detalle = document.querySelector('.detalle');
//
const facturarVarios = document.querySelector('.facturarVarios');
const botonFacturar = document.querySelector('#botonFacturar');
const volver = document.querySelector('.volver');

volver.addEventListener('click',e=>{
    location.href = '../index.html';
});

let listaCompensada=[];
let listaHistorica=[];
let clienteTraido = {};
let listaGlobal=[];
let vendedor = "";
let seleccionado = "";
let subSeleccionado = "";
let situacion = "blanco";
let tipo = "compensada";

copiar();


//mostramos la base de datos cuenta historica del cliente
historica.addEventListener('click',e=>{
    historica.classList.add("disable")
    compensada.classList.remove('disable')
    tipo = "historica"
    listarLista(listaHistorica,situacion,tipo)
});


//mostramos la base de datos cuenta compensada del cliente
compensada.addEventListener('click',e=>{
    compensada.classList.add("disable")
    historica.classList.remove('disable')
    tipo = "compensada"
    listarLista(listaCompensada,situacion,tipo)
});


//Pasamos de negro a blanco o vicebersa
document.addEventListener('keydown',async(event) =>{
   if (event.key === "Alt") {
      document.addEventListener('keydown',(e) =>{
          if (e.key === "F8" && situacion === "negro") {
              ocultarNegro();
              situacion = 'blanco';
              tipo === "compensada" ? listarLista(listaCompensada,situacion,tipo) : listarLista(listaHistorica,situacion,tipo);
          }else  if (e.key === "F9" && situacion === "blanco") {
            mostrarNegro();
            situacion = 'negro';
            tipo === "compensada" ? listarLista(listaCompensada,situacion,tipo) : listarLista(listaHistorica,situacion,tipo);
        }
      })
  }

  subSeleccionado =  await recorrerFlechas(event);
  seleccionado = subSeleccionado &&  subSeleccionado.parentNode;
  if (seleccionado && !seleccionado.classList.contains('detalle')) {
    subSeleccionado && mostrarDetalles(seleccionado.id,seleccionado.children[1].innerHTML);
  }
  subSeleccionado && subSeleccionado.scrollIntoView({
      block:"center",
      inline:'center',
      behavior:"smooth"
  });
});


const labes = document.querySelectorAll('label')
//Ocultado lo que tenemos en negro
const ocultarNegro = ()=>{
    labes.forEach(label=>label.classList.remove('blanco'));
    const saldo_p = document.querySelector('#saldo_p')
    const body = document.querySelector('.consultaCtaCte');
    const botones = document.querySelector('.botones');
    const buscador = document.querySelector('.buscador')
    buscador.classList.remove("mostrarNegro");
    botones.classList.remove("mostrarNegro");
    saldo.classList.remove('none');
    saldo_p.classList.add('none');
    botonFacturar.classList.add('none');
    facturarVarios.classList.add('none');
    body.classList.remove('mostrarNegro');
    actualizar.classList.add('none');
}

//mostramos lo que tenemos en negro
const mostrarNegro = ()=>{
    labes.forEach(label=>label.classList.add('blanco'));    
    const saldo_p = document.querySelector('#saldo_p')
    const body = document.querySelector('.consultaCtaCte');
    const botones = document.querySelector('.botones');
    const buscador = document.querySelector('.buscador')
    buscador.classList.add("mostrarNegro")
    botones.classList.add("mostrarNegro")
    saldo.classList.add('none')
    botonFacturar.classList.remove('none');
    facturarVarios.classList.remove('none');
    saldo_p.classList.remove('none')
    body.classList.add('mostrarNegro')
    actualizar.classList.remove('none')
};

//Buscamos un cliente
codigoCliente.addEventListener('keypress', async e =>{
    if (e.key === "Enter") {
        if (codigoCliente.value !== "") {
            let clienteTraido = await axios.get(`${URL}clientes/id/${codigoCliente.value.toUpperCase( )}`)
            clienteTraido = clienteTraido.data;
                if (clienteTraido !== "") {
                    ponerDatosCliente(clienteTraido);
                }else{
                     await sweet.fire({title:"El cliente no existe"});
                     codigoCliente.value = "";
                }
            }else{
            ipcRenderer.send('abrir-ventana',"clientes");
         }
        }
});

//Recibimos el cliente que nos mandaron desde la otra ventana
ipcRenderer.on('mando-el-cliente',async(e,args)=>{
    let cliente = (await axios.get(`${URL}clientes/id/${args}`)).data
    ponerDatosCliente(cliente);
});

//si hacemos click en el tbody vamos a seleccionar una cuenta compensada o historica y pasamos a mostrar los detalles de la cuenta
listar.addEventListener('click',e=>{
    seleccionado && seleccionado.classList.remove('seleccionado')
    seleccionado = e.target.nodeName === "TD" ?  e.target.parentNode : e.target.parentNode.parentNode;
    seleccionado.classList.toggle('seleccionado')

    subSeleccionado && subSeleccionado.classList.remove('subSeleccionado');
    subSeleccionado = e.target.nodeName === "TD" ? e.target : e.target.parentNode;
    subSeleccionado.classList.add('subSeleccionado');

    if (seleccionado) {
        listaHistorica.forEach(listar=>{
            listar.nro_comp === seleccionado.id && mostrarDetalles(listar.nro_comp,listar.tipo_comp,listar.vendedor);
        })
    }
});

//Si ponemos algo en observaciones que se nos guarde en la cuenta compensada
listar.addEventListener('keyup', async e=>{
    if (e.keyCode === 9 || e.keyCode === 40 || e.keyCode === 38) {
     seleccionado = e.target.parentNode.parentNode;
     subSeleccionado = e.target.parentNode;
    }

    const observacion = e.target.value;//valor de la observacion
    const id = e.target.parentNode.parentNode.id //id de el tr de la observacion en la escribimos

    const comp = (await axios.get(`${URL}cuentaComp/id/${id}`)).data[0]; //traemos el la cuenta
    comp.observaciones = observacion.toUpperCase() //modificamos la observacion de la cuenta
    await axios.put(`${URL}cuentaComp/numero/${id}`,comp) //la guardamos
});

const listarLista = (lista,situacion,tipo)=>{
    let aux
    (situacion === "negro") ? (aux = "Presupuesto") : (aux = "Ticket Factura");
    listaGlobal = lista.filter(e=>{
        if (aux === "Presupuesto") {
            return  (e.tipo_comp === aux ||  e.tipo_comp === "Recibos_P")   
        }else{
            return (e.tipo_comp === aux) || e.tipo_comp === "Recibos" ||  e.tipo_comp === "Nota Credito"
        }
    })

    listaGlobal.sort((a,b)=>{
        if (a.fecha > b.fecha) {
            return 1;
        }else if(a.fecha < b.fecha){
            return -1;
        }
        return 0
    });

    listar.innerHTML = '';
    listaGlobal.forEach(venta => {
        vendedor = venta.vendedor
        let importe = venta.importe;
        let saldo = venta.saldo;
        let pagado = venta.pagado;
        if (venta.length !== 0) {
            let fecha = new Date(venta.fecha)
            if (tipo === "compensada") {
                listar.innerHTML += `
                <tr id="${venta.nro_comp}">
                <td>${fecha.getUTCDate()}/${fecha.getUTCMonth()+1}/${fecha.getUTCFullYear()}</td>
                    <td>${venta.tipo_comp}</td>
                    <td>${venta.nro_comp}</td>
                    <td class = "importe">${parseFloat(importe).toFixed(2)}</td>
                    <td class = "pagado">${parseFloat(pagado).toFixed(2)}</td>
                    <td class = "saldo">${(parseFloat(saldo).toFixed(2))}</td>
                    <td><input class="${venta.nro_comp}" type="text" value="${venta.observaciones}" /></td>
                </tr>
            `
            }else{
                listar.innerHTML += `
                <tr id="${venta.nro_comp}">
                <td>${fecha.getUTCDate()}/${fecha.getUTCMonth()+1}/${fecha.getUTCFullYear()}</td>
                    <td>${venta.tipo_comp}</td>
                    <td>${venta.nro_comp}</td>
                    <td class = "importe">${(venta.debe).toFixed(2)}</td>
                    <td class = "pagado">${(venta.haber).toFixed(2)}</td>
                    <td class = "saldo">${(venta.saldo).toFixed(2)}</td>
                    <td>${venta.observaciones}</td>
                </tr>
            `
            }
        }
    });
};

async function mostrarDetalles(id,tipo,vendedor) {
    detalle.innerHTML = '';
    if (tipo === "Recibos_P" || tipo === "Recibos") {
        const vendedor = (await axios.get(`${URL}ventas/venta/ventaUnica/${seleccionado.id}/${tipo}`)).data.vendedor;
        detalle.innerHTML += `
            <tr class="detalle"><h1>El recibo fue emitido por: ${vendedor}</h1></tr>
        `
    }else{
    let productos = (await axios.get(`${URL}movProductos/${id}/${tipo}`)).data;
    let movimientos1 = productos.filter(movimiento => movimiento.codCliente === clienteTraido._id);
    let movimientos2 = productos.filter(movimiento => movimiento.codigo === clienteTraido._id);
    productos = [...movimientos1,...movimientos2]
    productos.forEach((producto) =>{
        let {codProd,descripcion,vendedor,egreso,precio_unitario} = producto;
        detalle.innerHTML += `
        <tr id=${seleccionado.id} class="detalle">
            <td>${codProd}</td>
            <td>${descripcion}</td>
            <td>${egreso.toFixed(2)}</td>
            <td>${precio_unitario.toFixed(2)}</td>
            <td>${(egreso*precio_unitario).toFixed(2)}</td>
            <td>${vendedor}</td>
        </tr>
        `
        })
    }
};

actualizar.addEventListener('click',async e=>{
    if (seleccionado && !seleccionado.classList.contains('detalle')) {
        venta = (await axios.get(`${URL}presupuesto/${seleccionado.id}`)).data;
        let cuentaCompensada = (await axios.get(`${URL}cuentaComp/id/${seleccionado.id}`)).data[0];
        let cuentaHistorica = (await axios.get(`${URL}cuentaHisto/id/${seleccionado.id}`)).data[0];
        let cliente = (await axios.get(`${URL}clientes/id/${cuentaCompensada.codigo}`)).data;
        let movimientos = (await axios.get(`${URL}movProductos/${seleccionado.id}/Presupuesto`)).data;
        //traemos los productos para ver su precio y actualizarlos
        let productos = [];
        let total = 0;
        for await(let movimiento of movimientos ){
            let producto = (await axios.get(`${URL}productos/${movimiento.codProd}`)).data;
            producto = producto ? producto : {
                precio_venta: movimiento.precio_unitario,
                descripcion:movimiento.descripcion,
                _id:movimiento.codProd,
                marca:""
            }
            total =  parseFloat((total + parseFloat(movimiento.egreso)*parseFloat(producto.precio_venta)).toFixed(2));
            productos.push({cantidad:movimiento.egreso,objeto:producto});
        };
            venta.productos = productos;

        const index = listaHistorica.map(e=>e.nro_comp).indexOf(seleccionado.id);
        let arregloRestante = listaHistorica.slice(index+1);
        arregloRestante = arregloRestante.filter(e=>{
            return (e.tipo_comp === "Presupuesto" || e.tipo_comp === "Recibos_P");
        });
        let saldo = parseFloat(cliente.saldo_p) - parseFloat(cuentaCompensada.importe);

        //actualizamos el importe de la cuentaCompensada
        cuentaCompensada.importe = parseFloat(parseFloat(total).toFixed(2));

        //actualizamos el saldo de la cuentaCompensada
        cuentaCompensada.saldo = parseFloat((parseFloat(total) - cuentaCompensada.pagado).toFixed(2));
        cuentaHistorica.saldo -= cuentaHistorica.debe;
        cuentaHistorica.debe = cuentaCompensada.importe;
        //Guardamos la venta con el nuevo precioFinal
        venta.precioFinal = parseFloat(total.toFixed(2));
      
        ipcRenderer.send('imprimir-venta',[venta,cliente,false,1,"imprimir-comprobante","valorizado",,true]);
            sweet.fire({
                title: "Grabar Importe",
                showCancelButton:true,
                confirmButtonText:"Aceptar"
            }).then(async({isConfirmed})=>{
                if (isConfirmed) {
                    for await (let movProducto of movimientos) {
                        let producto =(await axios.get(`${URL}productos/${movProducto.codProd}`)).data;
                        movProducto.precio_unitario = parseFloat(producto.precio_venta);
                            movProducto.total = parseFloat((movProducto.egreso*movProducto.precio_unitario).toFixed(2));
                            await axios.put(`${URL}movProductos/${movProducto._id}`,movProducto);
                        };
    
                        venta && await axios.put(`${URL}presupuesto/${venta.nro_comp}`,venta);
                        saldo += parseFloat(cuentaCompensada.importe);
                        cuentaHistorica.saldo = parseFloat((parseFloat(cuentaHistorica.saldo) + parseFloat(cuentaHistorica.debe)).toFixed(2))
                        let ultimoSaldo = cuentaHistorica.saldo;
                        for await (let e of arregloRestante){
                            e.saldo= (e.tipo_comp === "Recibos_P") ?  parseFloat((ultimoSaldo - e.haber).toFixed(2)) : parseFloat((e.debe + ultimoSaldo).toFixed(2));
                            ultimoSaldo = e.saldo;
                            await axios.put(`${URL}cuentaHisto/id/${e.nro_comp}`,e)
                        };
                        cliente.saldo_p = saldo.toFixed(2);
                        await axios.put(`${URL}cuentaHisto/id/${cuentaHistorica.nro_comp}`,cuentaHistorica);
                        console.log(cuentaCompensada.nro_comp)
                        await axios.put(`${URL}cuentaComp/numero/${cuentaCompensada.nro_comp}`,cuentaCompensada);
                        await axios.put(`${URL}clientes/${cliente._id}`,cliente);
                        const cuentaCompensadaModificada  = (await axios.get(`${URL}cuentaComp/id/${seleccionado.id}`)).data[0];
                        
                        
                        for(let tr of listar.children){
                            if (tr.id === seleccionado.id) {
                                seleccionado.classList.remove('seleccionado');
                                seleccionado = tr;
                                seleccionado.classList.add('seleccionado');

                                subSeleccionado.classList.remove('subSeleccionado');
                                subSeleccionado = seleccionado.children[0];
                                subSeleccionado.classList.add('subSeleccionado');
                            }
                        }

                        seleccionado.children[3].innerHTML = cuentaCompensadaModificada.importe;
                        seleccionado.children[4].innerHTML = cuentaCompensadaModificada.pagado;
                        seleccionado.children[5].innerHTML = cuentaCompensadaModificada.saldo;
                        saldo.value = cliente.saldo;
                        saldo_p.value = cliente.saldo_p
                    }
                })

                
        }else if(seleccionado && seleccionado.classList.contains('seleccionado')){
            sweet.fire({title:"Seleccionar una cuenta, no un movimiento"});
        }else{
            sweet.fire({title:"Cuenta no seleccionada"});
        }
});

botonFacturar.addEventListener('click',() =>{
    if (seleccionado && !seleccionado.classList.contains('detalle')) {
        sweet.fire({
            title:"Contrase??a",
            input:"password",
            showCancelButton:true,
            confirmButtonText:"Aceptar"
        }).then(async ({isConfirmed,value})=>{
            if (isConfirmed && value !== "") {
                let vendedor = (await axios.get(`${URL}usuarios/${value}`)).data;
                if (vendedor !== "") {
                    ipcRenderer.send('abrir-ventana-emitir-comprobante',[vendedor.nombre,seleccionado.id,vendedor.empresa]);
                }
            }
        })
    }else if(seleccionado && seleccionado.classList.contains('detalle')){
        sweet.fire({title:'Seleccionar una cuenta, no un movimiento'});
    }else{
        sweet.fire({title:'Venta no seleccionada'});
    }
});

facturarVarios.addEventListener('click',async e=>{
    await sweet.fire({
        title:"Contrase??a",
        input:"password",
        showCancelButton:true,
        confirmButtonText:"Aceptar"
    }).then(async ({isConfirmed,value})=>{
        if(isConfirmed && value !== ""){
            let vendedor = (await axios.get(`${URL}usuarios/${value}`)).data;
            if (vendedor !== "") {
                await sweet.fire({
                    title:"Poner numeros de facturas",
                    input:"textarea",
                    confirmButtonText:"Aceptar",
                    showCancelButton:true
                }).then(({value,isConfirmed})=>{
                    if (isConfirmed) {
                        ipcRenderer.send('facturar_varios',[vendedor.nombre,value,vendedor.empresa,codigoCliente.value])
                    }
                })
            }
        }
    })
});

document.addEventListener('keydown',e=>{
    if(e.key === "Escape"){
        location.href === '../index.html';
    }
});

//Ponemos los datos del cliente en los inputs y traemos las compensadas e historicas
const ponerDatosCliente = async (Cliente)=>{
    clienteTraido = Cliente
    codigoCliente.value = Cliente._id
    cliente.value = Cliente.cliente;
    saldo.value = (parseFloat(Cliente.saldo)).toFixed(2)
    saldo_p.value = (parseFloat(Cliente.saldo_p)).toFixed(2)
    listaVentas=Cliente.listaVentas
    let compensadas = (await axios.get(`${URL}cuentaComp/cliente/${Cliente._id}`)).data;
    let historicas = (await axios.get(`${URL}cuentaHisto/cliente/${Cliente._id}`)).data;
    listaCompensada=compensadas;
    listaHistorica = historicas;
    listarLista(compensadas,situacion,tipo)
};


detalle.addEventListener('click',e=>{
    seleccionado && seleccionado.classList.remove('seleccionado');
    seleccionado = e.target.nodeName === "TD" ? e.target.parentNode : e.target;
    seleccionado.classList.add('seleccionado');

    subSeleccionado && subSeleccionado.classList.remove('subSeleccionado');
    subSeleccionado = e.target.nodeName === "TD" ? e.target : e.target.parentNode;
    subSeleccionado.classList.add('subSeleccionado')
});

detalle.addEventListener('click',e=>{
    seleccionado && seleccionado.classList.remove('seleccionado');
    seleccionado = e.target.nodeName === "TD" ? e.target.parentNode : e.target;
    seleccionado.classList.add('seleccionado');

    subSeleccionado && subSeleccionado.classList.remove('subSeleccionado');
    subSeleccionado = e.target.nodeName === "TD" ? e.target : e.target.children[0];
    subSeleccionado.classList.add('subSeleccionado');
});

