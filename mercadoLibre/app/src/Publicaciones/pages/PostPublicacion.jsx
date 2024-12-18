import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import Swal from 'sweetalert2';

import { calcularPrecioSujerido, subirImagenes, traerCategorias, traerSubCategorias } from '../../helpers/funciones';
import { useForm } from '../../hooks/useForm';
import { setProducto } from '../../store/productos/thunks';
import { Button } from '../../components/Button';
import { postPublicaciones } from '../../store/publicacones/thunks';
import { saved } from '../../store/publicacones/publicacionesSlice';

const initialForm = {
    descripcion: '',
    stockSujerido: 0,
    precioSujerido: 0,
    codBarra: '',
    costoIva: 0,
    precio: 0,
    stock: 0,
    categories: 'MLA1574',
    subCategories: 'MLA1582',
    subCategories2: '',
    voltaje: '220V',
    temperaturaLuz: '',
    colorLuz: '',
    potencia: '',
    lumenes: 0,
    tipofuente: '7387210',
    voltaje2: '13417945',
    formato: '',
    forma: '',
    lugarMontaje: '',
    material: '',
    ambiente: '',
    capacidadFoco: '',
    incluyeFoco: false,
    inalamabrico: false,
    boton: false,
    incluyeControl: false,
    autoadhesivo: false,
    wifi: false,
    asistenteVirtual: '',
    appInteligente: '',
    eficienciaEnerg: '',

    imagenes: [],

};


