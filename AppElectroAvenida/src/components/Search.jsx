import { useContext } from 'react'
import '../css/Search.css'
import { TodoContext } from '../TodoContext'

function Search() {
  const {setSearchValue} = useContext(TodoContext);
  function buscar(e) {
    setSearchValue(e.target.value);
  }
  return (
    <input type="text" onChange={buscar} placeholder='035-019'/>
  )
}

export default Search