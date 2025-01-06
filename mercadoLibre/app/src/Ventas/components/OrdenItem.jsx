import React from 'react';
import Swal from 'sweetalert2';

import { Button } from '../../components/Button'
import { useOrdenesStore } from '../../hooks/useOrdenesStore';

const OrdenItem = ({id, date_created, order_items, total_amount, buyer}) => {
    const { active, ordenes, startActive } = useOrdenesStore();

    const handleActive = (e) => {
      let id = '';

      if(e.target.tagName === 'BUTTON') return;

      if(e.target.tagName === 'TD') {
        id = e.target.parentElement.id;
      }else{
        id = e.target.id;
      };

      startActive(id);
    };

    const verDetalles = async(e) => {
      const id = e.target.parentElement.parentElement.id;
      await startActive(id);

      const res = ordenes.find(orden => orden.id == id);
      const { order_items } = res;
      console.log(res)

      const {item, requested_quantity, full_unit_price} = order_items[0];


      await Swal.fire({
        title: item.id,
        html: `
          <h3 class='font-bold'>${item.title}</h3>
          <span>${item.seller_sku}</span>

          <div class='flex justify-between'>
            <div class='flex gap-2'>
              <p>${requested_quantity.measure === 'unit' ? 'Unidad' : 'Pack'}</p>
              <p>${requested_quantity.value.toFixed(2)}</p>
            </div>
            <div>
              <p>Precio: ${full_unit_price}</p>
            </div>
          </div>
        `
      })
    };

  return (
    <tr id={id} className={`cursor-pointer ${id === active.id ? 'bg-cyan-300' : 'hover:bg-gray-400'}`} onClick={handleActive}>
        <td className='border border-black font-bold'>{date_created.slice(0,10).split('-', 3).reverse().join('/')}</td>
        <td className='border border-black'>{buyer.nickname}</td>
        <td className='border border-black'>{total_amount.toFixed(2)}</td>
        <td className='border border-black'>{}</td>
        <td className='border border-black'>
            <Button clases='w-full' text='Ver Detalles' funcion={verDetalles}/>
        </td>
    </tr>
  )
}

export default OrdenItem