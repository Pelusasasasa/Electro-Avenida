import { useEffect, useState } from 'react'
import {useDispatch, useSelector} from 'react-redux';
import { calcularPrecioSujerido, subirImagenes, traerCategorias, traerSubCategorias } from '../../helpers/funciones'
import { useForm } from '../../hooks/useForm';
import { setProducto } from '../../store/productos/thunks';
import { Button } from '../../components/Button';
import { postPublicaciones } from '../../store/publicacones/thunks';
import { saved } from '../../store/publicacones/publicacionesSlice';

const initialForm = {
    descripcion: '',
    stockSujerido: 0,
    precioSujerido: 0,
    costoIva: 0,
    precio: 0,
    stock: 0,
    categories: 'MLA1574',
    subCategories: 'MLA1582',
    voltaje: '220V',
    temperaturaLuz: '',
    imagenes: []
}

export const PostPublicacion = () => {
    const { active } = useSelector(state => state.productos);
    const dispatch = useDispatch()

    const {
         subCategories, subCategories1, voltaje, temperaturaLuz, colorLuz, potencia, tipofuente, voltaje2, formState ,onChanges,
        onInputChange, codigo, descripcion, marca, costoIva, imagenes, precioSujerido, stockSujerido, precio, stock, categories,
        tipoBateria, formato, forma, lugarMontaje, material, ambiente, capacidadFoco
        } = useForm(initialForm);

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
    }, [active]);

    
    const listarProductoTraido = () => {
        onChanges({
            descripcion: active.descripcion,
            costoIva: (parseFloat(active.costo) + parseFloat(active.impuestos)).toFixed(2),
            stockSujerido: active.stock,
            marca: active.marca,
            precioSujerido: calcularPrecioSujerido(parseFloat(active.costo), parseFloat(active.impuestos))
        });
    };

    const onInputKeyDown = (e) => {
        if (e.keyCode === 13){
            e.preventDefault();
            dispatch( setProducto(codigo) );
        }
    };

    const agregar = async(e) => {
        e.preventDefault();
        dispatch(saved());
        console.log(potencia)


         let producto = {};
         producto.title = formState.descripcion;
         producto.category_id = formState.subCategories2
         producto.price = formState.precio;
         producto.currency_id = 'ARS';
         producto.available_quantity = formState.stock;
         producto.buying_mode = 'buy_it_now';
         producto.condition = 'new';
         producto.listing_type_id = 'gold_special'
         producto.sale_terms = [
             {
                 id: 'WARRANTY_TYPE',
                 value_name: 'Garantía del vendedor'
             },
             {
                 id: 'WARRANTY_TIME',
                 value_name: '3 meses'
             }
         ];
         producto.pictures = [
             {
                 'source': (new URL(imagenes)).href
             }
         ];
         producto.shipping = {
             mode: 'me2',
             tags: [
                 'local_pick_up_not_allowed',
                 'mandatory_free_shipping'
             ]
         };

         producto.attributes = [
             {
                 id: 'AMBIENTS',
                 value_name: ambiente
             },
             {
                 id: 'BATTERY_TYPE',
                 value_name: tipoBateria
             },
             {
                 id: 'BRAND',
                 value_name: formState.marca
             },
             {
                id: 'COLOR_TEMPERATURE',
                value_name: temperaturaLuz
             },
             {
                 id: 'MATERIALS',
                 value_name: material
             },
             {
                 id: 'MODEL',
                 value_name: active.cod_fabrica
             },
             {
                 id: 'MOUNTING_PLACES',
                 value_name: lugarMontaje
             },
             {
                 id: 'LAMP_FORMAT',
                 value_id: formato
             },
             {
                id: 'LIGHT_BULBS_CAPACITY',
                value_name: capacidadFoco
             },
             {
                id: 'LIGHT_COLOR',
                value_name: colorLuz
             },
             {
                id: 'LIGHT_SOURCES_TYPES',
                value_name: tipofuente
             },
             {
                id: 'SHAPE',
                value_name: forma
             },
             {
                "id": "SELLER_SKU",
                "name": "SKU",
                "value_id": null,
                "value_name": `${codigo}`,
                "values": [
                    {
                        "id": null,
                        "name": `${codigo}`,
                        "struct": null
                    }
                ],
                "value_type": "string"
            },
            {
                id: 'POWER',
                value_name: potencia ? potencia + ' W' : null,
                value_id: potencia ? null : "-1"
            },
            {
                id: 'POWER_SUPPLY_TYPE',
                value_id: voltaje2 
            },
            {
                id: 'VOLTAGE',
                value_name: voltaje
            }
         ]

         dispatch( postPublicaciones(producto) )
    };

  return (
    <form className='bg-yellow-600 w-full' onSubmit={agregar}>
        <section id='header' className='grid grid-cols-[0.5fr_2fr_0.5fr] gap-3 m-2'>
            <div className='flex flex-col'>
                <label htmlFor="codigo" className='text-center font-bold '>Codigo</label>
                <input type="text" name="codigo" id="codigo" className='' autoFocus onChange={onInputChange} onKeyDown={onInputKeyDown} />
            </div>

            <div className='flex flex-col'>
                <label htmlFor="descripcion" className='text-center font-bold '>Descripcion</label>
                <input type="text" name="descripcion" onChange={onInputChange} value={descripcion} id="descripcion" />
            </div>

            <div className='flex flex-col'>
                <label htmlFor="marca" className='text-center font-bold '>Marca</label>
                <input type="text" name="marca" onChange={onInputChange} value={marca} id="marca" />
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

        <section id='interno' className='grid grid-cols-3 gap-3 m-2'>
            
            <div className='flex flex-col'>
                <label htmlFor="imagenes" className='text-center font-bold '>Imagenes</label>
                <input type="file" multiple accept='image/*' name="imagenes" id="imagenes" className='bg-white' value={imagenes} onChange={onInputChange}/>
            </div>

            <div className='flex flex-col'>
                <label htmlFor="precio" className='text-center font-bold '>Precio</label>
                <input type="number" name="precio" id="precio" value={precio} onChange={onInputChange} className='bg-white'/>
            </div>

            <div className='flex flex-col'>
                <label htmlFor="stock" className='text-center font-bold '>Stock</label>
                <input type="number" name="stock" id="stock" value={stock} onChange={onInputChange} className='bg-white'/>
            </div>

        </section>

        <section id='interno' className='grid grid-cols-4 gap-3 m-2'>
            <div className='flex flex-col'>
                <label htmlFor="categoria" className='text-center font-bold '>Categoria</label>
                <select name="categories" id="categories" value={categories} onChange={onInputChange}>
                    {categorias.map(elem => (
                        <option key={elem.id} value={elem.id}>{elem.name}</option>
                    ))}
                </select>
            </div>

            <div className='flex flex-col'>
                <label htmlFor="subCategories" className='text-center font-bold '>Sub Categoria</label>
                <select name="subCategories" id="subCategories" value={subCategories} onChange={onInputChange}>
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
            
            <div className='flex flex-col'>
                <label htmlFor="voltaje" className='text-center font-bold '>Voltaje</label>
                <select name="voltaje" id="voltaje" value={voltaje} onChange={onInputChange}>
                    <option value="220V">220V</option>
                    <option value="12V">12V</option>
                </select>
            </div>

            <div className='flex flex-col'>
                <label htmlFor="colorLuz" className='text-center font-bold '>Color Luz</label>
                <select name="colorLuz" id="colorLuz" value={colorLuz} onChange={onInputChange}>
                    <option value="null">N/A</option>
                    <option value="BLANCO">BLANCO</option>
                    <option value="CALIDO">CALIDO</option>
                    <option value="NEUTRO">NEUTRO</option>
                </select>
            </div>

            <div className='flex flex-col'>
                <label htmlFor="temperaturaLuz" className='text-center font-bold '>Temperatura Luz</label>
                <select name="temperaturaLuz" id="temperaturaLuz" value={temperaturaLuz} onChange={onInputChange}>
                    <option value="null">N/A</option>
                    <option value="6500 K">6500 K</option>
                    <option value="3000 K">3000 K</option>
                    <option value="4000 K">4000 K</option>
                </select>
            </div>
            
            <div className='flex flex-col'>
                <label htmlFor="potencia" className='text-center font-bold '>Potencia</label>
                <input type="number" name="potencia" id="potencia" onChange={onInputChange} value={potencia} />
            </div>

            <div className='flex flex-col'>
                <label htmlFor="tipofuente" className='text-center font-bold '>Tipo Fuente</label>
                <select name="tipofuente" id="tipofuente" value={tipofuente} onChange={onInputChange}>
                    <option value="7387210">LED</option>
                    <option value="3137301">INCANDESENTE</option>
                </select>
            </div>

            <div className='flex flex-col'>
                <label htmlFor="voltaje2" className='text-center font-bold '>Voltaje 2</label>
                <select name="voltaje2" id="voltaje2" value={voltaje2} onChange={onInputChange}>
                    <option value="220V">220V</option>
                    <option value="12V">12V</option>
                </select>
            </div>

            
            <div className='flex flex-col'>
                <label htmlFor="formato" className='text-center font-bold '>Formato de la lampara</label>
                <select name="formato" id="formato" value={formato} onChange={onInputChange}>
                    <option value="null">N/A</option>
                    <option value="13435240">Colgante</option>
                    <option value="13685639">Aplique</option>
                </select>
            </div>

            <div className='flex flex-col'>
                <label htmlFor="forma" className='text-center font-bold '>Forma</label>
                <input type="text" name="forma" id="forma" onChange={onInputChange} value={forma} />
            </div>

            <div className='flex flex-col'>
                <label htmlFor="lugarMontaje" className='text-center font-bold '>Lugares de montaje</label>
                <input type="text" name="lugarMontaje" id="lugarMontaje" onChange={onInputChange} value={lugarMontaje} />
            </div>

            <div className='flex flex-col'>
                <label htmlFor="material" className='text-center font-bold '>Material</label>
                <input type="text" name="material" id="material" onChange={onInputChange} value={material} />
            </div>

            <div className='flex flex-col'>
                <label htmlFor="ambiente" className='text-center font-bold '>Ambiente</label>
                <input type="text" name="ambiente" id="ambiente" onChange={onInputChange} value={ambiente} />
            </div>

            <div className='flex flex-col'>
                <label htmlFor="capacidadFoco" className='text-center font-bold '>Capacidad Foco</label>
                <input type="number" name="capacidadFoco" id="capacidadFoco" onChange={onInputChange} value={capacidadFoco} />
            </div>
            

            
        </section>

        <section className='flex justify-around pt-2'>
            <Button text='Agregar' type='submit'/>
            <Button text='Salir' />
            
        </section>
        
    </form>
  )
}
