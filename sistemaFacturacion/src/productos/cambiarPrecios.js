const XLSX = require('xlsx');
const axios = require('axios');
require('dotenv').config();
const URL = process.env.URL;

const select = document.getElementById('marca');
const archivo = document.getElementById('archivo');

const tablaViejo = document.querySelector('.tablaViejo tbody');
const tablaNuevo = document.querySelector('.tablaNuevo tbody');


window.addEventListener('load',async e=>{
    const marcas = (await axios.get(`${URL}productos`)).data;
    marcas.sort((a,b)=>{
        if(a<b){
            return -1
        }else if(a>b){
            return 1
        }
        return 0
    })
    rellenarStock(marcas);
});


const rellenarStock = async(lista)=>{
    for await(let elem of lista){
        const option = document.createElement('option');
        option.value = elem;
        option.text = elem;
        select.appendChild(option)
    }
};

archivo.addEventListener('change',e=>{
    let selectedFile = e.target.files[0]
    let fileReader = new FileReader();
    fileReader.onload =async function(e){
        let data = e.target.result;
        let woorbook = XLSX.read(data,{
            type:"binary"
        });
        let datos = XLSX.utils.sheet_to_json(woorbook.Sheets["IMPORTACIÓN"]);
        let productos = (await axios.get(`${URL}productos/buscarProducto/${select.value}/marca`)).data;
        let lista = [];
        let listaNueva = [];
        for await(let dato of datos){
            const productoBuscado = productos.find(elem=>elem.cod_fabrica === dato.Id);
            const producto = productoBuscado && JSON.parse(JSON.stringify(productoBuscado));
            producto && lista.push(productoBuscado);
            producto && (producto.costo = dato["Precio Vigente"]);
            const impuesto = producto ? parseFloat(producto.costo) + (parseFloat(producto.costo) * parseFloat(producto.impuestos) / 100) : 0;
            producto && (producto.precio_venta = impuesto + (parseFloat(producto.utilidad) * impuesto / 100));
            producto &&  listaNueva.push(producto);
        }
        llenarListaVieja(lista);
        llenarListaNueva(listaNueva)
    }
    fileReader.readAsBinaryString(selectedFile);
});

const llenarListaVieja = async(lista)=>{
    for(let elem of lista){
        console.log(elem)
        const tr = document.createElement('tr');

        const tdCodigo = document.createElement('td');
        const tdDescripcion = document.createElement('td');
        const tdCostoViejo = document.createElement('td');
        const tdCostoDolaresViejo = document.createElement('td');
        const tdPrecioViejo = document.createElement('td');

        tdCodigo.innerHTML = elem._id;
        tdDescripcion.innerHTML = elem.descripcion;
        tdCostoViejo.innerHTML = elem.costo;
        tdCostoDolaresViejo.innerHTML = elem.costodolar.toFixed(2);
        tdPrecioViejo.innerHTML = elem.precio_venta;

        tr.appendChild(tdCodigo);
        tr.appendChild(tdDescripcion);
        tr.appendChild(tdCostoViejo);
        tr.appendChild(tdCostoDolaresViejo);
        tr.appendChild(tdPrecioViejo);

        tablaViejo.appendChild(tr);
    }
}

const llenarListaNueva = async(lista)=>{
    for(let elem of lista){
        const tr = document.createElement('tr');

        const tdCodigo = document.createElement('td');
        const tdDescripcion = document.createElement('td');
        const tdCostoViejo = document.createElement('td');
        const tdCostoDolaresViejo = document.createElement('td');
        const tdPrecioViejo = document.createElement('td');

        tdCodigo.innerHTML = elem._id;
        tdDescripcion.innerHTML = elem.descripcion;
        tdCostoViejo.innerHTML = elem.costo.toFixed(2);
        tdCostoDolaresViejo.innerHTML = elem.costodolar;
        tdPrecioViejo.innerHTML = elem.precio_venta.toFixed(2);

        tr.appendChild(tdCodigo);
        tr.appendChild(tdDescripcion);
        tr.appendChild(tdCostoViejo);
        tr.appendChild(tdCostoDolaresViejo);
        tr.appendChild(tdPrecioViejo);

        tablaNuevo.appendChild(tr);
    }
}