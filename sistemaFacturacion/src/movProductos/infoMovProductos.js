const { ipcRenderer } = require("electron");
const axios = require("axios");
require("dotenv").config;
const URL = process.env.URL;

const tbody = document.querySelector('.tbody')

// ipcRenderer.send('informacion-movimiento-producto')

ipcRenderer.on('datos-movimiento-producto',async (e,args)=>{
    const listaMovimiento = (await axios.get(`${URL}movProductos/${args}`)).data;
    console.log(listaMovimiento)
    listaMovimiento.sort((a,b)=>{
        if (a.fecha > b.fecha) {
            return 1;
        }else if(a.fecha < b.fecha){
            return -1;
        }
        return 0;
    })
    tbody.innerHTML += " ";
    for(let movProducto of listaMovimiento){
        let fecha = new Date(movProducto.fecha);
        const tr = document.createElement('tr');

        const tdFecha = document.createElement('td');
        const tdcodCliente = document.createElement('td');
        const tdCliente = document.createElement('td');
        const tdTipoComp = document.createElement('td');
        const tdTipoVenta = document.createElement('td');
        const tdNroComp = document.createElement('td');
        const tdIngreso = document.createElement('td');
        const tdEgreso = document.createElement('td');
        const tdStock = document.createElement('td');
        const tdPrecioUnitario = document.createElement('td');
        const tdTotal = document.createElement('td');
        const tdVendedor = document.createElement('td');

        tdFecha.innerHTML = `${fecha.getUTCDate()}/${fecha.getUTCMonth()+1}/${fecha.getUTCFullYear()}`;
        tdcodCliente.innerHTML = movProducto.codCliente;
        tdCliente.innerHTML = movProducto.cliente;
        tdTipoComp.innerHTML = movProducto.tipo_comp;
        tdTipoVenta.innerHTML = movProducto.tipo_pago;
        tdNroComp.innerHTML = movProducto.nro_comp;
        tdIngreso.innerHTML = movProducto.ingreso;
        tdEgreso.innerHTML = movProducto.egreso;
        tdStock.innerHTML = movProducto.stock;
        tdPrecioUnitario.innerHTML = movProducto.precio_unitario;
        tdTotal.innerHTML = movProducto.total;
        tdVendedor.innerHTML = movProducto.vendedor;

        tr.appendChild(tdFecha);
        tr.appendChild(tdcodCliente);
        tr.appendChild(tdCliente);
        tr.appendChild(tdTipoComp);
        tr.appendChild(tdTipoVenta);
        tr.appendChild(tdNroComp);
        tr.appendChild(tdIngreso);
        tr.appendChild(tdEgreso);
        tr.appendChild(tdStock);
        tr.appendChild(tdPrecioUnitario);
        tr.appendChild(tdTotal);
        tr.appendChild(tdVendedor);

        tbody.appendChild(tr);
    };
})

document.addEventListener('keydown',e=>{
    if(e.key === "Escape"){
        window.close();
    }
})