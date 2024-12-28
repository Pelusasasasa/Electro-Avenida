import React from 'react'

export const Button = ({text, funcion, disabled = false, type, clases = ''}) => {
  return (
    <button disabled={disabled}
        onClick={funcion}
        type={type}
        className={`border border-black rounded-lg 
        p-2 hover:scale-110 hover:bg-gray-600 hover:text-white ${clases}`}
    >
        {text}
    </button>
  )
}
