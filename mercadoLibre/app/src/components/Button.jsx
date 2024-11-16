import React from 'react'

export const Button = ({text, funcion, disabled = false}) => {
  return (
    <button disabled={disabled}
        onClick={funcion}
        className='border border-black rounded-lg
         p-2 hover:scale-110 hover:bg-gray-600 hover:text-white'
    >
        {text}
    </button>
  )
}
