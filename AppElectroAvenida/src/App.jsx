import { useState } from 'react'
import Search from './components/Search'
import Button from './components/Button'
import Parrafo from './components/Parrafo'
import './css/App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className='buscador'>
        <Search/>
        <Button text={"Buscar"}/>
      </div>
      <img src="" alt="" />
      <div className='informacion'>
        <Parrafo text={"Lampara led bulbo 7w"} />
        <div className='informacion-adicional'>
          <Parrafo text={"Candil"}/>
          <Parrafo text={"$ 360.00"}/>
        </div>
        <Parrafo text={"Observacioneeeeeeeeees"}/>
      </div>
    </>
  )
}

export default App
