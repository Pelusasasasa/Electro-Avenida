const axios = require('axios');
require('dotenv').config();
const URL = process.env.URL;

let provedores = [];
let total = 0;

const tbody = document.querySelector('tbody');
const saldo = document.querySelector('#saldo');
saldo.classList.add('text-end')

window.addEventListener('load',async e=>{
    provedores = (await axios.get(`${URL}provedor/conSaldo`)).data;
    listar(provedores)
});


const listar = async(lista)=>{
    for await(let elem of  lista){
        console.log(elem)
        const tr = document.createElement('tr');

        const tdCodigo = document.createElement('td');
        const tdNombre = document.createElement('td');
        const tdProvedor = document.createElement('td');
        const tdSaldo = document.createElement('td');
        tdSaldo.classList.add('text-end')

        tdCodigo.innerHTML = elem.codigo.padStart(5,'0');
        tdNombre.innerHTML = elem.nombre;
        tdProvedor.innerHTML = elem.provedor;
        tdSaldo.innerHTML = elem.saldo.toFixed(2);

        tr.appendChild(tdCodigo);
        tr.appendChild(tdNombre);
        tr.appendChild(tdProvedor);
        tr.appendChild(tdSaldo);

        tbody.appendChild(tr);

        total += elem.saldo;
    }   
    saldo.value = total.toFixed(2);
}


document.addEventListener('keydown',e=>{
    if (e.key === "Escape") {
        window.close();
    }
})