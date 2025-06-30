const parsearNumero = (e, importe) => {
    ultimaTecla = e.key;
    let bandera = '';
    if(ultimaTecla === '.'){
      importe.value = importe.value.slice(0,-1);
      importe.value = importe.value + ','
      bandera = ','
    };

    const separador = importe.value.split(',');
    let parteEntera = separador[0].replace(/\./g, '') ?? '0';
    let parteDecimal = separador[1] ?? '';
    parteEntera = parteEntera.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    
    return parteDecimal ? parteEntera + ',' + parteDecimal : parteEntera + bandera;

};

const formater = (value) => {
    const separador = value.split('.');
    let parteEntera = separador[0].replace(/\./g, '') ?? '0';
    let parteDecimal = separador[1] ?? '';
    console.log(parteDecimal);
    parteEntera = parteEntera.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return parteDecimal ? parteEntera + ',' + parteDecimal : parteEntera;
}

module.exports = {
    parsearNumero,
    formater
}