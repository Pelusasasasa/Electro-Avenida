const { ipcRenderer } = require("electron");
const sweet = require('sweetalert2');

const axios = require('axios');
const { redondear, configAxios } = require("../assets/js/globales");
require('dotenv').config();
const URL = process.env.URL;


const cambio = document.querySelector('#cambio');
const efectivoCaja = document.querySelector('#efectivoCaja');
const cheques = document.querySelector('#cheques');
const cien = document.querySelector('#cien');
const cincuenta = document.querySelector('#cincuenta');
const veinte = document.querySelector('#veinte');
const diez = document.querySelector('#diez');
const monedas = document.querySelector('#monedas');
const guardado = document.querySelector('#guardado');
const uno = document.querySelector('#uno');
const cambioCaja = document.querySelector('#cambioCaja');
const cajaMañana = document.querySelector('#cajaMañana');
const ceroCincuenta = document.querySelector('#ceroCincuenta');
const maleta = document.querySelector('#maleta');

const valesCobrar = document.getElementById('valesCobrar');
const facturasCobrar = document.getElementById('facturasCobrar');
const personal = document.getElementById('personal');
const incobrable = document.getElementById('incobrable');
const tarjetasCobrar = document.getElementById('tarjetasCobrar');
const totalVales = document.getElementById('totalVales');

const chequesEfectivo = document.getElementById('chequesEfectivo');
const valesEfectivo = document.getElementById('valesEfectivo');

const caja1 = document.getElementById('caja1');
const diferencia = document.getElementById('diferencia');

const confirmar = document.getElementById('confirmar');
const salir = document.getElementById('salir');

let desde;
let hasta;

let ultimos = {};
let total = 0;


const cambiarTotales = (input)=>{
    ultimos.ultimo[input.id] = parseFloat(input.value)
    ponerValores(ultimos.ultimo);
};

const confirmarCambios = async(e) => {

    const { isConfirmed } = await sweet.fire({
        title: "Desea Guardar los cambios?",
        confirmButtonText: "Aceptar",
        showCancelButton: true,
        cancelButtonText: "Cancelar"
    });

    if (isConfirmed) {
        ultimos.efectivoCaja = efectivoCaja.value === "" ? 0 : efectivoCaja.value;
        ultimos.cheques = cheques.value === "" ? 0 : cheques.value;
        ultimos.cien = cien.value === "" ? 0 : cien.value;
        ultimos.cincuenta = cincuenta.value === "" ? 0 : cincuenta.value;
        ultimos.veinte = veinte.value === "" ? 0 : veinte.value;
        ultimos.diez = diez.value === "" ? 0 : diez.value;
        ultimos.monedas = monedas.value === "" ? 0 : monedas.value;
        ultimos.guardado = guardado.value === "" ? 0 : guardado.value;
        ultimos.uno = uno.value === "" ? 0 : uno.value;
        ultimos.cambioCaja = cambioCaja.value === "" ? 0 : cambioCaja.value;
        ultimos.cajaMañana = cajaMañana.value === "" ? 0 : cajaMañana.value;
        ultimos.ceroCincuenta = ceroCincuenta.value === "" ? 0 : ceroCincuenta.value;
        ultimos.maleta = maleta.value === "" ? 0 : maleta.value;
    
        try {
            await axios.post(`${URL}ultimos`,ultimos);
            window.close();
        } catch (error) {
            console.log(error)
        }
    };

};

const modificarCambio = () => {
    const cienInput = parseFloat(cien.value);
    const cincuentaInput = parseFloat(cincuenta.value);
    const veinteInput = parseFloat(veinte.value);
    const diezInput = parseFloat(diez.value);
    const monedaInput = parseFloat(monedas.value);
    
    cambio.value = redondear(cienInput + cincuentaInput + veinteInput + diezInput + monedaInput,2);
};

const ponerValores = (obj) =>{
    if (obj) {
        let totalValesCheques = 0;
        efectivoCaja.value = obj.efectivoCaja.toFixed(2)
        cheques.value = obj.cheques.toFixed(2);
        cien.value = obj.cien.toFixed(2);
        cincuenta.value = obj.cincuenta.toFixed(2);
        veinte.value = obj.veinte.toFixed(2);
        diez.value = obj.diez.toFixed(2);
        monedas.value = obj.monedas.toFixed(2);
        guardado.value = obj.guardado.toFixed(2);
        uno.value = obj.uno.toFixed(2);
        cambioCaja.value = obj.cambioCaja.toFixed(2);
        cajaMañana.value = obj.cajaMañana.toFixed(2);
        ceroCincuenta.value = obj.ceroCincuenta.toFixed(2);
        maleta.value = obj.maleta.toFixed(2);

        totalValesCheques += (obj.efectivoCaja + obj.cheques + obj.cien + obj.cincuenta + obj.veinte + obj.diez + obj.monedas + obj.guardado + obj.uno + obj.cambioCaja + obj.cajaMañana + obj.ceroCincuenta + obj.maleta);
        chequesEfectivo.value = redondear(totalValesCheques,2);

        valesEfectivo.value = redondear(parseFloat(chequesEfectivo.value) + parseFloat(totalVales.value),2);

        diferencia.value = redondear(-parseFloat(caja1.value) + parseFloat(valesEfectivo.value),2);

        modificarCambio();
    }
};

