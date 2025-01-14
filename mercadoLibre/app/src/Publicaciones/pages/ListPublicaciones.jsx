import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import swal from 'sweetalert2';

import { Button } from "../../components/Button";
import { actualizarPublicacion, eliminarPublicacion, getPublicaciones } from "../../store/publicacones";
import { PublicacionItem } from "../components/PublicacionItem";
import { Modal } from "../components/Modal";
import { closeModal, openModal } from "../../store/ui/uiSlice";
import { Link } from "react-router-dom";
import { calcularPrecioSujerido, modificarPrecioYStockPorIdDeProducto } from "../../helpers/funciones";

export const ListPublicaciones = () => {

  const { active, publicaciones } = useSelector( state => state.publicaciones);
  const { isOpenModal } = useSelector(state => state.ui);
  const { dolar } = useSelector(state => state.variables);
  const [lista, setLista] = useState(publicaciones);


  const dispatch = useDispatch();

  //Sirve para traer las publicaciones por primera vez
  useEffect(() => {
    dispatch( getPublicaciones() )
  }, []);

  useEffect(() => {
    let aux = [...publicaciones];
    aux.sort((a, b) => {
      if(a.descripcion > b.descripcion) return 1;
      if(a.descripcion < b.descripcion) return -1;
      return 0;
    });

    setLista(aux);
  }, [publicaciones]);

  const modificar = async(e) => {
    
    if (!active.codigoML) return await swal.fire('Seleccionar publicacion a modificar');

    dispatch( openModal() );
  };

  const modificarStockyPrecio = async(e) => {
    for(let elem of publicaciones){
      
      let precioActualizado = Math.ceil(calcularPrecioSujerido(elem.costo, elem.costodolar, elem.impuesto, parseFloat(dolar), elem.tipoVenta, elem.unidadPack))
      dispatch( actualizarPublicacion(elem.codigoML, precioActualizado, Math.floor(elem.tipoVenta === 'UNIDAD' ? elem.stock : elem.stock / elem.unidadPack)));
      await modificarPrecioYStockPorIdDeProducto(elem.codigoML, precioActualizado, Math.floor(elem.tipoVenta === 'UNIDAD' ? elem.stock : elem.stock / elem.unidadPack), elem.tipoVenta, elem.unidadPack);
    }

    await swal.fire('Modificacion de Stock', 'Se modifico el stock de todos los productos cargados', 'success')
  };

  const eliminar = async(e) => {
    if (!active.codigoML) return swal.fire('Seleccionar una plubicacion a eliminar');

    dispatch(eliminarPublicacion(active.codigoML))
  };

  const handleSearch = (e) => {
    let aux = publicaciones.filter( elem => elem.descripcion.toLowerCase().includes(e.target.value.toLowerCase()) );

    aux.sort((a, b) => {
      if(a.descripcion > b.descripcion) return 1;
      if(a.descripcion < b.descripcion) return -1;
      return 0;
    });

    setLista(aux);

  }

  // const electron = (window).electron;
  return (
    <div className="w-full bg-yellow-500 border-l-gray-500 border pl-1">
      <header>
        <h2 className="text-center text-2xl pb-5">Publicaciones</h2>
        <div className="flex justify-center mb-2 gap-2">
          <h3>Buscador</h3>
          <input type="text" name="buscador" id="buscador" onChange={handleSearch}/>
        </div>
      </header>
      <div className="w-full overflow-scroll h-[calc(100vh-150px)] bg-white">
        <table className="w-full">
          <thead>
            <tr>
              <th className="border border-black">N° </th>
              <th className="border border-black">Codigo ML</th>
              <th className="border border-black">Codigo Interno</th>
              <th className="border border-black">Descripcion</th>
              <th className="border border-black">Costo + Iva</th>
              <th className="border border-black">Precio Sujerido</th>
              <th className="border border-black">Stock Sujerido</th>
              <th className="border border-black">Precio</th>
              <th className="border border-black">Stock</th>
            </tr>
          </thead>
          <tbody>
            {
              lista.map((elem, index) => (
                <PublicacionItem {...elem} index={index} key={elem._id} />
              ))
            }
          </tbody>
        </table>
      </div>

      <section className="flex justify-around pt-2">
        <Link to='../agregar'>
          <Button text='Agregar' />
          </Link>
        <Button text='Modificar' funcion={modificar}/>
        <Button text='Modificar Stock y Precio' funcion={modificarStockyPrecio}/>
    
        {/* <Button text='Eliminar' funcion={eliminar}/> */}
      </section>

      {isOpenModal && <Modal closeModal={closeModal} type={'put'} precioML={active.precioML} stockML={active.stockML}/>}
    </div>
  )
}
