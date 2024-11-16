import React from 'react'
import { AppRouter } from './router/AppRouter'
import { AsideBar } from './components/AsideBar'

export const MercadoApp = () => {
  return (
    <div className='flex h-screen'>
        <AsideBar />
        <AppRouter />
    </div>
  )
}
