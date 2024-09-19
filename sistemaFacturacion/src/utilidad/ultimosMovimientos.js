require('dotenv').config();
const URL = process.env.URL;
const axios = require('axios');

const desde = document.getElementById('desde');
const hasta = document.getElementById('hasta');

const getMovs = async() => {

};

window.addEventListener('load',async e=>{
    desde.value = new Date().toISOString().slice(0, 10);
    hasta.value = new Date().toISOString().slice(0, 10);
    desde.focus();

    await axios.get(`${URL}`);
});

desde.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        hasta.focus();
    }
});

hasta.addEventListener('keypress',e=>{
    if (e.keyCode === 13) {
        getMovs();
    }
});