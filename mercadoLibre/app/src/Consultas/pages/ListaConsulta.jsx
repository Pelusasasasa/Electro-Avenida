import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ConsultaItem } from '../components/ConsultaItem';
import { getConsultas } from '../../store/consultas/thunks';

export const ListaConsulta = () => {
  const {consultas} = useSelector( state => state.consultas);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getConsultas())
  }, [])

  return (
    <section className='w-full bg-yellow-500'>
      <h1 className='text-center font-bold text-2xl mb-2'>Consultas de Mercado Libre</h1>

      <section className='bg-white h-[calc(100vh-120px)] overflow-scroll'>
        <table className='w-full '>
          <thead>
            <tr>
              <th className='border border-black'>Fecha</th>
              <th className='border border-black'>Producto</th>
              <th className='border border-black'>Texto</th>
              <th className='border border-black'>Status</th>
              <th className='border border-black'>Accion</th>
            </tr>
          </thead>
          <tbody>
            {
              consultas.map( elem => (
                <ConsultaItem {...elem} key={elem.id}/>
              ))
            }
          </tbody>
        </table>
      </section>
    </section>

  )
}
