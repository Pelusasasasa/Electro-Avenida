const {ipcRenderer} = require('electron')

ipcRenderer.on('info-para-imprimir',(e,args)=>{
    const [Venta,Cliente,arreglo,total,opciones] = JSON.parse(args)
    listar(Venta,Cliente,arreglo,total,opciones);
});

const listar = async(venta,Cliente,lista,precio,opciones)=>{

const numero = document.querySelector('.numero');
const fecha = document.querySelector('.fecha');
const cliente = document.querySelector('.cliente');
const idCliente = document.querySelector('.idCliente');
const cuit = document.querySelector('.cuit');
const localidad = document.querySelector('.localidad')
const direccion = document.querySelector('.direccion')
const iva = document.querySelector('.cond_iva')
const total = document.querySelector('#total')
const tbody = document.querySelector('.tbody')
const tomarFecha = new Date();
let hoy = tomarFecha.getDate()
let mes = tomarFecha.getMonth() + 1;
let anio = tomarFecha.getFullYear();

mes = (mes<10) ? `0${mes}` : mes;
hoy = (hoy<10) ? `0${hoy}` : hoy;

const cond_iva = (Cliente.iva === undefined) && "Consumidor Final";
fecha.innerHTML = `${hoy}/${mes}/${anio}`;
numero.innerHTML = venta.nro_comp;
idCliente.innerHTML = venta.codigo;
cliente.innerHTML = Cliente.cliente;
cuit.innerHTML = Cliente.cuit;
localidad.innerHTML=Cliente.localidad;
direccion.innerHTML=Cliente.direccion;
iva.innerHTML = cond_iva;
tbody.innerHTML = ""
for(let objeto of lista){
    const tr = document.createElement('tr');

    const tdFecha = document.createElement('td');
    const tdComprobante = document.createElement('td');
    const tdNumero = document.createElement('td');
    const tdPagado = document.createElement('td');
    const tdSaldo = document.createElement('td');

    tdFecha.innerHTML = objeto.fecha;
    tdComprobante.innerHTML = objeto.comprobante;
    tdNumero.innerHTML = objeto.numero;
    tdPagado.innerHTML = parseFloat(objeto.pagado).toFixed(2);
    tdSaldo.innerHTML = parseFloat(objeto.saldo).toFixed(2);

    tr.appendChild(tdFecha);
    tr.appendChild(tdComprobante);
    tr.appendChild(tdNumero);
    tr.appendChild(tdPagado);
    tr.appendChild(tdSaldo);

    tbody.appendChild(tr);
};

if (venta.saldoAFavor !== 0) {
    const tr = document.createElement('tr');

    const tdFecha = document.createElement('td');
    const tdComprobante  = document.createElement('td');
    const tdNumero = document.createElement('td');
    const tdPagado  = document.createElement('td');
    const tdSaldo = document.createElement('td');
    
    tdFecha.innerHTML = fecha.innerHTML;
    tdComprobante.innerHTML = "Pago A Cuenta";
    tdNumero.innerHTML = "";
    tdPagado.innerHTML = venta.saldoAFavor.toFixed(2);
    tdSaldo.innerHTML = venta.saldoAFavor.toFixed(2);

    tr.appendChild(tdFecha);
    tr.appendChild(tdComprobante);
    tr.appendChild(tdNumero);
    tr.appendChild(tdPagado);
    tr.appendChild(tdSaldo);

    tbody.appendChild(tr);
}
total.value = precio;

await ipcRenderer.send('imprimir',JSON.stringify(opciones));
}

document.addEventListener('keydown',e=>{
    if (e.key=== "Escape") {
        window.close();
    }
})