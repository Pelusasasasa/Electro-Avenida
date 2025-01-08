import { useDispatch, useSelector } from 'react-redux';
import swal from 'sweetalert2';

import { useForm } from '../../hooks/useForm';
import { actualizarPublicacion } from '../../store/publicacones';
import { buscarVariacionesProducto, modificarPrecioYStockPorIdDeProducto, modificarVariacionProducto } from '../../helpers/funciones';


const initialState = {
    precioML: '',
    stockML: ''
};
export const Modal = ({closeModal, type}) => {
    const dispatch = useDispatch();
    const { active } = useSelector(state => state.publicaciones);
    initialState.precioML = active.precioML;
    initialState.stockML = active.stockML;
    initialState.tipoVenta = active.tipoVenta;
    initialState.unidadPack = active.unidadPack;


    const {onInputChange, formState, precioML, stockML, unidadPack, tipoVenta} = useForm(initialState);

    const onSubmit = async(e) => {
        e.preventDefault();

        if(type === 'put'){
            dispatch(actualizarPublicacion(active.codigoML, formState.precioML, formState.stockML, formState.tipoVenta, formState.unidadPack));
            
            const res = await modificarPrecioYStockPorIdDeProducto(active.codigoML, precioML, stockML, tipoVenta, unidadPack);
            
            if(res) await swal.fire('Se modifico el producto');

            dispatch(closeModal());

            if(!res) swal.fire('No se modifico el producto');
        }
    }

  return (
    <div className='modal'>
        <div className='modal-content'>
            <h2 className='text-center text-2xl mb-2'>Modificar Publicacion</h2>
            <form onSubmit={onSubmit}>
                <div>
                    <label htmlFor="precio">Precio ML</label>
                    <input type="number" name='precioML' onChange={onInputChange} value={precioML} id="precio" />
                </div>
                <div>
                    <label htmlFor="stock">Stock ML</label>
                    <input type="number" onChange={onInputChange} value={stockML} name="stockML" id="stock" />
                </div>
                <div className='flex justify-around'>
                    <div>
                        <label htmlFor="tipoVenta">Tipo Venta</label>
                        <select className='border border-black rounded-xl p-2 cursor-pointer' name="tipoVenta" id="tipoVenta" onChange={onInputChange} value={tipoVenta}>
                            <option value="UNIDAD">Unidad</option>
                            <option value="PACK">Pack</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="unidadPack">Cantidad en el Pack</label>
                        <input type="number" className='text-right' name="unidadPack" id="unidadPack" onChange={onInputChange} value={unidadPack} />
                    </div>
                </div>
                <div className='flex justify-center'>
                    <button type='submit' className={`${type === 'post' ? '' : 'hidden'}`}>Guarda</button>
                    <button type='submit' className={`${type === 'put' ? '' : 'hidden'}`}>Modificar</button>
                    <button type='button' onClick={() => dispatch(closeModal())}>Cancelar</button>
                </div>
            </form>
        </div>
    </div>
  )
}
