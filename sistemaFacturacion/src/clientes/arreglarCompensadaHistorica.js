const axios = require("axios");
const { copiar, botonesSalir, redondear, cerrarVentana } = require("../funciones");
require("dotenv").config;
const URL = process.env.URL;

const sweet = require('sweetalert2');

const compensada = document.querySelector('.compensada');
const historica = document.querySelector('.historica');

const h1 = document.querySelector('h1');
const labelImporte = document.querySelector('[for="importe"]');
const labelPagado = document.querySelector('[for="pagado"]');

const puntoVenta = document.getElementById('puntoVenta');
const numero = document.getElementById('numero');
const tbody = document.querySelector('tbody');

let seleccionado;

window.addEventListener('click',e=>{
    // copiar();
    botonesSalir();
    cerrarVentana();
})

let condicion = "compensada";

historica.addEventListener('click',e=>{
    condicion = "historica";
    labelImporte.innerText = "Debe";
    labelPagado.innerText = "Haber";
    h1.innerText = "Arreglar Historica";
});

compensada.addEventListener('click',e=>{
    condicion = "compensada";
    labelImporte.innerText = "Importe";
    labelPagado.innerText = "Pagado";
    h1.innerText = "Arreglar Compensada";
});

numero.addEventListener('change',async e=>{
    const nro_comp = puntoVenta.value.padStart(4,'0') + "-" + numero.value.padStart(8,'0');
    cuentaTraidas = (await axios.get(`${URL}cuentaComp/numero/${nro_comp}`)).data;
    listar(cuentaTraidas)
});

tbody.addEventListener('dblclick',e=>{
    seleccionado = e.target.nodeName === "TD" ? e.target.parentNode : e.target;
    sweet.fire({
        title:"Cambiar Compensada",
        html:`
            <section>
                <main>
                    <label htmlFor="importe">Importe</label>
                    <input type="number" value=${seleccionado.children[4].innerHTML} name="importe" id="importe" />
                </main>
                <main>
                    <label htmlFor="pagado">Sagado</label>
                    <input type="number" value=${seleccionado.children[5].innerHTML} name="pagado" id="pagado" />
                </main>
                <main>
                    <label htmlFor="saldo">Saldo</label>
                    <input type="number" value=${seleccionado.children[6].innerHTML} name="saldo" id="saldo" />
                </main>
            </section>
        `,
        confirmButtonText:"Guardar",
        showCancelButton:true
    }).then(async ({isConfirmed})=>{
        if (isConfirmed) {
            const importe = document.getElementById('importe');
            const pagado = document.getElementById('pagado');
            const saldo = document.getElementById('saldo');

            const cuentaModificar = cuentaTraidas.find(cuenta=>cuenta._id === parseInt(seleccionado.id));
            cuentaModificar.importe = importe.value;
            cuentaModificar.pagado = pagado.value;
            cuentaModificar.saldo = saldo.value;

            await axios.put(`${URL}cuentaComp/id/${seleccionado.id}`,cuentaModificar);

            location.reload();
        }
    })
});

document.addEventListener('click',e=>{
    if (document.activeElement.nodeName === "INPUT") {
        document.activeElement.select()
    }
});

document.addEventListener('keyup',e=>{
    if (document.activeElement.nodeName === "INPUT" && (e.keyCode === 9 || e.keycode === 13)) {
        document.activeElement.select()
    }
    console.log(document.activeElement.id)
    if(e.keyCode === 13 && document.activeElement.id === "importe"){
        const pagado = document.getElementById('pagado');
        pagado.focus();
        pagado.select();
    }else if(e.keyCode === 13 && document.activeElement.id === "pagado"){
        const saldo = document.getElementById('saldo');
        saldo.focus();
        saldo.select();
    }
});

const listar = (lista)=>{
   for(let cuenta of lista){
        const tr = document.createElement('tr');
        tr.id = cuenta._id;

        const tdIdCliente = document.createElement('td');
        const tdCliente = document.createElement('td');
        const tdTipo = document.createElement('td');
        const tdNumero = document.createElement('td');
        const tdImporte = document.createElement('td')
        const tdPagado = document.createElement('td');
        const tdSaldo = document.createElement('td');

        tdIdCliente.innerHTML = cuenta.codigo;
        tdCliente.innerHTML = cuenta.cliente;
        tdTipo.innerHTML = cuenta.tipo_comp;
        tdNumero.innerHTML = cuenta.nro_comp;
        tdImporte.innerHTML = cuenta.importe;
        tdPagado.innerHTML = cuenta.pagado;
        tdSaldo.innerHTML = cuenta.saldo;

        tr.appendChild(tdIdCliente);
        tr.appendChild(tdCliente);
        tr.appendChild(tdTipo);
        tr.appendChild(tdNumero);
        tr.appendChild(tdImporte);
        tr.appendChild(tdPagado);
        tr.appendChild(tdSaldo);

        
        tbody.appendChild(tr);
   }
};