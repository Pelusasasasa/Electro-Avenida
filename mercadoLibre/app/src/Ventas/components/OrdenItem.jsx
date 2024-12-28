import React from 'react'
import { Button } from '../../components/Button'
import { useOrdenesStore } from '../../hooks/useOrdenesStore';

const OrdenItem = ({id, date_created, order_items, total_amount, buyer}) => {
    const { active } = useOrdenesStore();
    console.log(active)
  return (
    <tr className={`cursor-pointer ${id === active.id ? 'bg-cyan-300' : 'hover:bg-gray-400'}`}>
        <td className='border border-black'>{date_created.slice(0,10).split('-', 3).reverse().join('/')}</td>
        <td className='border border-black'>{buyer.nickname}</td>
        <td className='border border-black'>{total_amount.toFixed(2)}</td>
        <td className='border border-black'>{}</td>
        <td className='border border-black'>
            <Button clases='w-full' text='Ver Detalles'/>
        </td>
    </tr>
  )
}

export default OrdenItem