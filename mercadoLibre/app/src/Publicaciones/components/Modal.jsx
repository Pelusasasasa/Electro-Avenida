import { useDispatch, useSelector } from 'react-redux'
import { useForm } from '../../hooks/useForm';
import { actualizarPublicacion } from '../../store/publicacones';

const initialState = {
    precioML: '',
    stockML: ''
};
export const Modal = ({closeModal, type}) => {
    const dispatch = useDispatch();
    const { active } = useSelector(state => state.publicaciones);
    initialState.precioML = active.precioML;
    initialState.stockML = active.stockML


    const {onInputChange, formState, precioML, stockML} = useForm(initialState);

    const onSubmit = (e) => {
        e.preventDefault();

        if(type === 'put'){
            dispatch(actualizarPublicacion(active.codigoML, formState.precioML, formState.stockML))

            dispatch(closeModal());
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
