const XLSX = require('xlsx');
const axios = require('axios');
require('dotenv').config();
const URL = process.env.URL;

const select = document.getElementById('marca');
const archivo = document.getElementById('archivo');

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
        for await(let dato of datos){
            for await(let producto of productos){
                if(producto.cod_fabrica === dato.Id){
                    productosEncontrados.push({
                        producto,
                        dato
                    })
                }
            }
        }
    }
    fileReader.readAsBinaryString(selectedFile);
})