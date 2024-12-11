import React, { useEffect } from 'react'
import { AppRouter } from './router/AppRouter'
import { AsideBar } from './components/AsideBar'
import { verificarToken } from './helpers/funciones'

export const MercadoApp = () => {

  useEffect(() => {
    verificarToken()
  }, [])

  return (
    <div className='flex h-screen'>
        <AsideBar />
        
        <AppRouter />
    </div>
  )
}
