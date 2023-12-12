const axios = require("axios");

const { cerrarVentana, configAxios } = require("../funciones");
require("dotenv").config;
const URL = process.env.URL;

const desde = document.querySelector('#desde');
const hasta = document.querySelector('#hasta');
const select = document.querySelector('#rubros');
const total = document.querySelector('#total');


let date = new Date();
let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();


month = month === 13 ? 1 : month;
day = day < 10 ? `0${day}` : day;
month = month < 10 ? `0${month}` : month;

window.addEventListener('load',async e=>{
    cerrarVentana();

    const rubros = (await axios.get(`${URL}rubros`,configAxios)).data;
    listarRubros(rubros);
    desde.value = `${year}-${month}-${"01"}`;
    hasta.value = `${year}-${month}-${day}`;
    
    const movimientos = (await axios.get(`${URL}movProductos/${desde.value}/${hasta.value}/${select.value}`,configAxios)).data;
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

const listarMovimientos = async(lista)=>{
    let dias = [];

    let uno = 0;
    let dos = 0;
    let tres = 0;
    let cuatro = 0;
    let cinco = 0;
    let seis = 0;
    let siete = 0;
    let ocho = 0;
    

    for await(let elem of lista){
        console.log(elem.fecha.slice(8,10))
        if (elem.fecha.slice(8,10) === "01") {
            uno += Math.round(elem.total);
        }
        if (elem.fecha.slice(8,10) === "02") {
            dos += Math.round(elem.total);
        }
        if (elem.fecha.slice(8,10) === "03") {
            tres += Math.round(elem.total);
        }
        if (elem.fecha.slice(8,10) === "04") {
            cuatro += Math.round(elem.total);
        }
        if (elem.fecha.slice(8,10) === "05") {
            cinco += Math.round(elem.total);
        }
        if (elem.fecha.slice(8,10) === "06") {
            seis += Math.round(elem.total);
        }
        if (elem.fecha.slice(8,10) === "07") {
            siete += Math.round(elem.total);
        }
        if (elem.fecha.slice(8,10) === "08") {
            ocho += Math.round(elem.total);
        }
    }

    dias.push({dia:"01",valor:uno})
    dias.push({dia:"02",valor:dos})
    dias.push({dia:"03",valor:tres})
    dias.push({dia:"04",valor:cuatro})
    dias.push({dia:"05",valor:cinco})
    dias.push({dia:"06",valor:seis})
    dias.push({dia:"07",valor:siete})
    dias.push({dia:"08",valor:ocho})

    body.appendChild(probarD3(dias));
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


function probarD3(mesesDelAno){

    console.log(mesesDelAno)
      {
        // Declare the chart dimensions and margins.
        const width = 1000;
        const height = 1000;
        const marginTop = 150;
        const marginRight = 20;
        const marginBottom = 40;
        const marginLeft = 140;
      
        // Declare the x (horizontal position) scale.
        const x = d3.scaleBand()
            .domain(mesesDelAno.map(d => d.dia))
            .range([marginLeft, width - marginRight])
            .padding(0.1);
      
        // Declare the y (vertical position) scale.
        const y = d3.scaleLinear()
            .domain([0,d3.max(mesesDelAno,d=>d.valor)])
            .range([height - marginBottom, marginTop]);
      
        // Create the SVG container.
        const svg = d3.create("svg")
            .attr("width", width)
            .attr("height", height);

      console.log(y.length)
        // Add the x-axis.
        svg.append("g")
            .attr("transform", "translate(0," + (height + marginTop) + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .style("text-anchor", "end")
            .style("font-size", "15px")

        // Agregar barras al gráfico
        svg.selectAll("rect")
        .data(mesesDelAno)
        .enter()
        .append("rect")
        .attr("x", d => x(d.dia))
        .attr("y", d => y(d.valor) - marginBottom)
        .attr("width", x.bandwidth())
        .attr("height", d => y(d.valor) + 0)
        .attr("fill", "steelblue")
        .attr("stroke", "black")
        
        console.log(d3.axisLeft(y))
        // Add the y-axis.
        svg.append("g")
            .attr("transform", `translate(${marginLeft},0)`)
            .call(d3.axisLeft(y))
            .selectAll("text")
            .style("text-anchor", "end")
            .style("font-size", "12px")
      
        // Return the SVG element.
        return svg.node();
      }
    
}


const body = document.querySelector('.datos');
