const { ipcRenderer } = require("electron");

require('dotenv').config();
const URL = process.env.URL;
const axios = require("axios");

const { redondear, configAxios, verNombrePc } = require("../funciones");
const sweet = require('sweetalert2');
const path = require('path');

let info = [];

const codigo = document.querySelector('#codigo');
const codFabrica = document.querySelector('#cod-fabrica');
const dolarInput = document.querySelector('#dolar');

const descripcion = document.querySelector('#descripcion');

const unidad = document.querySelector('#unidad');
const stock = document.querySelector('#stock');

const provedor = document.querySelector('#provedor');
const select = document.querySelector('#rubros');
const subRubros = document.querySelector('#subRubros');
const marca = document.querySelector('#marca');

const tasaIva = document.querySelector('#tasaIva');
const costoPesos = document.querySelector('#costoPesos');
const costoDolares = document.querySelector('#costoDolares');
const ivaImp = document.querySelector('#ivaImp')
const costoTotal = document.querySelector('#costoTotal');

const observaciones = document.querySelector('#observaciones');
const oferta = document.querySelector('#oferta');
const precioOferta = document.querySelector('#precioOferta');

const utilidad = document.querySelector('#utilidad');
const precioVenta = document.querySelector('#precioVenta');

const imagen = document.querySelector('#imagen');
const destacado = document.querySelector('#destacado');
const mostrarWeb = document.querySelector('#mostrarWeb');

const masDatos = document.querySelector('#masDatos');

//Botones
const modificar = document.querySelector('.modificar');
const guardar = document.querySelector('.guardar');
const salir = document.querySelector('.salir')

let dolar = 0;
let costo = 0;
let valorTasaIva = 26;
let acceso;
let producto; 
let vendedor;

//Traer el dolar
window.addEventListener('load',async e=>{
    let numeros = (await axios.get(`${URL}tipoVenta`,configAxios)).data;
    dolar = numeros.dolar;
    dolarInput.value = dolar;
});

//listamos los rubros para que tenemos en la base de datos
const listarRubros = async(lista)=>{
    for(let elem of lista){
        const option = document.createElement('option');
        option.value = `${elem.codigo}`;
        option.text = elem.codigo + ' - ' + elem.nombre;

        select.appendChild(option)
    }
};

const listarSubRubros = async(rubro)=>{
    const subRubrosLista = (await axios.get(`${URL}rubros/${rubro}`,configAxios)).data.subRubros;
    if (subRubrosLista) {
        for(let rubro of subRubrosLista){
            const option = document.createElement('option');
            option.value = `${rubro}`;
            option.text = rubro;
    
            subRubros.appendChild(option)
        }
    }
}

ipcRenderer.on('id-producto',async(e,args)=>{
    let rubros = (await axios.get(`${URL}rubros`,configAxios)).data;
    producto = (await axios.get(`${URL}productos/${args}`,configAxios)).data;
    await listarRubros(rubros);
    producto.rubro && await listarSubRubros(producto.rubro);
    await asignarCampos(producto);
    
});

ipcRenderer.on('acceso',(e,args)=>{
    acceso = JSON.parse(args)
    if (acceso === "2") {
        document.querySelector('.costos').classList.add('none');
        document.querySelector('.utilidad').classList.add('none')
    }
});

ipcRenderer.on('vendedor',(e,args)=>{
    vendedor = args;
});

function asignarCampos(producto) {
    codigo.value = producto._id;
    codFabrica.value = producto.cod_fabrica;
    descripcion.value = producto.descripcion;

    provedor.value = producto.provedor;
    select.value = producto.rubro ? producto.rubro : select.value = "0";
    subRubros.value = producto.subRubro ? producto.subRubro : subRubros.value = "0";
    marca.value = producto.marca;

    unidad.value = producto.unidad;
    stock.value = producto.stock

    tasaIva.value = producto.iva;

    info = producto.datos.join("\n");
    (parseFloat(producto.costo) !== 0) ? (costoPesos.value = parseFloat(producto.costo).toFixed(2)) : (costoPesos.value = "0.00");
    (parseFloat(producto.costodolar) !== 0) ? (costoDolares.value = parseFloat(producto.costodolar).toFixed(3)) : (costoDolares.value = "0.00");

    if (parseFloat(costoDolares.value) !== 0) {
        ivaImp.value = parseFloat(producto.impuestos);
        costo = parseFloat(costoDolares.value);
        costoTotal.value = ((costo+parseFloat(producto.impuestos))*dolar).toFixed(3);
    }else{
        ivaImp.value = parseFloat(producto.impuestos);
        costo = parseFloat(costoPesos.value);
        costoTotal.value = ((costo+parseFloat(producto.impuestos))).toFixed(3);
    }

    observaciones.value = producto.observacion;
    oferta.checked = producto.oferta;
    precioOferta.value = producto.precioOferta;

    utilidad.value=(parseFloat(producto.utilidad)).toFixed(2);
    precioVenta.value = producto.precio_venta;

    destacado.checked = producto.destacado;
    mostrarWeb.checked = producto.web;

    valorTasaIva = tasaIvas(producto.iva);
};

