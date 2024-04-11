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
            title: "La columna de codigo de fabrica tiene que llamarse CODIGO y la de costo Precio en el EXCEL y el libro se tiene que llamar Lista",
            returnFocus:false
        });
    }if(select.value === "CANDIL"){
        await sweet.fire({
            title: "La hoja se debe llamar Lista, y la columca con el costo se tiene que llamar Precio (las tira ed el precio esta por 5 metros en el excel)",
            returnFocus:false
        });
    }else if(select.value === "BREMEN"){
        await sweet.fire({
            title: "La columna de codigo de fabrica tiene que llamarse Código y la de costo PRECIO en el EXCEL Y tambien pasar la fila de idenficaciones como el primer renglon",
            returnFocus:false
        });
    }else if(select.value === "INTERELEC"){
        await sweet.fire({
            title: "Cambiar el nombre de la hoja 1 a Lista",
            returnFocus:false
        });
    }else if(select.value === "MB"){
        await sweet.fire({
            title:"Borrar la prime fila dejando como primera la fila de Codigo y Precio(precio final en pesos) y tambien poner el nombre de la hoja como Lista",
            returnFocus:false
        })
    }
    dolar.focus();
});

const rellenarStock = async(lista,lista2)=>{
    for await(let elem of lista){
        if (elem === "SAN JUSTO" || elem === "BREMEN" || elem === "INTERELEC" || elem === "CANDIL" || elem === "MB" || elem === "SPOTSLINE" || elem === "ELECE" || elem === "JELUZ" || elem === "FERROLUX") {
            const option = document.createElement('option');
            option.value = elem;
            option.text = "M - " + elem;
            select.appendChild(option);
        }
    };

    for await(let elem of lista2){
        if (elem === "GOMEZ" || elem === "LANUS" || elem === "PAGLIAROLI" || elem === "HAEDO" || elem === "FGP" || elem === "CENTILUX") {
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
        await llenarLista(productos);
        if (select.value === "SAN JUSTO") {
            let datos = XLSX.utils.sheet_to_json(woorbook.Sheets["Lista"]);
            cambiarPreciosSanJusto(datos,productos);
        }else if(select.value === "CANDIL"){
            let datos = XLSX.utils.sheet_to_json(woorbook.Sheets["Lista"]);
            cambiarPrecioCandil(datos, productos);
        }else if(select.value === "BREMEN"){
            let datos = XLSX.utils.sheet_to_json(woorbook.Sheets["Lista"]);
            cambiarPrecioBremen(datos,productos);
        }else if(select.value === "INTERELEC"){
            let datos = XLSX.utils.sheet_to_json(woorbook.Sheets["Lista"]);
            cambiarPrecioInterelec(datos,productos);
        }else if(select.value === "MB"){
            let datos = XLSX.utils.sheet_to_json(woorbook.Sheets["Lista"]);
            cambiarPrecioMB(datos,productos);
        }else if(select.value === "GOMEZ"){
            let datos = XLSX.utils.sheet_to_json(woorbook.Sheets["Hoja1"]);
            console.log(datos)
            cambiarPrecioGomez(datos,productos);
        }else if(select.value === "LANUS"){
            let datos = XLSX.utils.sheet_to_json(woorbook.Sheets["Lista"]);
            cambiarPrecioLanus(datos,productos);
        }else if(select.value === "PAGLIAROLI"){
            let datos = XLSX.utils.sheet_to_json(woorbook.Sheets["Lista"]);
            cambiarPrecioPagliaroli(datos,productos);
        }else if(select.value === "HAEDO"){
            let datos = XLSX.utils.sheet_to_json(woorbook.Sheets["Lista"]);
            cambiarPrecioHaedo(datos,productos);
        }else if(select.value === "FGP"){
            let datos = XLSX.utils.sheet_to_json(woorbook.Sheets["Lista"]);
            cambiarPrecioFGP(datos,productos);
        }else if(select.value === "CENTILUX"){
            let datos = XLSX.utils.sheet_to_json(woorbook.Sheets["Lista"]);
            cambiarPrecioCentilux(datos,productos);
        }else if(select.value === "SPOTSLINE"){
            let datos = XLSX.utils.sheet_to_json(woorbook.Sheets["Lista"]);
            cambiarPrecioSpotSline(datos,productos);
        }else if(select.value === "ELECE"){
            let datos = XLSX.utils.sheet_to_json(woorbook.Sheets["Lista"]);
            cambiarPrecioElece(datos,productos);
        }else if(select.value === "FERROLUX"){
            let datos = XLSX.utils.sheet_to_json(woorbook.Sheets["Lista"]);
            console.log(datos)
            cambiarPrecioFerrolux(datos,productos);
        }else if(select.value === "JELUZ"){
            let datos = XLSX.utils.sheet_to_json(woorbook.Sheets["Lista"]);
            console.log(datos)
            cambiarPrecioJeluz(datos,productos);
        };
        
    }
    fileReader.readAsBinaryString(selectedFile);
});

