import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { activarPublicacion } from '../../store/publicacones';

const gananciaML = 10;
const porcentajeDescuentoML = 0.65;
const envio = 30000;
const primerCostoFijo = 12000;
const segundoCostoFijo = 30000;
const valorPrimerCostoFijo = 900;
const valorSegundoCostoFijo = 1800;

export const PublicacionItem = ({index, _id, codigoML, descripcion, precioML, stockML, costo, costodolar, impuesto}) => {
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
        let utilidad = costoFinal + (costoFinal * gananciaML / 100);
        let descuentoML = (utilidad / porcentajeDescuentoML);

       

        let costoEnvio = 0;
        let costoFijo = 0;

        //Vemos cuanto nos cobran del envio en mercado libre dependiendo de la utilidad
        if (descuentoML > envio){
            costoEnvio = 0;
        }else{
            if (descuentoML < 16000){
                costoEnvio = 0;
            }else if(descuentoML < 37000){
                costoEnvio = 9611.99;
            }else{
                costoEnvio = 4805.99;
            }
        };

         //Vemos cuanto nos descuentan por el costo fijo dependiendo de el valor de la utilidad
         if (descuentoML < primerCostoFijo){
            costoFijo = valorPrimerCostoFijo;
         }else if(descuentoML < segundoCostoFijo){
            costoFijo = valorSegundoCostoFijo
         }else{
            costoFijo = 0;
         };

         let precioML = 0;
        //    if (codigoML === 'MLA1985386570'){
        //     console.log(costoFinal)
        //     console.log(utilidad)
        //     console.log(porcentajeDescuentoML)
        //      console.log(descuentoML)
        //      console.log(costoEnvio)
        //      console.log(costoFijo)
        //  }
        
         precioML = descuentoML + costoEnvio + costoFijo
         return precioML.toFixed(2);
    }
    
  return (
    <tr id={codigoML} className={`${active.codigoML === codigoML ? 'bg-cyan-300' : 'hover:bg-gray-400' } hover:cursor-pointer` } onClick={activar}>
        <td className='border border-black'>{index + 1}</td>
        <td className='border border-black'>{codigoML}</td>
        <td className='border border-black'>{descripcion}</td>
        <td className='border border-black'>{costodolar !== 0 ? ((costodolar + impuesto) * dolar).toFixed(2) : (costo + impuesto).toFixed(2)}</td>
        <td className='border border-black'>{calcularPrecioSujerido()}</td>
        <td className='border border-black'>{precioML.toFixed(2)}</td>
        <td className='border border-black'>{stockML.toFixed(2)}</td>
    </tr>
  )
}