export const PostPublicacion = () => {
    const { active, isSaving } = useSelector(state => state.productos);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
         subCategories, subCategories1, subCategories2, voltaje, temperaturaLuz, colorLuz, potencia, lumenes, tipofuente, voltaje2, formState ,onChanges,
        onInputChange, codigo, descripcion, codBarra, marca, costoIva, precioSujerido, stockSujerido, precio, stock, categories,
        tipoBateria, formato, forma, lugarMontaje, material, ambiente, capacidadFoco, incluyeFoco, inalamabrico, boton, incluyeControl,
        autoadhesivo, wifi, asistenteVirtual, appInteligente, eficienciaEnerg
        } = useForm(initialForm);
    
    const [imagenes, setImagenes] = useState(null)
    const [categorias, setCategorias] = useState([]);
    const [subCategorias, setSubCategorias] = useState([]);
    const [subCategorias1, setSubCategorias1] = useState([]);
    const [subCategorias2, setSubCategorias2] = useState([]);

    const validacion = subCategories2 === 'MLA1586' || subCategories2 === 'MLA1588' || subCategories2 === 'MLA1585'  
    
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
    }, [subCategories2]);

    useEffect(() => {
        if (active._id) {
            listarProductoTraido();
        }
    }, [active]);

    
    const listarProductoTraido = () => {
        onChanges({
            descripcion: active.descripcion,
            costoIva: active.costodolar !== 0 ? (parseFloat(active.costodolar) + parseFloat(active.impuestos)) * 1038 :  (parseFloat(active.costo) + parseFloat(active.impuestos)).toFixed(2),
            stockSujerido: active.stock,
            marca: active.marca,
            precioSujerido: calcularPrecioSujerido(active.costodolar !== 0 ? parseFloat(active.costodolar) * 1038 : parseFloat(active.costo), parseFloat(active.impuestos))
        });
    };

    const onInputChangeImagenes = (e) => {
        setImagenes(e.target.files);
    };

    const onInputKeyDown = (e) => {
        if (e.keyCode === 13){
            e.preventDefault();
            dispatch( setProducto(codigo) );
        }
    };

    const agregar = async(e) => {
        e.preventDefault();
        await dispatch( await saved());
        
        const res = await subirImagenes(imagenes);
        console.log(res)
        if(!res?.ok){
            await Swal.fire(res.message, '' ,'error')
            return
        }
        const sources = []

        for(let {variations} of res.arregloImagenes) {
            sources.push({"source": variations[0].secure_url});
        };

         let producto = {};
         producto.title = formState.descripcion;
         producto.category_id = formState.subCategories2 ? formState.subCategories2 : formState.subCategories1;
         producto.price = formState.precio;
         producto.currency_id = 'ARS';
         producto.available_quantity = formState.stock;
         producto.buying_mode = 'buy_it_now';
         producto.condition = 'new';
         producto.listing_type_id = 'gold_pro'
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
         producto.pictures = sources;
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
                 value_id: "-1",
             },
             {
                 id: 'BATTERY_VOLTAGE',
                 value_id: "-1"
             },
             {
                 id: 'BRAND',
                 value_name: formState.marca
             },
             {
                id: 'COLOR_TEMPERATURE',
                value_id: temperaturaLuz ? temperaturaLuz : "-1",
                value_name: temperaturaLuz ? temperaturaLuz : null
             },
             {
                id: 'COMPATIBLE_SMART_APPS',
                value_id: appInteligente ? appInteligente : "-1",
             },
             {
                id: 'COMPATIBLE_VIRTUAL_ASSISTANTS',
                value_id: asistenteVirtual ? asistenteVirtual : "-1",
             },
             {
                id: 'ENERGY_EFFICIENCY',
                value_id: eficienciaEnerg ? eficienciaEnerg : "-1",
             },
             {
                id: 'INCLUDES_REMOTE_CONTROL',
                value_id: incluyeControl ? "242085" : "242084",
             },
             {
                id: 'GTIN',
                value_name: codBarra
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
                id: 'LIGHT_COLOR',
                value_id: colorLuz ? colorLuz : "-1" ,
                value_name: colorLuz ? colorLuz : null
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
            },
            
            {
                id: 'WITH_WI_FI',
                value_id: wifi ? "242085" : "242084"
            }
         ];
         if(formState.subCategorias1 === 'MLA377395'){
            producto.attributes.push(
                {id: 'LUMINOUS_FLUX', value_name: lumenes}
            )
         }

         if(formState.subCategories2 === 'MLA1588' || formState.subCategories2 === "MLA1586" || formState.subCategorias2 === "MLA1586"){
            producto.attributes.push(
                {id: 'INCLUDES_BULBS', value_id: incluyeFoco ? "242085" : "242084"},
                {id: 'IS_AUTOADHESIVE',value_id: autoadhesivo ? "242085" : "242084",},
                {id: 'IS_WIRELESS',value_id: inalamabrico ? "242085" : "242084",},
                {id: 'LAMP_FORMAT', value_id: formato},
                {id: 'LIGHT_BULBS_CAPACITY', value_name: capacidadFoco },
                {id: 'LIGHT_SOURCES_TYPES',value__id: tipofuente ? tipofuente : '-1',},
                {id: 'MOUNTING_PLACES',value_name: lugarMontaje},
                {id: 'SHAPE', value_name: forma},
                {id: 'WITH_PUSH_BUTTON',value_id: boton ? "242085" : "242084"},
            )
         }

        dispatch( postPublicaciones(producto) );
        navigate('/publicaciones/list');

        
    };

  return (
    <form className='bg-yellow-600 w-full' onSubmit={agregar}>
        <section id='header' className='grid grid-cols-[0.5fr_2fr_0.5fr_0.5fr] gap-3 m-2'>
            <div className='flex flex-col'>
                <label htmlFor="codigo" className='text-center font-bold '>Codigo</label>
                <input type="text" name="codigo" id="codigo" className='' autoFocus onChange={onInputChange} onKeyDown={onInputKeyDown} />
            </div>

            <div className='flex flex-col'>
                <label htmlFor="descripcion" className='text-center font-bold '>Descripcion</label>
                <input type="text" name="descripcion" onChange={onInputChange} value={descripcion} id="descripcion" />
            </div>
            <div className='flex flex-col'>
                <label htmlFor="codBarra" className='text-center font-bold '>Codigo Barras</label>
                <input type="text" name="codBarra" onChange={onInputChange} value={codBarra} id="descripcion" />
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
                <input type="file" multiple accept='image/*' name="imagenes" id="imagenes" className='bg-white' onChange={onInputChangeImagenes}/>
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
                <select name="subCategories2" id="subCategories2" value={subCategories2} onChange={onInputChange} >
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
                <label htmlFor="lumenes" className='text-center font-bold '>Flujo Luminoso</label>
                <input type="number" name="lumenes" id="lumenes" onChange={onInputChange} value={lumenes} />
            </div>

            <div className='flex flex-col'>
                <label htmlFor="tipofuente" className='text-center font-bold '>Tipo Fuente</label>
                <select name="tipofuente" id="tipofuente" value={tipofuente} onChange={onInputChange}>
                    <option value="null">N/A</option>
                    <option value="7387210">LED</option>
                    <option value="3137301">INCANDESENTE</option>
                </select>
            </div>

            <div className='flex flex-col'>
                <label htmlFor="voltaje2" className='text-center font-bold '>Voltaje 2</label>
                <select name="voltaje2" id="voltaje2" value={voltaje2} onChange={onInputChange}>
                    <option value="null">N/A</option>
                    <option value="13417945">220 V</option>
                    <option value="12V">12 V</option>
                </select>
            </div>

            
            {
                validacion
                ?
                <div className='flex flex-col'>
                    <label htmlFor="formato" className='text-center font-bold '>Formato de la lampara</label>
                    <select name="formato" id="formato" value={formato} onChange={onInputChange}>
                        <option value="null">N/A</option>
                        <option value="13435240">Colgante</option>
                        <option value="13685639">Aplique</option>
                        <option value="13077255">Plafon</option>
                    </select>
                </div>
                : <></>
            }

            <div className='flex flex-col'>
                <label htmlFor="forma" className='text-center font-bold '>Forma</label>
                <input type="text" name="forma" id="forma" onChange={onInputChange} value={forma} />
            </div>

            {
                validacion
                ? 
                <div className='flex flex-col'>
                    <label htmlFor="lugarMontaje" className='text-center font-bold '>Lugares de montaje</label>
                    <input type="text" name="lugarMontaje" id="lugarMontaje" onChange={onInputChange} value={lugarMontaje} />
                </div>
                : <></>
            }

            {
                validacion
                ?
                <div className='flex flex-col'>
                    <label htmlFor="material" className='text-center font-bold '>Material</label>
                    <input type="text" name="material" id="material" onChange={onInputChange} value={material} />
                </div>
                : <></>
            }

            <div className='flex flex-col'>
                <label htmlFor="ambiente" className='text-center font-bold '>Ambiente</label>
                <input type="text" name="ambiente" id="ambiente" onChange={onInputChange} value={ambiente} />
            </div>

            {
                validacion
                ? <div className='flex flex-col'>
                    <label htmlFor="capacidadFoco" className='text-center font-bold '>Capacidad Foco</label>
                    <input type="number" name="capacidadFoco" id="capacidadFoco" onChange={onInputChange} value={capacidadFoco} />
                </div>
                : <></>
            }
            

            {
                validacion
                ? 
                <div className='flex flex-col'>
                    <label htmlFor="asistenteVirtual" className='text-center font-bold '>Asistente Virtual</label>
                    <input type="text" name="asistenteVirtual" id="asistenteVirtual" onChange={onInputChange} value={asistenteVirtual} />
                </div>
                : <></>
            }

            <div className='flex flex-col'>
                <label htmlFor="appInteligente" className='text-center font-bold '>App Inteligente</label>
                <input type="text" name="appInteligente" id="appInteligente" onChange={onInputChange} value={appInteligente} />
            </div>

            <div className='flex flex-col'>
                <label htmlFor="eficienciaEnerg" className='text-center font-bold '>Eficiencia Energetica</label>
                <input type="text" name="eficienciaEnerg" id="eficienciaEnerg" onChange={onInputChange} value={eficienciaEnerg} />
            </div>

            {
                
                validacion
                ? 
                    <div className='flex flex-col'>
                        <label htmlFor="incluyeFoco" className='text-center font-bold '>Incluye Foco</label>
                        <input type="checkbox" name="incluyeFoco" id="incluyeFoco" onChange={onInputChange} value={incluyeFoco} />
                    </div>
                : <></>
            }
            {
                validacion
                ?
                <div className='flex flex-col'>
                    <label htmlFor="inalamabrico" className='text-center font-bold '>Es Inalambrico</label>
                    <input type="checkbox" name="inalamabrico" id="inalamabrico" onChange={onInputChange} value={inalamabrico} />
                </div>
                : <></>
            }
            {
                validacion
                ?
                <div className='flex flex-col'>
                    <label htmlFor="boton" className='text-center font-bold '>Con Boton Pulsador</label>
                    <input type="checkbox" name="boton" id="boton" onChange={onInputChange} value={boton} />
                </div>
                : <></>
            }
            {
                validacion
                ?
                <div className='flex flex-col'>
                    <label htmlFor="incluyeControl" className='text-center font-bold '>Incluye Control</label>
                    <input type="checkbox" name="incluyeControl" id="incluyeControl" onChange={onInputChange} value={incluyeControl} />
                </div>
                : <></>
            }
            {
                validacion
                ?
                <div className='flex flex-col'>
                    <label htmlFor="autoadhesivo" className='text-center font-bold '>Es Authodesivo</label>
                    <input type="checkbox" name="autoadhesivo" id="autoadhesivo" onChange={onInputChange} value={autoadhesivo} />
                </div>
                : <></>
            }
            <div className='flex flex-col'>
                <label htmlFor="wifi" className='text-center font-bold '>Con Wifi</label>
                <input type="checkbox" name="wifi" id="wifi" onChange={onInputChange} value={wifi} />
            </div>
            

            
        </section>

        <section className='flex justify-around pt-2'>
            <Button text='Agregar' type='submit' disabled={isSaving ? 'disabled' : ''}/>
            <Button text='Salir' />
        </section>

        <div className={`${isSaving ? '' : 'hidden'}`}>
            <h1>Guardando...</h1>
        </div>
        
    </form>
  )
}
