const { ipcRenderer } = require("electron");

const provedor = document.getElementById('provedor');
const fecha = document.getElementById('fecha');
const total = document.getElementById('total');
const totalCheque = document.getElementById('totalCheque');

const tbody = document.querySelector('tbody');

let date;
let comprobantes;
let valores;

console.log("a")

ipcRenderer.on('recibir-informacion',async (e,informacion)=>{
    provedor.innerHTML = informacion.provedor;  
    date = informacion.fecha.slice(0,10).split('-',3);
    fecha.innerHTML = `${date[2]}/${date[1]}/${date[0]}`;
    total.innerHTML = "$ " +  informacion.total;
    totalCheque.innerHTML = "$ " + informacion.total;

    comprobantes = JSON.parse(informacion.comprobantes);    
    await listarComprobantes(comprobantes);
    ipcRenderer.send('imprimir');
});

const listarComprobantes = lista=>{
    for(let elem of lista){
        console.log(elem)
        const tr = document.createElement('tr');

        const tdAplicacion = document.createElement('td');
        const tdImp = document.createElement('td');
        const tdRemitidos = document.createElement('td');
        const tdImporte = document.createElement('td');

        tdAplicacion.innerHTML = elem.numero + " " + elem.tipo;
        tdImp.innerHTML = elem.imp ? elem.imp.toFixed(2) : "";
        tdRemitidos.innerHTML = elem.remitidos;
        tdImporte.innerHTML = elem.importe !== "" ? elem.importe.toFixed(2) : "";

        tr.appendChild(tdAplicacion);
        tr.appendChild(tdImp);
        tr.appendChild(tdRemitidos);
        tr.appendChild(tdImporte);

        tbody.appendChild(tr);
    }
};