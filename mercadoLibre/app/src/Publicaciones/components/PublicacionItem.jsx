import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { activarPublicacion } from '../../store/publicacones';

export const PublicacionItem = ({index, _id, codigoML, descripcion, precioML, stockML,}) => {
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
    
  return (
    <tr id={codigoML} className={`${active.codigoML === codigoML ? 'bg-cyan-300' : 'hover:bg-gray-400' } hover:cursor-pointer` } onClick={activar}>
        <td className='border border-black'>{index + 1}</td>
        <td className='border border-black'>{codigoML}</td>
        <td className='border border-black'>{descripcion}</td>
        <td className='border border-black'>{precioML.toFixed(2)}</td>
        <td className='border border-black'>{stockML.toFixed(2)}</td>
        <td className='border border-black'></td>
        <td className='border border-black'></td>
    </tr>
  )
}
