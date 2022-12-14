const axios = require('axios');
const { ipcRenderer } = require('electron');
require('dotenv').config();
const URL = process.env.URL;

const sweet = require('sweetalert2');
const fs = require('fs');

const { cerrarVentana, redondear } = require('../assets/js/globales');
const personal = require('./Personal.json')

const fecha = document.getElementById('fecha');
const nro_comp = document.getElementById('nro_comp');
const rSocial = document.getElementById('rSocial');
const concepto = document.getElementById('concepto');
const imp = document.getElementById('imp');


const nuevo = document.querySelector('.nuevo');
const borrar = document.querySelector('.borrar');
const agregar = document.querySelector('.agregar');
const modificar = document.querySelector('.modificar');
const salir = document.querySelector('.salir');

window.addEventListener('load',e=>{
    cerrarVentana();
    const date = new Date();

    let day = date.getDate();
    let month = date.getMonth() + 1;
    
    let year = date.getFullYear();

    month = month === 13 ? 1 : month;
    day = day < 10 ? `0${day}` : day;
    month = month < 10 ? `0${month}` : month;

    fecha.value = `${year}-${month}-${day}`;

    ponerPersonal();

});

//AGREGAMOS A LA LSITA DE PERSONAL UN ELEMENTO
nuevo.addEventListener('click',e=>{
    sweet.fire({
        title: "Agregar Personal",
        input:"text",
        confirmButtonText:"Aceptar",
        showCancelButton:true,
    }).then(({isConfirmed,value})=>{
        if (isConfirmed) {
            if (!personal.find(elem=>elem === value.toUpperCase())) {
                personal.push(value.toUpperCase());
                fs.writeFile('src/vales/Personal.json',JSON.stringify(personal),(error)=>{
                    if(error) throw error;
                    console.log("Informacion Recibida");
                })
            }
            
        }
    })
});

//BORRAMOS DE LA LISTA DE PERSONAL A UN ELEMENTO
borrar.addEventListener('click',e=>{
    const index = personal.indexOf(rSocial.value);
    personal.splice(index,1);
    fs.writeFile('src/vales/Personal.json',JSON.stringify(personal),(error)=>{
        if(error) throw error;
        console.log("Informacion Recibida");
    })
});

const ponerPersonal = () => {
    personal.sort((a,b)=>{
        if (a>b) {
            return 1
        }else if(a<b){
            return -1
        }
        return 0
    })
    for(let elem of personal){
        const option = document.createElement('option');
        option.value = elem;
        option.text = elem;

        rSocial.appendChild(option);
    }
}

agregar.addEventListener('click',async e=>{
    const vale = {};

    vale.fecha = fecha.value;
    vale.nro_comp = nro_comp.value;
    vale.rsoc = rSocial.value;
    vale.concepto = concepto.value.toUpperCase();
    vale.imp = imp.value;
    vale.tipo = "P";

    try {
        await axios.post(`${URL}vales`,vale);
        window.close();
    } catch (error) {
        console.log(error)
        await sweet.fire({
            title:"No se pudo cargar el Vale"
        });
    }
});

modificar.addEventListener('click',async e=>{
    const vale = {};
    vale.fecha = fecha.value;
    vale.nro_comp = nro_comp.value;
    vale.rsoc = rSocial.value;
    vale.concepto = concepto.value;
    vale.imp = imp.value;
    vale.tipo = "P";

    try {
        await axios.put(`${URL}vales/id/${modificar.id}`,vale);
        window.close();
    } catch (error) {
        await sweet.fire({
            title:"No se pudo modifcar el vale"
        })
    }
});


nro_comp.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        rSocial.focus();
    }
});

rSocial.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        console.log("a")
        e.preventDefault();
        concepto.focus();
    }
});

concepto.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        imp.focus();
    }
});

imp.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        if (agregar.classList.contains('none')) {
            modificar.focus();
        }else{
            agregar.focus();
        }
    }
});

salir.addEventListener('click',e=>{
    window.close()
});

ipcRenderer.on('recibir-informacion',async (e,args)=>{
    const vale = (await axios.get(`${URL}vales/id/${args}`)).data;
    modificar.classList.remove('none');
    modificar.id = args;
    agregar.classList.add('none');
    fecha.disabled = false;
    llenarInputs(vale);
});

const llenarInputs = (vale)=>{
    nro_comp.value = vale.nro_comp;
    rSocial.value = vale.rsoc;
    concepto.value = vale.concepto;
    imp.value = redondear(vale.imp,2);
}

nro_comp.addEventListener('focus',e=>{
    nro_comp.select();
});

concepto.addEventListener('focus',e=>{
    concepto.select();
});

imp.addEventListener('focus',e=>{
    imp.select();
});
