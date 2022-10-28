const axios = require('axios');
const sweet = require('sweetalert2');

require('dotenv').config();
const URL = process.env.URL;
let data = new FormData();

const codigo = document.querySelector('#codigo');
const codFabrica = document.querySelector('#cod-fabrica');
const descripcion = document.querySelector('#descripcion');
const provedor = document.querySelector('#provedor');
const marca = document.querySelector('#marca');
const stock = document.querySelector('#stock');
const tasaIva = document.querySelector('#tasaIva');
const costoPesos = document.querySelector('#costoPesos');
const costoDolares = document.querySelector('#costoDolares');
const ivaImp = document.querySelector('#ivaImp');
const costoTotal = document.querySelector('#costoTotal');
const observaciones = document.querySelector('#observaciones'); 
const utilidad = document.querySelector('#utilidad');
const precioVenta = document.querySelector('#precioVenta');
const imagen = document.querySelector('#imagen');
const unidad = document.querySelector('#unidad');
const salir = document.querySelector('.salir');
const agregar = document.querySelector('.agregar');
const select = document.querySelector('#rubros');


let valorTasaIva = 26
let letraIva = "N"
let costoT = 0 //costo total
let precioV = 0 //Precio Venta
let dolar = 0

//No enviar el formulario al apretar enter
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('input[type=text]').forEach( node => node.addEventListener('keypress', e => {
      if(e.keyCode == 13) {
        e.preventDefault();
      }
    }))
});

//Traer el dolar
window.addEventListener('load',async e=>{
    let numeros = (await axios.get(`${URL}tipoVenta`)).data;
    let rubros = (await axios.get(`${URL}rubros`)).data;
    listarRubros(rubros)
    dolar = numeros.dolar;
});

//Listamos los rubros que tenemos cargados
const listarRubros = async(rubros)=>{
    for(let rubro of rubros){
        const option = document.createElement('option');

        option.value = rubro.codigo;
        option.text = rubro.codigo + ' - '  + rubro.nombre;

        select.appendChild(option)
    }
};

//Vemos si el codigo que se puso ya esta utilizado o no
codigo.addEventListener('blur',async e=>{
    if(codigo.value !== ""){
        let producto = (await axios.get(`${URL}productos/${codigo.value}`)).data;
            if(producto !== ""){
                sweet.fire({title:"El codigo ya es utilizador por " + producto.descripcion});
                codigo.value = "";
                codigo.focus(); 
            }
    }
})

tasaIva.addEventListener('blur  ', (e) =>{
    letraIva = devolverIva(e.target.value)
    valorTasaIva = tasaIvas(e.target.value);
});

costoDolares.addEventListener('blur', (e) =>{   
   costoDolares.value !== "" && (costoT = resultado(parseFloat(costoDolares.value),valorTasaIva,dolar))   ;
});

costoTotal.addEventListener('focus' , (e) =>{
    (costoPesos.value === "" || parseFloat(costoPesos.value) === 0) ? (ivaImp.value = parseFloat((parseFloat(costoDolares.value) * valorTasaIva / 100).toFixed(2))) : ivaImp.value = (parseFloat(costoPesos.value) * valorTasaIva / 100).toFixed(2)
    costoT = parseFloat(ivaImp.value)
    let costoP = 0;
    if ((costoPesos.value) === "" || parseFloat(costoPesos.value) === 0) {
        costoTotal.value = ((parseFloat(costoDolares.value) + parseFloat(ivaImp.value))*dolar).toFixed(2)
    }else{
        costoP = parseFloat(costoPesos.value)
        costoTotal.value = ((costoT+costoP).toFixed(2));
    }


})

utilidad.addEventListener('blur', (e) => {
    precioV = resultado(parseFloat(costoTotal.value),parseFloat(utilidad.value))
})

precioVenta.addEventListener('focus', (e) =>{
    precioVenta.value = parseFloat((precioV+parseFloat(costoTotal.value)).toFixed(2))
})