const cerrarVentana = async() => {
    const {isConfirmed} = await sweet.fire({
        title:"Al salir no se guardaran los cambios",
        confirmButtonText: "Salir",
        showCancelButton: true,
        cancelButtonText: "Cancelar"
    });

    if (isConfirmed) {
        window.close();
    }
}

const selected = (e)=>{
    e.select()
}
    
ipcRenderer.on('recibir-informacion',async (e,args)=>{
        desde = args.desde;
        hasta = args.hasta;
        const movimientos = (await axios.get(`${URL}movCajas/${desde}/${hasta}`,configAxios)).data;
        for await(let mov of movimientos){
            if (mov.pasado) {
                if (mov.tMov === "I") {
                    total += mov.imp;
                }else{
                    total -= mov.imp;
                }
            }
        };  

        valesCobrar.value = (await axios.get(`${URL}vales/totalPrice/C`,configAxios)).data.toFixed(2);
        personal.value = (await axios.get(`${URL}vales/totalPrice/P`,configAxios)).data.toFixed(2);
        incobrable.value = (await axios.get(`${URL}vales/totalPrice/I`,configAxios)).data.toFixed(2);
        facturasCobrar.value = (await axios.get(`${URL}vales/totalPrice/F`,configAxios)).data.toFixed(2);
        tarjetasCobrar.value = (await axios.get(`${URL}tarjetas/totalPrice`,configAxios)).data.toFixed(2);
        caja1.value = redondear((await axios.get(`${URL}tipoVenta`,configAxios)).data["saldo Inicial"] + total,2);
    
        totalVales.value = redondear(parseFloat(valesCobrar.value) + parseFloat(personal.value) + parseFloat(incobrable.value) + parseFloat(tarjetasCobrar.value) + parseFloat(facturasCobrar.value),2);
        ultimos = (await axios.get(`${URL}ultimos`,configAxios)).data;

        if (ultimos.ok) {
            ponerValores(ultimos.ultimo);    
        }else{
            await sweet.fire(ultimos.msg)
        }
        
});

document.addEventListener('keyup',async e=>{
    if ((e.keyCode === 27)) {
        cerrarVentana();
    }
});

efectivoCaja.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        cheques.focus();
    };
});

cheques.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        cien.focus();
    };
});

cien.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        cincuenta.focus();
    };
});

cincuenta.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        veinte.focus();
    };
});

veinte.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        diez.focus();
    };
});

diez.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        monedas.focus();
    };
});

monedas.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        guardado.focus();
    };
});

guardado.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
       uno.focus();
    };
});

uno.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
       cambioCaja.focus();
    };
});

cambioCaja.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
       cajaMañana.focus();
    };
});

cajaMañana.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
       ceroCincuenta.focus();
    };
});

ceroCincuenta.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
       maleta.focus();
    };
});

confirmar.addEventListener('click', confirmarCambios);

salir.addEventListener('click', cerrarVentana);

efectivoCaja.addEventListener('change',e=>{
    cambiarTotales(e.target)
});

cheques.addEventListener('change',e=>{
    cambiarTotales(e.target)
});

cien.addEventListener('change',e=>{
    cambiarTotales(e.target);
    modificarCambio();
});

cincuenta.addEventListener('change',e=>{
    cambiarTotales(e.target);
    modificarCambio();
});

veinte.addEventListener('change',e=>{
    cambiarTotales(e.target);
    modificarCambio();
});

diez.addEventListener('change',e=>{
    cambiarTotales(e.target)
    modificarCambio();
});

monedas.addEventListener('change',e=>{
    cambiarTotales(e.target);
    modificarCambio();
});

guardado.addEventListener('change',e=>{
    cambiarTotales(e.target)
});

uno.addEventListener('change',e=>{
    cambiarTotales(e.target)
});

cambioCaja.addEventListener('change',e=>{
    cambiarTotales(e.target)
});

cajaMañana.addEventListener('change',e=>{
    cambiarTotales(e.target)
});

ceroCincuenta.addEventListener('change',e=>{
    cambiarTotales(e.target)
});

maleta.addEventListener('change',e=>{
    cambiarTotales(e.target)
});
