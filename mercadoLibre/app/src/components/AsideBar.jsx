import React from 'react'
import { AsideItem } from './AsideItem'

export const AsideBar = () => {
  return (
    <aside className='w1/4 bg-yellow-400 text-gray-800 font-bold p-2'>
        <ul>
            <AsideItem path='/publicaciones/list' text='Publicaciones'/>
            <AsideItem path='/ventas/list' text='Ventas' />
            <AsideItem path='/consultas/list' text='Consultas' />
        </ul>
    </aside>
  )
}
