import React from 'react'
import { Link } from 'react-router-dom'

export const AsideItem = ({text, path}) => {
  return (
    <li className='h-14 relative group text-2xl bg-gray-400 m-1 hover:cursor-pointer hover:scale-110 text-center flex justify-center items-center'>
        <Link to={path} className='p-2'>
            {text}
        </Link>
    </li>
  )
}
