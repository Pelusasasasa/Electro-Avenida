const XLSX = require('xlsx');
const axios = require('axios');
require('dotenv').config();
const URL = process.env.URL;

const select = document.getElementById('marca');
const archivo = document.getElementById('archivo');

window.addEventListener('load',async e=>{
    const marcas = (await axios.get(`${URL}productos`)).data;
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
        for await(let dato of datos){
            console.log(dato.Id)
        }
    }
    fileReader.readAsBinaryString(selectedFile);
})