select.addEventListener('change',async e => {
    subRubros.innerHTML = ' <option value="0">---Seleccionar---</option> ';
    listarSubRubros(e.target.value)
});

tasaIva.addEventListener('click', (e) =>{
    valorTasaIva = tasaIvas(e.target.value);
});


modificar.addEventListener('click',e=>{
    modificar.classList.add('none');
    guardar.classList.remove('none');

    codFabrica.removeAttribute("disabled");
    descripcion.removeAttribute("disabled"); 
    unidad.removeAttribute('disabled');

    provedor.removeAttribute("disabled");
    rubros.removeAttribute('disabled');
    subRubros.removeAttribute('disabled');
    marca.removeAttribute("disabled"); 

    tasaIva.removeAttribute("disabled"); 
    costoPesos.removeAttribute("disabled"); 
    costoDolares.removeAttribute("disabled"); 
    costoTotal.removeAttribute("disabled"); 

    observaciones.removeAttribute("disabled");
    oferta.removeAttribute('disabled');
    if (oferta.checked) {
        precioOferta.removeAttribute('disabled');
    }

    utilidad.removeAttribute("disabled"); 
    precioVenta.removeAttribute("disabled"); 

    mostrarWeb.removeAttribute('disabled');
    destacado.removeAttribute('disabled');

})

guardar.addEventListener('click',async e=>{
    let producto = {};
    producto._id = codigo.value
    producto.cod_fabrica = codFabrica.value
    producto.descripcion = descripcion.value.toUpperCase();

    producto.stock = stock.value;
    producto.unidad = unidad.value;
    
    producto.provedor = provedor.value;
    producto.rubro = select.value;
    producto.subRubro = subRubros.value;
    producto.marca = marca.value;

    
    producto.iva = tasaIva.value;
    producto.costo = costoPesos.value;
    producto.costodolar = parseFloat(costoDolares.value);
    producto.impuestos = ivaImp.value;

    producto.observacion = observaciones.value;
    producto.oferta = oferta.checked;
    producto.precioOferta = parseFloat(precioOferta.value);

    producto.utilidad = utilidad.value;
    producto.precio_venta = precioVenta.value;

    producto.destacado = destacado.checked;
    producto.web = mostrarWeb.checked;

    producto.vendedor = vendedor;
    producto.datos = info;
    producto.maquina = verNombrePc();
    
    await axios.put(`${URL}productos/${producto._id}`,producto,configAxios);

    if (imagen.files[0]) {

        //Gaurdamos la imgane en la carpeta
        const fs = require('fs');
        const streamLectura = fs.createReadStream(imagen.files[0].path);
        const streamEscritura = fs.createWriteStream('\\\\SERVIDOR//imagenes//' + producto._id + ".jpg");

        streamLectura.pipe(streamEscritura);

        //guardar en cloudinary
        const {v2:cloudinary} = require('cloudinary');
        //configuracion
        cloudinary.config({
            cloud_name:"dyo36foif",
            api_key:"146911571979255",
            api_secret: "_hFmQnWkIfztgcsqCcW5M_lMupc",
        });

        
        await cloudinary.uploader.upload(imagen.files[0].path,{
            folder:"EA",
            public_id:producto._id,
            resource_type: 'image'
        }).then(console.log)
    }
    
    ipcRenderer.send('productoModificado',producto);

    window.close();
});

salir.addEventListener('click',e=>{
    window.close();
})