const llenarLista = async(lista)=>{

    lista.sort((a,b) => { 
        if (a.descripcion > b.descripcion) {
            return 1
        }else if(a.descripcion < b.descripcion){
            return -1
        }
        return 0
    }) 

    for(let elem of lista){
        const tr = document.createElement('tr');
        tr.id = elem._id;
        tr.id === "195-021" && console.log(tr)

        const tdCodigo = document.createElement('td');
        const tdDescripcion = document.createElement('td');
        const tdCostoViejo = document.createElement('td');
        const tdCostoDolaresViejo = document.createElement('td');
        const tdPrecioViejo = document.createElement('td');

        tdCodigo.innerHTML = elem._id;
        tdDescripcion.innerHTML = elem.descripcion;
        tdCostoViejo.innerHTML = elem.costo;
        tdCostoDolaresViejo.innerHTML = elem.costodolar?.toFixed(2);
        tdPrecioViejo.innerHTML = elem.precio_venta.toFixed(2);

        tr.appendChild(tdCodigo);
        tr.appendChild(tdDescripcion);
        tr.appendChild(tdCostoViejo);
        tr.appendChild(tdCostoDolaresViejo);
        tr.appendChild(tdPrecioViejo);

        tablaViejo.appendChild(tr);
    }
};

const llenarListaNueva = async(lista)=>{
    productosAGuardar = lista;
    const trs = document.querySelector('.tablaViejo tbody');
    for(let elem of lista){
        const tr = document.getElementById(`${elem._id}`);
        if (tr) {
            const tdCostoNuevo = document.createElement('td');
            const tdCostoDolaresNuevo = document.createElement('td');
            const tdPrecioNuevo = document.createElement('td');
            const tdPorcentaje = document.createElement('td');
            const tdCodigoFabrica = document.createElement('td');

            tdCostoNuevo.innerText = elem.costo;
            tdCostoDolaresNuevo.innerText = elem.costodolar;
            tdPrecioNuevo.innerText = elem.precio_venta.toFixed(2);

            tdPorcentaje.innerText = parseFloat(tr.children[4].innerText)  !== 0 ? ((elem.precio_venta - parseFloat(tr.children[4].innerText)) / parseFloat(tr.children[4].innerText) * 100).toFixed(2) + "%" : "0.00%";
            tdCodigoFabrica.innerText = elem.cod_fabrica;

            tr.appendChild(tdCostoNuevo);
            tr.appendChild(tdCostoDolaresNuevo);
            tr.appendChild(tdPrecioNuevo);
            tr.appendChild(tdPorcentaje);
            tr.appendChild(tdCodigoFabrica);
        }

    }
};

async function cambiarPrecioJeluz(datos,productos) {
    console.log(datos[0])
    for await(let elem of productos){
        let tasaIva = elem.iva === "R" ? 15 : 26;
        let producto = datos.find(n => n.Codigo == elem.cod_fabrica);
        if (producto) {
            if(elem.costodolar !== 0){
                elem.costodolar = parseFloat(redondear(producto.Precio / parseFloat(dolar.value), 2));
                elem.impuestos = parseFloat(redondear(elem.costodolar * tasaIva / 100, 2));
                const costoIva = (elem.costodolar + elem.impuestos) * parseFloat(dolar.value);
                const utilidad = costoIva * parseFloat(elem.utilidad) / 100;
                elem.precio_venta = parseFloat((Math.round(costoIva + utilidad)).toFixed(2));
            }else{
                elem.costo = parseFloat(producto.Precio.toFixed(2));
                elem.impuestos = parseFloat(redondear(elem.costo * tasaIva / 100, 2));
                const costoIva  = elem.costo + elem.impuestos;
                const utilidad = costoIva * parseFloat(elem.utilidad) / 100;
                elem.precio_venta = parseFloat((Math.round(costoIva + utilidad)).toFixed(2));
            }
        }
    }
    llenarListaNueva(productos);
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
        }
    }
    llenarListaNueva(productos);
};

