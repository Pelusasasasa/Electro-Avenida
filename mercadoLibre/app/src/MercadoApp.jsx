import React, { useEffect } from 'react'
import { AppRouter } from './router/AppRouter'
import { AsideBar } from './components/AsideBar'
import { verificarToken } from './helpers/funciones'
import { useVariableStore } from './hooks/useVariableStore'

export const MercadoApp = () => {

  const { startGetVariables } = useVariableStore();

  useEffect(() => {
    startGetVariables()
  }, [])

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
