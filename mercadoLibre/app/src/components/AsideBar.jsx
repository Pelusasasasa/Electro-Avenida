import React, { useEffect, useState } from 'react'
import { AsideItem } from './AsideItem'
import { useDispatch, useSelector } from 'react-redux';
import { getConsultas } from '../store/consultas/thunks';

export const AsideBar = () => {

  const [sinResponder, setSinResponder] = useState(0);
  const { consultas } = useSelector(state => state.consultas);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getConsultas())
  },[]);

  useEffect(() => {
    setSinResponder(consultas.filter(consulta => consulta.status !== 'ANSWERED').length);
  }, [consultas]);

  return (
    <aside className='w1/4 bg-yellow-400 text-gray-800 font-bold p-2'>
        <ul>
            <AsideItem path='/publicaciones/list' text='Publicaciones'/>
            <AsideItem path='/ventas/list' text='Ventas' />

            <div className='flex relative'>
              <div className='w-full'>
                <AsideItem path='/consultas/list' text='Consultas' />
              </div>
              <p className='absolute right-0 bg-red-400 border border-black rounded-3xl p-2'>{sinResponder}</p>
            </div>
        </ul>
    </aside>
  )
}