async function cambiarPrecioCandil(datos,productos) {
    for await(let elem of productos){
        let tasaIva = elem.iva === "R" ? 15 : 26;
        let producto = datos.find(n => n.Id == elem.cod_fabrica);
        if (producto) {
            if (elem.costodolar !== 0) {
                elem.costodolar = parseFloat(redondear(producto.Precio / parseFloat(dolar.value), 2));
                elem.impuestos = parseFloat(redondear(elem.costodolar * tasaIva / 100, 2));

                const costoIva = parseFloat(redondear(elem.costodolar + elem.impuestos) * parseFloat(dolar.value),2);
                const utilidad = costoIva * parseFloat(elem.utilidad) / 100;
                elem.precio_venta = parseFloat((Math.round(costoIva + utilidad)).toFixed(2));
            }else{
                elem.costo = parseFloat(producto.Precio.toFixed(2));
                elem.impuestos = parseFloat(redondear(elem.costo * tasaIva / 100, 2));
                const costoIva  = elem.costo + elem.impuestos;
                const utilidad = costoIva * parseFloat(elem.utilidad) / 100;
                elem.precio_venta = parseFloat((Math.round(costoIva + utilidad)).toFixed(2));
            }
        }
    };
    llenarListaNueva(productos);
};

async function cambiarPrecioFerrolux(datos,productos){
    for await(let elem of productos){
        let tasaIva = elem.iva === "R" ? 15 : 26;
        let producto = datos.find(n => n.Codigo == elem.cod_fabrica);
        if(producto){
            if (elem.costodolar !== 0) {
                
            }else{
                elem.costo = parseFloat(producto.Precio.toFixed(2));
                elem.impuestos = parseFloat(redondear(elem.costo * tasaIva / 100, 2));
                const costoIva  = elem.costo + elem.impuestos;
                const utilidad = costoIva * parseFloat(elem.utilidad) / 100;
                elem.precio_venta = parseFloat((Math.round(costoIva + utilidad)).toFixed(2));
            };
        }
    };
    llenarListaNueva(productos);
};

async function cambiarPrecioHaedo(datos,productos){
    for await(let elem of productos){
        const producto = datos.find(dato => dato.Artículo == elem.cod_fabrica);
        const tasaIva = elem.iva === "R" ? 15 : 26;
        if (producto) {
            if (elem.costodolar !== 0) {
                if (producto.Mon === "$") {
                    elem.costodolar = parseFloat(redondear(producto.Precio / parseFloat(dolar.value),2));
                }else{
                    elem.costodolar = parseFloat(redondear(producto.Precio,2));
                }
                elem.impuestos = parseFloat(redondear(elem.costodolar * tasaIva / 100,2));

                const costoIva = parseFloat(redondear((elem.costodolar + elem.impuestos) * parseFloat(dolar.value),2));
                const utilidad = parseFloat(redondear((costoIva * elem.utilidad / 100),2));
                elem.precio_venta = Math.round(costoIva + utilidad);
            }else{
                elem.costo = parseFloat(producto.Precio.toFixed(2));
                elem.impuestos = parseFloat(redondear(elem.costo * tasaIva / 100,2));

                const costoIva = parseFloat((elem.costo + elem.impuestos).toFixed(2));
                const utilidad = parseFloat((costoIva * elem.utilidad / 100).toFixed(2));
                elem.precio_venta = Math.round(costoIva + utilidad);

            }
        }
    };

    llenarListaNueva(productos)
}

