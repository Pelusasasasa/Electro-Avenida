import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { activarPublicacion } from '../../store/publicacones';

const gananciaML = 10;

export const PublicacionItem = ({codigoML, codProd, costo, costodolar,descripcion, _id, impuesto, index, utilidad,  precioML, stock, stockML, tipoVenta, unidadPack}) => {
    const { dolar } = useSelector(state => state.variables);
    const { active } = useSelector(state => state.publicaciones);
    const dispatch = useDispatch();

    const activar = (e) => {
        let id = '';

        if (e.target.nodeName === 'TD'){
            id = e.target.parentNode.id;
        }else{
            id = e.target.id;
        };

        dispatch( activarPublicacion(id) );
    };

    const calcularPrecioSujerido = () => {
        const costoFinal = costodolar !== 0 ? (costodolar + impuesto) * dolar  :  costo + impuesto;
        let ganancia = costoFinal + (costoFinal * gananciaML / 100);
        let utilidadPlus = ganancia + (ganancia * utilidad / 100);
        utilidadPlus = tipoVenta === 'UNIDAD' ? utilidadPlus : utilidadPlus * unidadPack;

        //Variables para el calculo
        const comisionPorcentual = 13.5 / 100; //13.5%
        const adicionalPorcentual = 8 / 100; //3%
        const costoEnvio = 4805.99;

        //Rango Inicial para calcular el preico publicado
        let precioPublicado = utilidadPlus;

        while(true){

            //Determinacion del costo fijo segun el rango de preico
            let costoFijo = 0;

            if (precioPublicado < 12000){
                costoFijo = 900;
            }else if( precioPublicado <= 30000){
                costoFijo = 1800;
            };

            // Si el precio es mayor a 30,000, se suma el costo del envío
            const aplicaEnvioGratis = precioPublicado > 30000;
            const costoEnvioFinal = aplicaEnvioGratis ? costoEnvio : 0;

            // Cálculo de la comisión porcentual y adicional
            const comision = precioPublicado * comisionPorcentual;
            const adicional = precioPublicado * adicionalPorcentual;

            // Cálculo del costo total
            const costoTotal = comision + adicional + costoFijo + costoEnvioFinal;

            // Calcular el monto recibido con el precio actual
            const montoRecibido = precioPublicado - costoTotal;

            // Si el monto recibido está cerca del monto deseado, terminamos
            if (Math.abs(montoRecibido - utilidadPlus) < 0.01) {
                break;
            }

            // Ajustar el precio publicado
            precioPublicado += (utilidadPlus - montoRecibido) / 2;   
        }

        // Resultado detallado
        return precioPublicado.toFixed(2);
    };
    
  return (
    <tr id={codigoML} className={`${active.codigoML === codigoML ? 'bg-cyan-300' : tipoVenta === 'UNIDAD' ? 'hover:bg-gray-300' : 'bg-green-200' }  hover:cursor-pointer` } onClick={activar}>
        <td className='border border-black'>{index + 1}</td>
        <td className='border border-black'>{codigoML}</td>
        <td className='border border-black text-center'>{codProd}</td>
        <td className='border border-black'>{descripcion}</td>
        <td className='border border-black'>{costodolar !== 0 ? ((costodolar + impuesto) * dolar).toFixed(2) : (costo + impuesto).toFixed(2)}</td>
        <td className='border border-black'>{utilidad}</td>
        <td className='border border-black'>{calcularPrecioSujerido()}</td>
        <td className='border border-black'>{Math.floor(stock / unidadPack).toFixed(2)}</td>
        <td className={`border border-black ${calcularPrecioSujerido() > precioML ? 'bg-red-500' : '' }`}>{precioML.toFixed(2)}</td>
        <td className={`border border-black ${Math.floor(stock / unidadPack) < stockML ? 'bg-red-500' : ''}`}>{stockML.toFixed(2)}</td>
    </tr>
  )
}
