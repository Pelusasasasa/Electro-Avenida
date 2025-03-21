const { clipboard, ipcRenderer } = require("electron");

require('dotenv').config();
const URL = process.env.URL


const alerta = async (mensaje) => {
    await sweet.fire({
        title: mensaje,
        returnFocus: false
    })
};


const copiar = (elem) => {
    document.addEventListener('keydown', e => {
        if (e.keyCode === 17) {
            document.addEventListener('keydown', event => {
                if (event.keyCode === 67) {
                    const texto = document.querySelector('.subSeleccionado');
                    clipboard.writeText(texto.innerHTML)
                }
            })
        }
    })
}

const redondear = (numero, decimales) => {
    const signo = numero >= 0 ? 1 : -1;
    return (parseFloat(Math.round((numero * Math.pow(10, decimales)) + (signo * 0.0001)) / Math.pow(10, decimales)).toFixed(decimales));
}

const cerrarVentana = () => {
    document.addEventListener('keyup', e => {
        if (e.keyCode === 27) {
            window.close();
        }
    });
    document.getElementById('salir') && document.getElementById('salir').addEventListener('click', e => {
        window.close();
    });
};

const generarMovimientoCaja = async (fecha, tMov, nro_comp, cuenta, idCuenta, imp, desc) => {
    const movimiento = {};
    movimiento.fecha = fecha;
    movimiento.tMov = tMov;
    movimiento.nro_comp = nro_comp;
    movimiento.cuenta = cuenta.toUpperCase();
    movimiento.idCuenta = idCuenta;
    movimiento.imp = imp;
    movimiento.desc = desc.toUpperCase();
    movimiento.pasado = true;
    try {
        await axios.post(`${URL}movCajas`, movimiento, configAxios);
    } catch (error) {
        console.log(error)
        await sweet.fire({
            title: "no se pudo cargar el movimiento de caja"
        });
    }
};

const recorrerFlechas = async (code) => {
    if (code === 40 && seleccionado.nextElementSibling) {
        let aux = 0;
        let i = 0;
        const tds = document.querySelectorAll('.seleccionado td');

        for (let td of tds) {
            if (td.classList.contains('subSeleccionado')) {
                aux = i;
            }
            i++;
        }


        seleccionado && seleccionado.classList.remove('seleccionado');
        seleccionado = seleccionado.nextElementSibling;
        seleccionado.classList.add('seleccionado');

        subSeleccionado && subSeleccionado.classList.remove('subSeleccionado');
        subSeleccionado = seleccionado.children[aux];
        subSeleccionado.classList.add('subSeleccionado');


    } else if (code === 38 && seleccionado.previousElementSibling) {
        let aux = 0;
        let i = 0;
        const tds = document.querySelectorAll('.seleccionado td');

        for (let td of tds) {
            if (td.classList.contains('subSeleccionado')) {
                aux = i;
            }
            i++;
        }

        seleccionado && seleccionado.classList.remove('seleccionado');
        seleccionado = seleccionado.previousElementSibling;
        seleccionado.classList.add('seleccionado');

        subSeleccionado && subSeleccionado.classList.remove('subSeleccionado');
        subSeleccionado = seleccionado.children[aux];
        subSeleccionado.classList.add('subSeleccionado');
    } else if (code === 37 && subSeleccionado.previousElementSibling) {

        subSeleccionado && subSeleccionado.classList.remove('subSeleccionado');
        subSeleccionado = subSeleccionado.previousElementSibling;
        subSeleccionado.classList.add('subSeleccionado');

    } else if (code === 39 && subSeleccionado.nextElementSibling) {

        subSeleccionado && subSeleccionado.classList.remove('subSeleccionado');
        subSeleccionado = subSeleccionado.nextElementSibling;
        subSeleccionado.classList.add('subSeleccionado');
    }

    subSeleccionado && subSeleccionado.scrollIntoView({
        inline: "center",
        block: "center"
    })
};

const clave = btoa(`electroAvenida:Elbio935`);
const configAxios = {
    headers: {
        "ngrok-skip-browser-warning": "69420",
        "Authorization": `Basic ${clave}`
    }
};

const clickderecho = (e, texto) => {
    const cordenadas = {
        x: e.clientX,
        y: e.clientY,
        ventana: texto
    };

    ipcRenderer.send('mostrar-menu-secundario', cordenadas);

};

const fechaUTC = (dato) => {
    const fecha = new Date(`${dato}T00:00:00.000Z`);

    const ahora = new Date();
    const hours = ahora.getUTCHours();
    const minuts = ahora.getUTCMinutes();
    const seconds = ahora.getUTCSeconds();

    fecha.setUTCHours(hours, minuts, seconds);

    const fechaUTC = new Date(
        Date.UTC(
            fecha.getFullYear(),
            fecha.getMonth(),
            fecha.getDate(),
            fecha.getHours(),
            fecha.getMinutes(),
            fecha.getSeconds()
        )
    );

    return fechaUTC;
}

module.exports = { alerta, cerrarVentana, copiar, redondear, generarMovimientoCaja, configAxios, clickderecho, fechaUTC }
