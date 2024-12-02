import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import swal from 'sweetalert2';

import { Button } from "../../components/Button";
import { eliminarPublicacion, getPublicaciones } from "../../store/publicacones";
import { PublicacionItem } from "../components/PublicacionItem";
import { Modal } from "../components/Modal";
import { closeModal, openModal } from "../../store/ui/uiSlice";
import { Link } from "react-router-dom";

export const ListPublicaciones = () => {

  const { active, publicaciones } = useSelector( state => state.publicaciones);
  const { isOpenModal } = useSelector(state => state.ui);

  const dispatch = useDispatch();

  //Sirve para traer las publicaciones por primera vez
  useEffect(() => {
    dispatch(getPublicaciones())
  }, []);

  const modificar = async(e) => {
    
    if (!active.codigoML) return await swal.fire('Seleccionar publicacion a modificar');

    dispatch( openModal() );
  };

  const eliminar = async(e) => {
    if (!active.codigoML) return swal.fire('Seleccionar una plubicacion a eliminar');

    dispatch(eliminarPublicacion(active.codigoML))
  };

  // const electron = (window).electron;
  return (
    <div className="w-full bg-yellow-500 border-l-gray-500 border pl-1">
      <header>
        <h2 className="text-center text-2xl pb-5">Publicaciones</h2>
      </header>
      <div className="w-full overflow-scroll h-[calc(100vh-120px)] bg-white">
        <table className="w-full">
          <thead>
            <tr>
              <th className="border border-black">N° </th>
              <th className="border border-black">Codigo ML</th>
              <th className="border border-black">Descripcion</th>
              <th className="border border-black">Costo + Iva</th>
              <th className="border border-black">Precio Sujerido</th>
              <th className="border border-black">Precio</th>
              <th className="border border-black">Stock</th>
            </tr>
          </thead>
          <tbody>
            {
              publicaciones.map((elem, index) => (
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
        <Button text='Eliminar' funcion={eliminar}/>
      </section>

      {isOpenModal && <Modal closeModal={closeModal} type={'put'} precioML={active.precioML} stockML={active.stockML}/>}
    </div>
  )
}
