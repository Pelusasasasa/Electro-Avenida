const { ipcRenderer } = require("electron");

const cliente = document.getElementById('cliente');
const telefono = document.getElementById('telefono');
const tbody = document.getElementById('tbody');

let pedidos = {}

ipcRenderer.on('info-para-imprimir', (e, args) => {
    pedidos = JSON.parse(args);
    cliente.innerText = pedidos[0].cliente
    telefono.innerText = pedidos[0].telefono;

    listarPedidos(pedidos);
});


const listarPedidos = async(lista) => {
    for(let elem of lista){
        const tr = document.createElement('tr');

        const tdCantidad = document.createElement('td');
        const tdCodigo = document.createElement('td');
        const tdDescripcion = document.createElement('td');
        const tdMarca = document.createElement('td');

        tdCantidad.innerText = elem.cantidad.toFixed(2);
        tdCodigo.innerText = elem.codigo._id;
        tdDescripcion.innerText = elem.codigo.descripcion;
        tdMarca.innerText = elem.codigo.marca;

        tdCantidad.classList.add('border');
        tdCodigo.classList.add('border');
        tdDescripcion.classList.add('border');
        tdMarca.classList.add('border');


        tr.appendChild(tdCantidad);
        tr.appendChild(tdCodigo);
        tr.appendChild(tdDescripcion);
        tr.appendChild(tdMarca);


        tbody.appendChild(tr);
    };

    const options = {
        silent: true
    }

    ipcRenderer.send('imprimir',JSON.stringify(options));
};