import { useContext } from 'react'
import '../css/Button.css'
import { TodoContext } from '../TodoContext';

import axios from 'axios';
import 'dotenv';
const URL = 'http://localhost:4000/api/';



function Button({text}) {

  const {searchValue,setProduct} = useContext(TodoContext);

  async function buscar() {
    const producto = (await axios.get(`${URL}productos/${searchValue}`)).data;
    setProduct(producto);
  };
  


  return (
    <button onClick={buscar}>{text}</button>
  )
}

export default Button