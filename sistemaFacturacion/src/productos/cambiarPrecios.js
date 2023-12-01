const XLSX = require('xlsx');
const axios = require('axios');
const { configAxios, redondear } = require('../funciones');
require('dotenv').config();
const URL = process.env.URL;

const sweet = require('sweetalert2');

const select = document.getElementById('marca');
const dolar = document.getElementById('dolar');
const archivo = document.getElementById('archivo');

const tablaViejo = document.querySelector('.tablaViejo tbody');
const tablaNuevo = document.querySelector('.tablaNuevo tbody');

const confirmar = document.getElementById('confirmar');

let productosAGuardar = [];

window.addEventListener('load',async e=>{
    const marcas = (await axios.get(`${URL}productos`,configAxios)).data;
    const provedores = (await axios.get(`${URL}productos/provedores`,configAxios)).data;
    dolar.value = (await axios.get(`${URL}tipoVenta`,configAxios)).data.dolar;
    
    marcas.sort((a,b)=>{
        if(a<b){
            return -1
        }else if(a>b){
            return 1
        }
        return 0
    })
    rellenarStock(marcas,provedores);
});

select.addEventListener('change',async e=>{
    if (select.value === "SAN JUSTO") {
        await sweet.fire({
            title: "La columna de codigo de fabrica tiene que llamarse CODIGO y la de costo PRECIO en el EXCEL",
            returnFocus:false
        });
    }else if(select.value === "MB"){
        await sweet.fire({
            title:"Borrar la prime fila dejando como primera la fila de codigo y descripcion y tambien poner el nombre de la hoja como Lista",
            returnFocus:false
        })
    }
    dolar.focus();
});

const rellenarStock = async(lista,lista2)=>{
    for await(let elem of lista){
        if (elem === "SAN JUSTO" || elem === "BREMEN" || elem === "INTERELEC" || elem === "MB") {
            const option = document.createElement('option');
            option.value = elem;
            option.text = "M - " + elem;
            select.appendChild(option);
        }
    };

    for await(let elem of lista){
        if (elem === "GOMEZ" || elem === "LANUS" || elem === "PAGLIAROLI") {
            const option = document.createElement('option');
            option.value = elem;
            option.classList.add('provedor');
            option.text = "P - " + elem;;
            select.appendChild(option);
        }
    };
};

archivo.addEventListener('change',e=>{
    let selectedFile = e.target.files[0]
    let fileReader = new FileReader();
    fileReader.onload =async function(e){

        let data = e.target.result;
        let woorbook = XLSX.read(data,{
            type:"binary"
        });

        let productos = [];
        
        if (select.options[select.selectedIndex].classList.contains('provedor')) {
            productos =(await axios.get(`${URL}productos/provedores/${select.value}`,configAxios)).data;    
        }else{
            productos = (await axios.get(`${URL}productos/marcas/${select.value}`,configAxios)).data;
        };
        if (select.value === "SAN JUSTO") {
            let datos = XLSX.utils.sheet_to_json(woorbook.Sheets["Export"]);
            cambiarPreciosSanJusto(datos,productos);
        }else if(select.value === "BREMEN"){
            let datos = XLSX.utils.sheet_to_json(woorbook.Sheets["BREMEN® Tools Argentina"]);
            console.log(datos);
            cambiarPrecioBremen(datos,productos);
        }else if(select.value === "INTERELEC"){
            let datos = XLSX.utils.sheet_to_json(woorbook.Sheets["Hoja1"]);
            cambiarPrecioInterelec(datos,productos);
        }else if(select.value === "MB"){
            let datos = XLSX.utils.sheet_to_json(woorbook.Sheets["Lista"]);
            console.log(productos)
            cambiarPrecioMB(datos,productos);
        }else if(select.value === "GOMEZ"){
            let datos = XLSX.utils.sheet_to_json(woorbook.Sheets["Hoja1"]);
            cambiarPrecioGomez(datos,productos);
        }else if(select.value === "LANUS"){
            let datos = XLSX.utils.sheet_to_json(woorbook.Sheets["Hoja1"]);
            cambiarPrecioLanus(datos,productos);
        }else if(select.value === "PAGLIAROLI"){
            let datos = XLSX.utils.sheet_to_json(woorbook.Sheets["Lista"]);
            cambiarPrecioPagliaroli(datos,productos);
        }

        llenarListaVieja(productos);
    }
    fileReader.readAsBinaryString(selectedFile);
});

