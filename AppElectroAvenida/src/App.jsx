import { useContext, useState } from 'react'
import Search from './components/Search'
import Button from './components/Button'
import Parrafo from './components/Parrafo'
import './css/App.css'
import { TodoContext } from './TodoContext'
const URL = 'http://localhost:4000/api/';

function App() {
  const [count, setCount] = useState(0);
  const {product} = useContext(TodoContext);
  const {_id,descripcion,precio_venta,observacion,marca,stock} = product;

  return (
    <main className="contenedor">
      <div className='buscador'>
        <Search/>
        <Button text={"Buscar"}/>
      </div>
      <div className='img'>
        <img src={`${URL}productos/${_id}/image`} alt="" />
      </div>
      <div className='informacion'>
        <Parrafo text={descripcion} />
        <div className='informacion-adicional'>
          <Parrafo claseAdd={"marca"} textAdicional={"Marca: "} text={marca}/>
          <Parrafo claseAdd={"precio"} textAdicional={"Precio $"} text={precio_venta}/>
        </div>
        <Parrafo text={observacion}/>
      </div>
    </main>
  )
}

export default App