agregar.addEventListener('click' ,async  (e) =>{
    e.preventDefault();

    if (descripcion.value === "") {
        await sweet.fire({
            title:"Falta Descripcion del producto"
        });
    }else{


    const producto = {
        _id: codigo.value,
        cod_fabrica: codFabrica.value,
        descripcion: descripcion.value,
        provedor: provedor.value,
        marca: marca.value,
        stock: stock.value,
        iva: letraIva,
        observacion: observaciones.value,
        costo: costoPesos.value,
        costodolar: parseFloat(costoDolares.value),
        impuestos: ivaImp.value,
        utilidad: utilidad.value,
        precio_venta: precioVenta.value,
        unidad: unidad.value,
        rubro:select.value
    }

    //Enviamos el producto al servidor
    await axios.post(`${URL}productos`,producto);
    //enviamos la imagen si es que tiene
    if (imagen.files[0]) {
        data.append('imagen',imagen.files[0]);
        await axios.put(`${URL}productos/${producto._id}/image`,data,{
            headers:{
                'Content-Type': `multipart/form-data`,
            }
        });
    }
    window.close();
    }
})

function devolverIva(palabra) {
    if (palabra === "normal") {
        return "N";
    }else{
        return "R"
    }
}

function tasaIvas(palabra) {
    if (palabra === "normal") {
        return 26;
    }else{
        return 15;
    }
}

function resultado(numero1,numero2,dolar=1) {
    return numero1*numero2*dolar/100;
}

document.addEventListener('keydown',e=>{
    if (e.key === "Escape") {
        window.close()
    }
})

function selecciona_value(idInput) {
    valor_input = document.getElementById(idInput).value;
    longitud = valor_input.length;
    var selectionEnd = 0 + 1;
    if (document.getElementById(idInput).setSelectionRange) {
    document.getElementById(idInput).focus();
    document.getElementById(idInput).setSelectionRange (0, longitud);
    }
    else if (input.createTextRange) {
    var range = document.getElementById(idInput).createTextRange() ;
    range.collapse(true);
    range.moveEnd('character', 0);
    range.moveStart('character', longitud);
    range.select();
    }
}

codigo.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
        codFabrica.focus()
    }
});

codFabrica.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
        descripcion.focus()
    }
});

descripcion.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
        unidad.focus()
    }
});

unidad.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        e.preventDefault();
        imagen.focus()
    }
});

stock.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
        provedor.focus()
    }
});

provedor.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
        rubros.focus()
    }
});

rubros.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        e.preventDefault();
        marca.focus();
    }
})

marca.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
        tasaIva.focus()
    }
});

tasaIva.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        costoPesos.focus();
    }
});

costoPesos.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
        costoDolares.focus()
    }
});

costoDolares.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
        costoTotal.focus()
    }
});

costoTotal.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
        observaciones.focus()
    }
});

observaciones.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
        utilidad.focus()
    }
});

utilidad.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
        precioVenta.focus();
    }
});

precioVenta.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
        agregar.focus()
    }
});

utilidad.addEventListener('focus',e=>{
    selecciona_value(utilidad.id)
});

costoPesos.addEventListener('focus',e=>{
    selecciona_value(costoPesos.id)
});

costoDolares.addEventListener('focus',e=>{
    selecciona_value(costoDolares.id)
});

marca.addEventListener('focus',e=>{
    selecciona_value(marca.id)
});

stock.addEventListener('focus',e=>{
    selecciona_value(stock.id)
});

provedor.addEventListener('focus',e=>{
    selecciona_value(provedor.id)
});

descripcion.addEventListener('focus',e=>{
    selecciona_value(descripcion.id)
});

codigo.addEventListener('focus',e=>{
    selecciona_value(codigo.id)
});

codFabrica.addEventListener('focus',e=>{
    selecciona_value(codFabrica.id)
});

ivaImp.addEventListener('focus',e=>{
    selecciona_value(ivaImp.id)
});

costoTotal.addEventListener('focus',e=>{
    selecciona_value(costoTotal.id)
});

observaciones.addEventListener('focus',e=>{
    selecciona_value(observaciones.id)
});

salir.addEventListener('click',e=>{
    window.close()
});