const llenarListaVieja = async(lista)=>{
    for(let elem of lista){
        const tr = document.createElement('tr');

        const tdCodigo = document.createElement('td');
        const tdDescripcion = document.createElement('td');
        const tdCostoViejo = document.createElement('td');
        const tdCostoDolaresViejo = document.createElement('td');
        const tdPrecioViejo = document.createElement('td');
        const tdCodFabrica = document.createElement('td');

        tdCodigo.innerHTML = elem._id;
        tdDescripcion.innerHTML = elem.descripcion;
        tdCostoViejo.innerHTML = elem.costo;
        tdCostoDolaresViejo.innerHTML = elem.costodolar.toFixed(2);
        tdPrecioViejo.innerHTML = elem.precio_venta.toFixed(2);
        tdCodFabrica.innerText = elem.cod_fabrica;

        tr.appendChild(tdCodigo);
        tr.appendChild(tdDescripcion);
        tr.appendChild(tdCostoViejo);
        tr.appendChild(tdCostoDolaresViejo);
        tr.appendChild(tdPrecioViejo);
        tr.appendChild(tdCodFabrica);

        tablaViejo.appendChild(tr);
    }
};

const llenarListaNueva = async(lista)=>{
    productosAGuardar = lista;
    for(let elem of lista){
        const tr = document.createElement('tr');

        const tdCodigo = document.createElement('td');
        const tdDescripcion = document.createElement('td');
        const tdCostoViejo = document.createElement('td');
        const tdCostoDolaresViejo = document.createElement('td');
        const tdPrecioViejo = document.createElement('td');

        tdCodigo.innerHTML = elem._id;
        tdDescripcion.innerHTML = elem.descripcion;
        tdCostoViejo.innerHTML = elem.costo;
        tdCostoDolaresViejo.innerHTML = elem.costodolar;
        tdPrecioViejo.innerHTML = elem.precio_venta.toFixed(2);

        tr.appendChild(tdCodigo);
        tr.appendChild(tdDescripcion);
        tr.appendChild(tdCostoViejo);
        tr.appendChild(tdCostoDolaresViejo);
        tr.appendChild(tdPrecioViejo);

        tablaNuevo.appendChild(tr);
    }
};

async function cambiarPrecioPagliaroli(datos,productos){
    for await(let elem of productos){
        let tasaIva = elem.iva === "R" ? 15 : 26;
        let producto = datos.find(n => n.Código == elem.cod_fabrica);
        if (producto) {
            if (elem.costodolar !== 0) {
                elem.costodolar = parseFloat(redondear(producto.Precio / parseFloat(dolar.value),2));
                elem.impuestos = parseFloat(redondear(elem.costodolar * tasaIva / 100,2));
                const costoIva = (elem.costodolar + elem.impuestos) * parseFloat(dolar.value);
                const utilidad = costoIva * parseFloat(elem.utilidad) / 100;
                elem.precio_venta = parseFloat((Math.round(costoIva + utilidad)).toFixed(2));
                
            }else{
                elem.costo = parseFloat(producto.Precio.toFixed(2));
                elem.impuestos = parseFloat(redondear(elem.costo * tasaIva / 100,2));
                const costoIva  = elem.costo + elem.impuestos;
                const utilidad = costoIva * parseFloat(elem.utilidad) / 100;
                elem.precio_venta = parseFloat((Math.round(costoIva + utilidad)).toFixed(2));
            }
            if (elem._id === "051-006-2") {
                console.log(elem)
            }
        }
    }
    llenarListaNueva(productos);
}

async function cambiarPreciosSanJusto(nuevos,productos) {
    for await (let elem of productos){
        const tasaIva = elem.iva === "R" ? 15 : 26;
        const producto = nuevos.find(n => n.CODIGO == elem.cod_fabrica);
        if (producto) {
            if (elem.costodolar !== 0) {
            }else{
                elem.costo = redondear(producto.PRECIO,2);
                elem.impuestos = parseFloat(redondear(elem.costo * tasaIva / 100,2));
                const costoIva = parseFloat(elem.costo) + parseFloat(elem.impuestos);
                const utilidad = costoIva * parseFloat(elem.utilidad) / 100;

                elem.precio_venta = parseFloat((Math.round(costoIva + utilidad)).toFixed(2));
            }
        }
    }

    llenarListaNueva(productos);
};

