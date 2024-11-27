import React, { useEffect } from 'react'
import { AppRouter } from './router/AppRouter'
import { AsideBar } from './components/AsideBar'
import { actualizarToken, obtenerInformacionUsuario } from './helpers/funciones'

export const MercadoApp = () => {

  // const cargarAplicacion = async() =>{
  //   const res = await obtenerInformacionUsuario();
    
  //   if (res === 'error'){
  //      await actualizarToken()
  //   }
  // };

  useEffect(() => {
    // cargarAplicacion();
  }, [])

  return (
    <div className='flex h-screen'>
        <AsideBar />
        
        <AppRouter />
    </div>
  )
}
