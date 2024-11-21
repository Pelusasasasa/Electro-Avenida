import { useEffect, useState } from 'react'
import {useDispatch, useSelector} from 'react-redux';
import { calcularPrecioSujerido, traerCategorias, traerSubCategorias } from '../../helpers/funciones'
import { useForm } from '../../hooks/useForm';
import { setProducto } from '../../store/productos/thunks';

const initialForm = {
    categories: '',
    descripcion: '',
    stockSujerido: 0,
    precioSujerido: 0,
    costoIva: 0,
}

export const PostPublicacion = () => {
    const { active } = useSelector(state => state.productos);
    const dispatch = useDispatch()

    const {onInputChange, codigo, descripcion, costoIva, precioSujerido, stockSujerido, categories, subCategories, subCategories1, onChanges} = useForm(initialForm);

    const [categorias, setCategorias] = useState([]);
    const [subCategorias, setSubCategorias] = useState([]);
    const [subCategorias1, setSubCategorias1] = useState([]);
    const [subCategorias2, setSubCategorias2] = useState([]);
    
    
    const cargarPagina = async() => {
        //Traemos las categorias de mercado libre, proximamente las vamos a guaradar en la base de datos y traerlas desde ahi
        let res = await traerCategorias();
        setCategorias(res);
    };

    const cargarSubCategories = async() => {
       let res = await traerSubCategorias(categories);
       setSubCategorias(res);
    };

    const cargarSubCategories1 = async() => {
       let res = await traerSubCategorias(subCategories);
       setSubCategorias1(res);
    };

    const cargarSubCategories2 = async() => {
       let res = await traerSubCategorias(subCategories1);
       setSubCategorias2(res);
    };

    useEffect(() => {
      cargarPagina();
    }, [])

    useEffect(() => {
        cargarSubCategories()
    }, [categories]);

    useEffect(() => {
        cargarSubCategories1()
    }, [subCategories]);

    useEffect(() => {
        cargarSubCategories2()
    }, [subCategories1]);

    useEffect(() => {
        if (active._id) {
            listarProductoTraido();
        }
    }, [active])
    
    const listarProductoTraido = () => {
        onChanges({
            descripcion: active.descripcion,
            costoIva: (parseFloat(active.costo) + parseFloat(active.impuestos)).toFixed(2),
            stockSujerido: active.stock,
            precioSujerido: calcularPrecioSujerido(parseFloat(active.costo), parseFloat(active.impuestos))
        });
    };

    const onInputKeyDown = (e) => {
        if (e.keyCode === 13){
            dispatch( setProducto(codigo) );
        }
    };

  return (
    <form className='bg-yellow-600 w-full'>
        <section id='header' className='grid grid-cols-[0.5fr_2fr] gap-3 m-2'>
            <div className='flex flex-col'>
                <label htmlFor="codigo" className='text-center font-bold '>Codigo</label>
                <input type="text" name="codigo" id="codigo" className='' autoFocus onChange={onInputChange} onKeyDown={onInputKeyDown} />
            </div>

            <div className='flex flex-col'>
                <label htmlFor="descripcion" className='text-center font-bold '>Descripcion</label>
                <input type="text" name="descripcion" onChange={onInputChange} value={descripcion} id="descripcion" />
            </div>
        </section>

        <section id='interno' className='grid grid-cols-3 gap-3 m-2'>
            <div className='flex flex-col'>
                <label htmlFor="costoIva" className='text-center font-bold '>Costo Iva</label>
                <input type="number" name="costoIva" id="costoIva" disabled className='bg-gray-300' value={costoIva} />
            </div>
            <div className='flex flex-col'>
                <label htmlFor="precioSujerido" className='text-center font-bold '>Precio Sujerido</label>
                <input type="number" name="precioSujerido" id="precioSujerido" value={precioSujerido} className='bg-gray-300' disabled/>
            </div>
            <div className='flex flex-col'>
                <label htmlFor="stockSujerido" className='text-center font-bold '>Stock Sujerido</label>
                <input type="number" name="stockSujerido" id="stockSujerido" className='bg-gray-300' disabled value={stockSujerido}/>
            </div>
        </section>

        <section className='grid grid-cols-3 gap-3 m-2'>
            <div className='flex flex-col'>
                <label htmlFor="imagenes" className='text-center font-bold '>Imagenes</label>
                <input type="file" multiple accept='image/*' name="imagenes" id="imagenes" className='bg-white'/>
            </div>
            <div className='flex flex-col'>
                <label htmlFor="precio" className='text-center font-bold '>Precio</label>
                <input type="number" name="precio" id="precio" className='bg-white'/>
            </div>
            <div className='flex flex-col'>
                <label htmlFor="stock" className='text-center font-bold '>Stock</label>
                <input type="number" name="stock" id="stock" className='bg-white'/>
            </div>
        </section>

        <section id='interno' className='grid grid-cols-4 gap-3 m-2'>
            <div className='flex flex-col'>
                <label htmlFor="categoria" className='text-center font-bold '>Categoria</label>
                <select name="categories" id="categories" onChange={onInputChange}>
                    {categorias.map(elem => (
                        <option key={elem.id} value={elem.id}>{elem.name}</option>
                    ))}
                </select>
            </div>

            <div className='flex flex-col'>
                <label htmlFor="subCategories" className='text-center font-bold '>Sub Categoria</label>
                <select name="subCategories" id="subCategories" onChange={onInputChange}>
                    {subCategorias.map(elem => (
                        <option key={elem.id} value={elem.id}>{elem.name}</option>
                    ))}
                </select>
            </div>

            <div className='flex flex-col'>
                <label htmlFor="subCategories1" className='text-center font-bold '>Sub Categoria 1</label>
                <select name="subCategories1" id="subCategories1" onChange={onInputChange}>
                    {subCategorias1.map(elem => (
                        <option key={elem.id} value={elem.id}>{elem.name}</option>
                    ))}
                </select>
            </div>

            <div className='flex flex-col'>
                <label htmlFor="subCategories2" className='text-center font-bold '>Sub Categoria 2</label>
                <select name="subCategories2" id="subCategories2" onChange={onInputChange}>
                    {subCategorias2.map(elem => (
                        <option key={elem.id} value={elem.id}>{elem.name}</option>
                    ))}
                </select>
            </div>
            
        </section>

        <section className='grid grid-cols-4 gap-3 m-2'>
            <div className='flex flex-col'>
                <label htmlFor="cuotas" className='text-center font-bold '>Cuotas</label>
                <select name="cuotas" id="cuotas" onChange={onInputChange}>
                    {subCategorias2.map(elem => (
                        <option key={elem.id} value={elem.id}>{elem.name}</option>
                    ))}
                </select>
            </div>
        </section>

        
        
    </form>
  )
}
