const axios = require("axios");

const { cerrarVentana } = require("../funciones");
require("dotenv").config;
const URL = process.env.URL;

const desde = document.querySelector('#desde');
const hasta = document.querySelector('#hasta');
const select = document.querySelector('#rubros');
const total = document.querySelector('#total');

const tbody = document.querySelector('tbody');

let date = new Date();
let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();


month = month === 13 ? 1 : month;
day = day < 10 ? `0${day}` : day;
month = month < 10 ? `0${month}` : month;

window.addEventListener('load',async e=>{
    cerrarVentana();

    const rubros = (await axios.get(`${URL}rubros`)).data;
    listarRubros(rubros);
    desde.value = `${year}-${month}-${day}`;
    hasta.value = `${year}-${month}-${day}`;
    
    const movimientos = (await axios.get(`${URL}movProductos/${desde.value}/${hasta.value}/${select.value}`)).data;
    const movimientosSinPP = movimientos.filter(movimiento => movimiento.tipo_pago !== "PP")
    listarMovimientos(movimientosSinPP);
});

desde.addEventListener('keydown',e=>{
    if (e.keyCode === 13) {
        hasta.focus();
    }
});

select.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        e.preventDefault();
        desde.focus();
    }
})

const listarRubros = (lista)=>{
    for(let elem of lista){
        const option = document.createElement('option');
        option.value = elem.codigo
        option.text = elem.codigo + " - " + elem.nombre;
        select.append(option)
    }
};

const listarMovimientos = (lista)=>{
    tbody.innerHTML = "";
};

hasta.addEventListener('keypress',async e=>{
    if (e.keyCode === 13) {
        let nextDay = new Date(hasta.value);
        let hoy = (parseInt(hasta.value.split('-',3)[2]));
        nextDay.setDate(hoy + 1);
        const movimientos = (await axios.get(`${URL}movProductos/${desde.value}/${nextDay}/${select.value}`)).data;
        const movimientosSinPP = movimientos.filter(movimiento => movimiento.tipo_pago !== "PP")
        listarMovimientos(movimientosSinPP);
    }
});


function probarD3(){
    const mesesDelAno = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
      ];

    {
        // Declare the chart dimensions and margins.
        const width = 1100;
        const height = 400;
              
        //Creamos el contenedro de svg
        const svg = d3.create("svg")
            .attr("width", width)
            .attr("height", height);


        //Decalramos el eje x
        const x = d3.scaleUtc()
            .domain([new Date("2023-01-01"), new Date("2023-12-31")])
            .range([marginLeft, width - marginRight]);
    

        //Agremaos el ele x
        svg.append("g")
            .attr("transform", `translate(0,${height - marginBottom})`)
            .call(d3.axisBottom(x));
        // Return the SVG element.
        return svg.node();
      }
    
}
const body = document.querySelector('.datos');
body.appendChild(probarD3());