const axios = require('axios')
require('dotenv').config();
const URL = process.env.URL;

const desde = document.getElementById('desde');
const hasta = document.getElementById('hasta');

window.addEventListener('load',async e=>{
    const fecha = new Date();
    let month = fecha.getMonth() + 1;
    let year = fecha.getFullYear();
    month = month === 13 ? 1 : month;
    month = month<10 ? `0${month}` : month;

    desde.value = `${year}-${month}`;
    hasta.value = `${year}-${month}`;

    const dats = (await axios.get(`${URL}dat_comp/fechaImp/${desde.value}/${hasta.value}`)).data;
    console.log(dats)
});



document.addEventListener('keydown',e=>{
    if(e.keyCode === 27){
        location.href = '../index.html'
    }
});