document.addEventListener('keydown',e=>{
    if (e.key === "Escape") {
        window.close()
    }
});

function resultado(numero1,numero2,dolar=1) {
    return numero1*numero2*dolar/100;
};

function tasaIvas(palabra) {
    if (palabra === "N") {
        return 26;
    }else{
        return 15;
    }
};

codigo.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
        codFabrica.focus();
    }
})

codFabrica.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
        descripcion.focus();
    }
});

descripcion.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
        unidad.focus();
    }
});

unidad.addEventListener('keypress',e=>{
    e.preventDefault();
    if (e.key === "Enter") {
        provedor.focus();
    }
});
    
stock.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
        provedor.focus();
    }
});
    
provedor.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
        marca.focus();
    }
});
    
marca.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
        tasaIva.focus();
    }
})

tasaIva.addEventListener('keypress',e=>{
    e.preventDefault();
    if (e.key === "Enter") {
        costoPesos.focus();
        costoPesos.select();
    }
})
    
costoPesos.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
        costoDolares.focus();
        costoDolares.select();
    }
})
    
costoDolares.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
        costoTotal.focus();
    }
})
    
ivaImp.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
        costoTotal.focus()
    }
})
    
costoTotal.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
        observaciones.focus()
    }
})
    
observaciones.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
        oferta.focus()
    }
});

oferta.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
        if (oferta.checked) {
            precioOferta.focus()
        }else{
            utilidad.focus();
        };
    }
});

precioOferta.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        utilidad.focus();
    }
})
    
utilidad.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
        precioVenta.focus()
    }
})
    
precioVenta.addEventListener('keypress',e=>{
    if (e.key === "Enter") {
        guardar.focus();
    }
})

utilidad.addEventListener('focus',e=>{
    utilidad.select();
})

costoPesos.addEventListener('focus',e=>{
    costoPesos.select();
})

costoDolares.addEventListener('focus',e=>{
    costoDolares.select();
})

marca.addEventListener('focus',e=>{
    marca.select();
})

stock.addEventListener('focus',e=>{
    stock.select();
})

provedor.addEventListener('focus',e=>{
    provedor.select();
})

descripcion.addEventListener('focus',e=>{
    descripcion.select();
})

codigo.addEventListener('focus',e=>{
    codigo.select();
})

codFabrica.addEventListener('focus',e=>{
    codFabrica.select();
})

ivaImp.addEventListener('focus',e=>{
    ivaImp.select();
})

costoTotal.addEventListener('focus',e=>{
    costoTotal.select();
})

observaciones.addEventListener('focus',e=>{
    observaciones.select();
});

precioOferta.addEventListener('focus',e=>{
    precioOferta.select();
})

costoTotal.addEventListener('focus',()=>{
    console.log((costoPesos.value * valorTasaIva / 100))
    ivaImp.value = (parseFloat(costoDolares.value) !== 0) ? (parseFloat((costoDolares.value * valorTasaIva / 100).toFixed(2))) :  (costoPesos.value * valorTasaIva / 100).toFixed(2)
    
    costoT = parseFloat(ivaImp.value)
    let costoP = 0
    
    if (parseFloat(costoDolares.value) !== 0) {
        const costoMasIVa = parseFloat(redondear(parseFloat(ivaImp.value) + parseFloat(costoDolares.value),2));
        costoTotal.value = redondear(costoMasIVa*dolar,2);
    }else{
        costoP = parseFloat(costoPesos.value)
        costoTotal.value = redondear((parseFloat(ivaImp.value) + costoP),2);
    }
});

precioVenta.addEventListener('focus',e=>{
    precioVenta.select();
    const aux = (parseFloat(utilidad.value)*parseFloat(costoTotal.value)/100).toFixed(2)
    precioVenta.value = Math.round((parseFloat(aux) + parseFloat(costoTotal.value))).toFixed(2)
});

oferta.addEventListener('change',e =>{
    if (oferta.checked) {
        precioOferta.removeAttribute('disabled');
    }else{
        precioOferta.setAttribute('disabled','');
    }
});

masDatos.addEventListener('click',async e => {
    const {value} = await sweet.fire({
        title:"Datos",
        input: 'textarea',
        inputValue:info
    });

    info = value.split('\n');
})