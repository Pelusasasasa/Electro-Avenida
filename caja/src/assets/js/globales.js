const { clipboard } = require("electron");

const alerta = async(mensaje)=>{
    await sweet.fire({
        title:mensaje,
        returnFocus:false
    })
};


const copiar = (elem)=>{
    document.addEventListener('keydown',e=>{
        if (e.keyCode === 17) {
            document.addEventListener('keydown',event=>{
                if (event.keyCode === 67) {
                    const texto = document.querySelector('.subSeleccionado');
                    clipboard.writeText(texto.innerHTML)
                }
            })
        }
    })
}

const redondear = (numero,decimales)=>{
    const signo = numero >= 0 ? 1 : -1;
    return(parseFloat(Math.round((numero * Math.pow(10,decimales)) + (signo * 0.0001)) / Math.pow(10,decimales)).toFixed(decimales));
}

const cerrarVentana = ()=>{
    document.addEventListener('keyup',e=>{
        if (e.keyCode === 27) {
            window.close();
        }
    });
}

const recorrerFlechas =  async(code) => {
    if (code === 40 && seleccionado.nextElementSibling) {
        let aux = 0;
        let i = 0;
        const tds = document.querySelectorAll('.seleccionado td');
        
        for(let td of tds){
            if (td.classList.contains('subSeleccionado')) {
                aux=i;
            }
            i++;
        }


        seleccionado && seleccionado.classList.remove('seleccionado');
        seleccionado = seleccionado.nextElementSibling;
        seleccionado.classList.add('seleccionado');

        subSeleccionado && subSeleccionado.classList.remove('subSeleccionado');
        subSeleccionado = seleccionado.children[aux];
        subSeleccionado.classList.add('subSeleccionado');


    }else if(code === 38 && seleccionado.previousElementSibling){
        let aux = 0;
        let i = 0;
        const tds = document.querySelectorAll('.seleccionado td');
        
        for(let td of tds){
            if (td.classList.contains('subSeleccionado')) {
                aux=i;
            }
            i++;
        }

        seleccionado && seleccionado.classList.remove('seleccionado');
        seleccionado = seleccionado.previousElementSibling;
        seleccionado.classList.add('seleccionado');

        subSeleccionado && subSeleccionado.classList.remove('subSeleccionado');
        subSeleccionado = seleccionado.children[aux];
        subSeleccionado.classList.add('subSeleccionado');
    }else if(code === 37 && subSeleccionado.previousElementSibling){
        
        subSeleccionado && subSeleccionado.classList.remove('subSeleccionado');
        subSeleccionado = subSeleccionado.previousElementSibling;
        subSeleccionado.classList.add('subSeleccionado');

    }else if(code === 39 && subSeleccionado.nextElementSibling){

        subSeleccionado && subSeleccionado.classList.remove('subSeleccionado');
        subSeleccionado = subSeleccionado.nextElementSibling;
        subSeleccionado.classList.add('subSeleccionado');
    }

    subSeleccionado && subSeleccionado.scrollIntoView({
        inline:"center",
        block:"center"
    })
};

module.exports = {alerta,cerrarVentana,copiar,redondear}