async function cambiarPreciosSanJusto(nuevos,productos) {
    for await (let elem of productos){
        const tasaIva = elem.iva === "R" ? 15 : 26;
        const producto = nuevos.find(n => n.CODIGO == elem.cod_fabrica);
        if (producto) {
            console.log(producto)
            if (elem.costodolar !== 0) {
            }else{
                elem.costo = redondear(producto.Precio  ,2);
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
                elem.costo = redondear(producto.Precio,2);
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
    console.log(datos)
    for await (let elem of productos){
        const tasaIva = elem.iva === "R" ? 15 : 26;
        const producto = datos.find(dato => dato.Código == elem.cod_fabrica);
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
        const producto = datos.find(dato => dato.Codigo == elem.cod_fabrica);
        if (producto) {
            if(elem.costodolar !== 0){
                elem.costodolar = parseFloat(producto.Precio.toFixed(2));
                elem.impuestos = parseFloat(redondear(elem.costodolar * tasaIva / 100,2));

                const costoIva = (elem.costodolar + elem.impuestos) * parseFloat(dolar.value);
                const utilidad = costoIva * parseFloat(elem.utilidad) / 100;

                elem.precio_venta = Math.round(costoIva + utilidad);
            }else{
                elem.costo = parseFloat(producto.Precio.toFixed(2));
                elem.impuestos = parseFloat(redondear(elem.costo * tasaIva / 100,2));

                const costoIva = (elem.costo + elem.impuestos);
                const utilidad = costoIva * parseFloat(elem.utilidad) / 100;

                elem.precio_venta = Math.round(costoIva + utilidad);
            }
        }
    }
    llenarListaNueva(productos);
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
            if (producto.CODIGO === " 722010") {
                console.log(producto)
            }
            // producto.Precio = (producto.Precio.split(',',2)[0]).replace(/\./g, '');
            if(elem.costodolar !== 0){
                elem.costodolar = parseFloat((producto.Precio / parseFloat(dolar.value)).toFixed(2));
                console.log(elem.costodolar)
                elem.impuestos = parseFloat(redondear(elem.costodolar * tasaIva / 100,2));

                const costoIva = (elem.costodolar + elem.impuestos) * parseFloat(dolar.value);
                const utilidad = costoIva * parseFloat(elem.utilidad) / 100;
                elem.precio_venta = parseFloat((costoIva + utilidad).toFixed(2));
            }else{
                elem.costo = parseFloat((producto.Precio));
                elem.impuestos = parseFloat(redondear(elem.costo * tasaIva / 100,2));

                const costoIva = (elem.costo + elem.impuestos);
                const utilidad = costoIva * parseFloat(elem.utilidad) / 100;

                elem.precio_venta = parseFloat((costoIva + utilidad).toFixed(2));
            };
        }
    };
    llenarListaNueva(productos);
};

async function cambiarPrecioFGP(datos,productos) {
    
    for(let elem of productos){
        const producto = datos.find(n => n.Codigo == elem.cod_fabrica);
        if (producto) {
            const tasaIva = elem.iva === "R" ? 15 : 26;

            if(elem.costodolar !== 0){
                elem.costodolar = parseFloat(producto.Precio.toFixed(2));
                elem.impuestos = parseFloat(redondear(elem.costodolar * tasaIva / 100,2));

                const costoIva = (elem.costodolar + elem.impuestos) * parseFloat(dolar.value);
                const utilidad = costoIva * parseFloat(elem.utilidad) / 100;

                elem.precio_venta = Math.round(costoIva + utilidad);
            }else{

                elem.costo = parseFloat(producto.Precio.toFixed(2));
                elem.impuestos = parseFloat(redondear(elem.costo * tasaIva / 100,2));

                const costoIva = (elem.costo + elem.impuestos);
                const utilidad = costoIva * parseFloat(elem.utilidad) / 100;

                elem.precio_venta = Math.round(costoIva + utilidad);
            };

        }
    };
    llenarListaNueva(productos);
};

async function cambiarPrecioCentilux(datos,productos){
    console.log(datos)
    for(let elem of productos){
        const producto = datos.find(n => n.Código == elem.cod_fabrica);
        const tasaIva = elem.iva === "R" ? 15 : 26;

        if (producto) {
            if (producto.Código == "905") {
                console.log(producto)
            }
    
            if (elem.costodolar !== 0) {
                
            }else{
                elem.costo = parseFloat(producto.Precio.toFixed(2));
                elem.impuestos = parseFloat(redondear(elem.costo * tasaIva / 100,2));

                const costoIva = (elem.costo + elem.impuestos);
                const utilidad = costoIva * parseFloat(elem.utilidad) / 100;

                elem.precio_venta = Math.round(costoIva + utilidad);
            }
        }
    }
    llenarListaNueva(productos)
};

async function cambiarPrecioSpotSline(datos,productos) {
    for(let elem of productos){
        const producto = datos.find(n => n.Codigo == elem.cod_fabrica);
        const tasaIva = elem.iva === "R" ? 15 : 26;
        if (producto) {
            if (elem.costodolar !== 0) {
                
            }else{
                elem.costo = parseFloat(producto.Precio.toFixed(2));
                elem.impuestos = parseFloat(redondear(elem.costo * tasaIva / 100,2));
                
                const costoIva = (elem.costo + elem.impuestos);
                const utilidad = costoIva * parseFloat(elem.utilidad) / 100;

                elem.precio_venta = Math.round(costoIva + utilidad);
            };
        }
    };
    llenarListaNueva(productos);
};

async function cambiarPrecioElece(datos,productos){
    for(let elem of productos){
        let producto = datos.find(n => n.Codigo == elem.cod_fabrica);
        if (producto) {
            const tasaIva = elem.iva === "R" ? 15 : 26;
            if (elem.costodolar !== 0) {

            }else{

                elem.costo = parseFloat(producto.Precio.toFixed(2));
                elem.impuestos = parseFloat(redondear(elem.costo * tasaIva / 100,2));

                const costoIva = (elem.costo + elem.impuestos);
                const utilidad = costoIva * parseFloat(elem.utilidad) / 100;

                elem.precio_venta = Math.round(costoIva + utilidad);

            }
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