async function cambiarPrecioBremen(datos,productos){
    for await (let elem of productos){
        const tasaIva = elem.iva === "R" ? 15 : 26;
        const producto = datos.find(n => n["Código"] == elem.cod_fabrica);
        
        if (producto) {
            if (elem.costodolar !== 0) {
                
            }else{
                elem.costo = redondear(producto["Precio de Venta"],2);
                elem.impuestos = parseFloat(redondear(elem.costo * tasaIva / 100,2));

                const costoIva = parseFloat(elem.costo) + parseFloat(elem.impuestos);
                const utilidad = costoIva * parseFloat(elem.utilidad) / 100;

                elem.precio_venta = costoIva + utilidad;
            }
            
        }
    }
    llenarListaNueva(productos);
};

async function cambiarPrecioInterelec(datos,productos) {
    for await (let elem of productos){
        const tasaIva = elem.iva === "R" ? 15 : 26;
        const producto = datos.find(dato => dato.Codigo == elem.cod_fabrica);
        if (producto) {
            if (elem.costodolar !== 0) {
                elem.costodolar = parseFloat(producto.Precio.toFixed(2));
                elem.impuestos = parseFloat(redondear(elem.costodolar * tasaIva / 100,2));

                const costoIva = (elem.costodolar + elem.impuestos) * parseFloat(dolar.value);
                const utilidad = costoIva * parseFloat(elem.utilidad) / 100;

                elem.precio_venta = parseFloat((costoIva + utilidad).toFixed(2));

            }
        }
    };
    llenarListaNueva(productos);
};

async function cambiarPrecioMB(datos,productos){
    for await (let elem of productos){
        const tasaIva = elem.iva === "R" ? 15 : 26;
        const producto = datos.find(dato = dato.Codigo == elem.cod_fabrica);
        if (producto) {
            console.log(producto)
        }
    }
};

async function cambiarPrecioGomez(datos,productos){
    for await (let elem of productos){
        const tasaIva = elem.iva === "R" ? 15 : 26;
        const producto = datos.find(dato => dato.Articulo == elem.cod_fabrica);
        if(producto){
            if (elem.costodolar !== 0) {
                elem.costodolar = parseFloat((producto.Precio / parseFloat(dolar.value)).toFixed(2));
                elem.impuestos = parseFloat(redondear(elem.costodolar * tasaIva / 100,2));

                const costoIva = (elem.costodolar + elem.impuestos) * parseFloat(dolar.value);
                const utilidad = costoIva * parseFloat(elem.utilidad) / 100;

                elem.precio_venta = Math.round(costoIva + utilidad);
            }else{
                elem.costo = parseFloat(redondear(producto.Precio,2));
                elem.impuestos = parseFloat(redondear(elem.costo * tasaIva / 100,2));

                const costoIva = (elem.costo + elem.impuestos);
                const utilidad = costoIva * parseFloat(elem.utilidad) / 100;
                elem.precio_venta = Math.round(costoIva + utilidad);
            }
        }
    };

    llenarListaNueva(productos);
};

async function cambiarPrecioLanus(datos,productos){
    for await (let elem of productos){
        const tasaIva = elem.iva === "R" ? 15 : 26;
        const producto = datos.find(dato => dato.CODIGO?.trim() == elem.cod_fabrica.trim());

        if(producto){
            producto.PRECIO = (producto.PRECIO.split(',',2)[0]).replace(/\./g, '');
            if(elem.costodolar !== 0){
                elem.costodolar = parseFloat((producto.PRECIO.trim() / parseFloat(dolar.value)).toFixed(2));
                elem.impuestos = parseFloat(redondear(elem.costodolar * tasaIva / 100,2));

                const costoIva = (elem.costodolar + elem.impuestos) * parseFloat(dolar.value);
                const utilidad = costoIva * parseFloat(elem.utilidad) / 100;
                elem.precio_venta = parseFloat((costoIva + utilidad).toFixed(2));
            }else{
                elem.costo = parseFloat((producto.PRECIO.trim()));
                elem.impuestos = parseFloat(redondear(elem.costo * tasaIva / 100,2));

                const costoIva = (elem.costo + elem.impuestos);
                const utilidad = costoIva * parseFloat(elem.utilidad) / 100;

                elem.precio_venta = parseFloat((costoIva + utilidad).toFixed(2));
            };
        }
    };
    llenarListaNueva(productos);
};



confirmar.addEventListener('click',async e=>{
    for await (let producto of productosAGuardar){
        await axios.put(`${URL}productos/${producto._id}`,producto,configAxios);
    };
    await sweet.fire({
        title:"Productos Modificados",
        icon:"success"
    });
    window.close();
});