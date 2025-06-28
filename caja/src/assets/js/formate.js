const Formatter = (valor) => {
     // Primero, limpiamos el valor (eliminamos todo excepto números y punto)
    const valorLimpio = valor.replace(/[^\d.]/g, '');
    console.log(valorLimpio)
    // Separamos parte entera y decimal
    const partes = valorLimpio.split('.');
    let parteEntera = partes[0] || '0';
    let parteDecimal = partes[1] || '';

    console.log(parteEntera)
    console.log(parteDecimal)

    // Formateamos parte entera con puntos cada 3 dígitos
    parteEntera = parteEntera.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    console.log(parteEntera)


    // Unimos parte entera y decimal con coma
    return (parteDecimal || valorLimpio.includes('.')) ? `${parteEntera},${parteDecimal}` : parteEntera;
};

module.exports = Formatter