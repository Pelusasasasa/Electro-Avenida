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
    tipoTecnologia: '',
    formatoVenta: '',
    eficienciaEnergetica: '',
    vidaUtil: '',
    cantPack: '1',
    utilidad: 0.00,

    //General
    largo: 0,
    altura: 0,
    peso: 0,
    ancho: 0,

    //Alargues
    conUSB: '242084',
    ConProteccionSobreCarga: '242084',
    ConReduccionDeRuido: '242084',
    tipoConectores: '',
    cantidadTomas: 0,
    corrienteMaxima: 0,
    largoCable: 0,

    //Emergencia
    capacidadBateria: 0,
    tiempoCarga: 0,
    cantidadLed: 0,
    incluyePila: '242084',
    incluyeBateriaRecargable: '242084',
    autonomiaMaximaHoras: '5146030',
    lumenesMaximo: '8108101',
    autonomiaMinimaHoras: '8108820',
    lumenesminimo: '8110855',
    tipoMontaje: '3964545',
    tipoPosicion: '12728631',
    encendidoAutomatico: '242084',
    indicadorCarga: '242084',
    conManija: '242084',
    botonEncendido: '242084',
    conSoporteColgar: '242084',

    //Tira led
    incluyeControladorColor: '242084',
    incluyeFuenteAlimentacion: '242084',
    cantidadDeLedPorMetro: '',
    tipoLed: '',
    potenciaPorMetro: '',
    gradoProteccion: '',

    //Proyectores
    instalacionProyector: '',
    sensorMovimiento: '242084',
    resistenteAlAgua: '242084',

    //Fotocontrol
    colorCarcasa: '',
    materialCarcasa: '',
    tipoFotocontrol: '',
    ambientesRecomendados: '',
    voltajeFotocontrol: '',




    imagenes: [],

};


export const PostPublicacion = () => {
    const { active, isSaving } = useSelector(state => state.productos);
    const { dolar } = useSelector(state => state.variables);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
         subCategories, subCategories1, subCategories2, voltaje, temperaturaLuz, colorLuz, potencia, lumenes, tipofuente, voltaje2, formState , onChanges,
        onInputChange, codigo, descripcion, codBarra, marca, costoIva, precioSujerido, stockSujerido, precio, stock, categories, utilidad,

        altura, largo, peso, ancho,

        tipoBateria, formato, forma, lugarMontaje, material, ambiente, capacidadFoco, incluyeFoco, inalamabrico, boton, incluyeControl,
        autoadhesivo, wifi, asistenteVirtual, appInteligente, eficienciaEnerg, tipoTecnologia, formatoVenta, eficienciaEnergetica, vidaUtil, cantPack,

        conUSB, ConProteccionSobreCarga, ConReduccionDeRuido, tipoConectores, cantidadTomas, corrienteMaxima, largoCable,

        capacidadBateria, tiempoCarga, cantidadLed, incluyePila, incluyeBateriaRecargable, autonomiaMaximaHoras, lumenesMaximo, autonomiaMinimaHoras, lumenesminimo, tipoMontaje, tipoPosicion, encendidoAutomatico, indicadorCarga, conManija, botonEncendido, conSoporteColgar,

        voltajeMaximoEntrada, voltajeMaximoSalida, voltajeMinimoEntrada, voltajeMinimoSalida, potenciaSalida,

        incluyeControladorColor, incluyeFuenteAlimentacion, cantidadDeLedPorMetro, tipoLed, potenciaPorMetro, gradoProteccion,

        instalacionProyector, sensorMovimiento, resistenteAlAgua,

        tipoBateriaLinterna, alcanceProyeccion, cantidadBaterias, tamanioBateria, diametro, colorLinterna, potenciaLinterna, tipoLinterna, incluyePilaLinterna, resistenteAlPolvo, esRecargable, cantidadModosLuz, duracionMaxima, tipoAlimentacion,

        colorCarcasa, materialCarcasa, tipoFotocontrol, ambientesRecomendados, voltajeFotocontrol

        
        
        } = useForm(initialForm);
    
    const [imagenes, setImagenes] = useState(null);

    //Aca lo que hacemos es usar stados para guardar la informacion de si mostramos cierto contenido o no
    const [pack, setPack] = useState(true);
    const [construccion, setConstruccion] = useState(false);
    const [focos, setFocos] = useState(false);
    const [emergencia, setEmergencia] = useState(false);
    const [fuentes, setFuentes] = useState(false);
    const [tiraLed, setTiraLed] = useState(false);
    const [proyector, setProyector] = useState(false);
    const [linterna, setLinterna] = useState(false);
    const [fotocontroles, setFotocontroles] = useState(false);


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

        setFocos(false);
        setEmergencia(false);
        setFuentes(false);
        setConstruccion(false);
        setTiraLed(false);
        setProyector(false);
        setLinterna(false);
        setFotocontroles(false);

        if(subCategories1 === 'MLA377395' || subCategories1 === 'MLA373504'){
            setFocos(true);
        };

        if(subCategories1 === 'MLA125102'){
            setEmergencia(true);
        };

        if(subCategories1 === 'MLA420350'){
            setFuentes(true);
        };

        if(subCategories1 === 'MLA388926'){
            setTiraLed(true);
        };

        if(subCategories1 === 'MLA373504'){
            setProyector(true);
        };

        if(subCategories1 === 'MLA434732'){
            setFotocontroles(true);
        }

    }, [subCategories1]);

    useEffect(() => {

        setConstruccion(false);
        setFocos(false);
        setLinterna(false);

        if (subCategories2 === 'MLA411421'){
            setConstruccion(!construccion);
        };

        if(subCategories2 === 'MLA1588' || subCategories2 === 'MLA1586'){
            setFocos(true);
        }

        if(subCategories2 === 'MLA434342'){
            setLinterna(true)
        }

    }, [subCategories2]);

    useEffect(() => {
        if (formatoVenta === '1359392'){
            setPack( !pack );
        }
    }, [formatoVenta]);

    useEffect(() => {
        if(active._id){
             onChanges({
                    precioSujerido: calcularPrecioSujerido(parseFloat(active.costo), parseFloat(active.impuestos), active.costodolar, parseFloat(dolar), formatoVenta, parseFloat(cantPack), utilidad),
                    stockSujerido: parseFloat(active.stock / cantPack),
            })
        }

    }, [cantPack]);

    useEffect(() => {
        if(active._id){
            onChanges({
                    precioSujerido: calcularPrecioSujerido(parseFloat(active.costo), parseFloat(active.impuestos), active.costodolar, parseFloat(dolar), formatoVenta, parseFloat(cantPack), utilidad),
                    stockSujerido: parseFloat(active.stock / cantPack),
            })
        };
    }, [utilidad])

    useEffect(() => {
        if (active._id) {
            listarProductoTraido();
        }
    }, [active]);

    
    const listarProductoTraido = () => {
        onChanges({
            descripcion: active.descripcion.slice(0, 60),
            costoIva: active.costodolar !== 0 ? ((parseFloat(active.costodolar) + parseFloat(active.impuestos)) * dolar).toFixed(2) :  (parseFloat(active.costo) + parseFloat(active.impuestos)).toFixed(2),
            stockSujerido: active.stock,
            marca: active.marca,
            precioSujerido: calcularPrecioSujerido(parseFloat(active.costo), parseFloat(active.impuestos), active.costodolar, parseFloat(dolar), formatoVenta, parseFloat(cantPack), utilidad)
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
         producto.utilidad = utilidad;
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
                id: 'GTIN',
                value_name: codBarra
             },
             {id: 'HIGH', value_name: `${altura} cm`},
             {id: 'WIDTH', value_name: `${ancho} cm`},
             {id: 'LENGTH', value_name: `${largo} cm`},
             {id: 'WEIGHT', value_name: `${peso} g`},
             {
                 id: 'MATERIALS',
                 value_name: material
             },
             {
                 id: 'MODEL',
                 value_name: active.cod_fabrica
             },
             {
                id: 'SALE_FORMAT',
                value_id: formatoVenta ? formatoVenta : "-1",
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
            },
            {
                id: 'VOLTAGE',
                value_name: voltaje
            },
            
            {
                id: 'WITH_WI_FI',
                value_id: wifi ? "242085" : "242084"
            },
            {
                id: 'UNITS_PER_PACK',
                value_name: cantPack
            }
         ];

         if(formState.subCategories1 === 'MLA377395'){
            producto.attributes.push(
                {id: 'LUMINOUS_FLUX', value_name: `${lumenes} lm`},
                {id: 'LIGHTING_TECHNOLOGY', value_name: tipoTecnologia},
                {id: 'ENERGY_EFFICIENCY', value_id: eficienciaEnergetica},
                {id: 'LIFE_CYCLE', value_name: `${vidaUtil} h`},
                {id: 'LIGHT_COLOR', value_id: colorLuz ? colorLuz : "-1" , value_name: colorLuz ? colorLuz : null},
                {id: 'COLOR_TEMPERATURE', value_id: temperaturaLuz ? temperaturaLuz : "-1", value_name: temperaturaLuz ? temperaturaLuz : null},
                {id: 'COMPATIBLE_SMART_APPS', value_id: appInteligente ? appInteligente : "-1", },
                {id: 'COMPATIBLE_VIRTUAL_ASSISTANTS', value_id: asistenteVirtual ? asistenteVirtual : "-1", },
                {id: 'INCLUDES_REMOTE_CONTROL', value_id: incluyeControl ? "242085" : "242084",},
            )
         };

         //CATEGORIAS REFLECTORES
         if(formState.subCategories1 === 'MLA373504'){
            producto.attributes.push(
                {id: 'LIGHT_BULB_TYPE', value_name: tipoTecnologia },
                {id: 'LUMINOUS_FLUX', value_name: `${lumenes} lm`},
                {id: 'LIFE_CYCLE', value_name: `${vidaUtil} h`},
                {id: 'LIGHT_COLOR', value_id: colorLuz ? colorLuz : "-1" , value_name: colorLuz ? colorLuz : null},
                {id: 'COLOR_TEMPERATURE', value_id: temperaturaLuz ? temperaturaLuz : "-1", value_name: temperaturaLuz ? temperaturaLuz : null},
                {id: 'FLOOD_LIGHT_MOUNTING', value_name: instalacionProyector},
                {id: 'WITH_MOTION_SENSOR', value_id: sensorMovimiento},
                {id: 'IS_WATERPROOF', value_id: resistenteAlAgua},
            );
         }

         //CATEGORIA DE LAMPARAS
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
                {id: 'LIGHT_COLOR', value_id: colorLuz ? colorLuz : "-1" , value_name: colorLuz ? colorLuz : null},

            )
         };

         //CATEGORIA DE ALARGUES
         if(formState.subCategories2 === 'MLA411421'){
            producto.attributes.push(
                {id: 'CABLE_LENGTH', value_name: `${largoCable} m`},
                {id: 'MAX_CURRENT', value_name: `${corrienteMaxima} A`},
                {id: 'OUTLETS_NUMBER', value_name: cantidadTomas},
                {id: 'PORTS_AND_CONNECTORS_TYPES', value_id: tipoConectores},
                {id: 'WITH_ELECTRICAL_NOISE_REDUCTION', value_id: ConReduccionDeRuido},
                {id: 'WITH_OVERLOAD_PROTECTION', value_id: ConProteccionSobreCarga},
                {id: 'WITH_USB', value_id: conUSB},
            );
         };

         //Categoria de emergencia
         if(formState.subCategories1 === 'MLA125102'){
            producto.attributes.push(
                {id: 'BATTERY_CAPACITY', value_name: `${capacidadBateria} mAh`},
                {id: 'BATTERY_TYPE', value_id: tipoBateria},
                {id: 'CHARGING_TIME', value_name: `${tiempoCarga} h`},
                {id: 'LED_QUANTITY', value_name: cantidadLed},
                {id: 'INCLUDES_BATTERY', value_id: incluyeBateriaRecargable},
                {id: 'INCLUDES_BATTERY', value_id: incluyePila},
                {id: 'MAXIMUM_AUTONOMY', value_id: autonomiaMaximaHoras},
                {id: 'MINIMUM_AUTONOMY', value_id: autonomiaMinimaHoras},
                {id: 'MOUNTING_TYPE', value_id: tipoMontaje},
                // {id: 'POSITION_TYPES', value_id: tipoPosicion},
                {id: 'AUTOMATIC_IGNITION', value_id: encendidoAutomatico},
                {id: 'CHARGE_INDICATOR', value_id: indicadorCarga},
                {id: 'WITH_HANDLE', value_id: conManija},
                // {id: 'WITH_HANGING_SUPPORT', value_id: conSoporteColgar},
                {id: 'WITH_ON_OFF_BUTTON', value_id: botonEncendido},
            )
         };

         if(formState.subCategories1 === 'MLA388926'){
            producto.attributes.push(
                {id: 'INCLUDES_COLOR_CONTROLLER', value_id: incluyeControladorColor},
                {id: 'INCLUDES_POWER_SUPPLY', value_id: incluyeFuenteAlimentacion},
                {id: 'LEDS_PER_METER_NUMBER', value_name: cantidadDeLedPorMetro},
                {id: 'LED_TYPE', value_name: tipoLed},
                {id: 'POWER_PER_METER', value_id: potenciaPorMetro},
                {id: 'PROTECTION_DEGREE', value_name: gradoProteccion}
            )
         };

         //Categoria de Linterna
         if(formState.subCategories2 === 'MLA434342'){
            producto.attributes.push(
                {id: 'BATTERY_TYPE', value_id: tipoBateriaLinterna},
                {id: 'BEAM_DISTANCE', value_name: `${alcanceProyeccion} m`},
                {id: 'CELL_BATTERIES_NUMBER_REQUIRED', value_name: cantidadBaterias},
                {id: 'CELL_BATTERY_SIZE', value_name: tamanioBateria},
                {id: 'DIAMETER', value_name: `${diametro} cm`},
                {id: 'FLASHLIGHT_COLOR', value_id: colorLinterna},
                {id: 'FLASHLIGHT_POWER_IN_LUMENS', value_name: `${potencia} lm`},
                {id: 'FLASHLIGHT_TYPE', value_name: tipoLinterna},
                {id: 'INCLUDES_CELL_BATTERIES', value_id: incluyePilaLinterna},
                {id: 'IS_DUST_RESISTANT', value_id: resistenteAlPolvo},
                {id: 'IS_RECHARGEABLE', value_id: esRecargable},
                {id: 'IS_WATERPROOF', value_id: resistenteAlAgua},
                {id: 'LIGHT_SWITCH_MODES_NUMBER', value_name: cantidadModosLuz},
                {id: 'MAX_RUNTIME', value_name: duracionMaxima},
                {id: 'POWER_SUPPLY_TYPE', value_name: tipoAlimentacion}
            )
         };

         if(formState.subCategories1 === 'MLA434732'){
            producto.attributes.push(
                {id: 'HOUSING_COLOR', value_name: colorCarcasa},
                {id: 'HOUSING_MATERIAL', value_name: materialCarcasa},
                {id: 'PHOTOCONTROL_TYPE', value_name: tipoFotocontrol},
                {id: 'RECOMMENDED_AMBIENTS', value_name: ambientesRecomendados},
                {id: 'VOLTAJE', value_name: voltajeFotocontrol}
            )
         }
        
        dispatch( postPublicaciones(producto) );
        console.log(producto)
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
                <input type="text" name="codBarra" onChange={onInputChange} value={codBarra} id="codBarra" />
            </div>

            <div className='flex flex-col'>
                <label htmlFor="marca" className='text-center font-bold '>Marca</label>
                <input type="text" name="marca" onChange={onInputChange} value={marca} id="marca" />
            </div>
        </section>

        <section className='grid grid-cols-3 gap-3 m-2'>

            <div className='flex flex-col'>
                <label htmlFor="utilidad" className='text-center font-bold '>Utilidad</label>
                <input type="number" className='self-center' name="utilidad" id="utilidad" value={utilidad} onChange={onInputChange} />
            </div>

            <div className='flex flex-col'>
                <label htmlFor="formatoVenta" className='text-center font-bold '>Formato de Venta</label>
                <select name="formatoVenta" id="formatoVenta" onChange={onInputChange} value={formatoVenta}>
                    <option value="-1">N/A</option>
                    <option value="1359391">Unidad</option>
                    <option value="1359392">Pack</option>
                </select>
            </div>
            <div className='flex flex-col'>
                <label htmlFor="cantPack" className='text-center font-bold '>Unidad</label>
                <input type="number" className='w-16 self-center' name="cantPack" id="cantPack" value={cantPack} disabled={pack} onChange={onInputChange} />
            </div>

        </section>

        <section id='costoIva' className='grid grid-cols-3 gap-3 m-2'>
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
                    <option value="RGB">RGB</option>
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
                <label htmlFor="material" className='text-center font-bold '>Material</label>
                <input type="text" name="material" id="material" onChange={onInputChange} value={material} />
            </div>
            
            <div className='flex flex-col'>
                <label htmlFor="potencia" className='text-center font-bold '>Potencia</label>
                <input type="number" name="potencia" id="potencia" onChange={onInputChange} value={potencia} />
            </div>

            <div className='flex flex-col'>
                <label htmlFor="altura" className='text-center font-bold '>Altura</label>
                <input type="number" name="altura" id="altura" onChange={onInputChange} value={altura} />
            </div>
            
            <div className='flex flex-col'>
                <label htmlFor="largo" className='text-center font-bold '>Largo</label>
                <input type="number" name="largo" id="largo" onChange={onInputChange} value={largo} />
            </div>

            <div className='flex flex-col'>
                <label htmlFor="ancho" className='text-center font-bold '>Ancho</label>
                <input type="number" name="ancho" id="ancho" onChange={onInputChange} value={ancho} />
            </div>

            <div className='flex flex-col'>
                <label htmlFor="peso" className='text-center font-bold '>Peso</label>
                <input type="number" name="peso" id="peso" onChange={onInputChange} value={peso} />
            </div>
            
        </section>

        <section id='focos' className={`grid grid-cols-4 gap-3 m-2 ${focos ? '' : 'hidden'}`}>
            <div className='flex flex-col'>
                <label htmlFor="lumenes" className='text-center font-bold '>Flujo Luminoso</label>
                <input type="number" name="lumenes" id="lumenes" onChange={onInputChange} value={lumenes} />
            </div>

            <div className='flex flex-col'>
                <label htmlFor="tipoTecnologia" className='text-center font-bold '>Tecnologia de iluminación</label>
                <select name="tipoTecnologia" id="tipoTecnologia" value={tipoTecnologia} onChange={onInputChange}>
                    <option value="null">N/A</option>
                    <option value="LED">LED</option>
                </select>
            </div>
            
            <div className='flex flex-col'>
                <label htmlFor="tipofuente" className='text-center font-bold '>Tipo Fuente</label>
                <select name="tipofuente" id="tipofuente" value={tipofuente} onChange={onInputChange}>
                    <option value="null">N/A</option>
                    <option value="7387210">LED</option>
                    <option value="3137301">INCANDESENTE</option>
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
                <label htmlFor="vidaUtil" className='text-center font-bold '>Vida Util</label>
                <input type="number" name="vidaUtil" id="vidaUtil" onChange={onInputChange} value={vidaUtil} />
            </div>

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

            <div className='flex flex-col'>
                <label htmlFor="ambiente" className='text-center font-bold '>Ambiente</label>
                <input type="text" name="ambiente" id="ambiente" onChange={onInputChange} value={ambiente} />
            </div>

                <div className='flex flex-col'>
                    <label htmlFor="capacidadFoco" className='text-center font-bold '>Capacidad Foco</label>
                    <input type="number" name="capacidadFoco" id="capacidadFoco" onChange={onInputChange} value={capacidadFoco} />
                </div>
            

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
                <label htmlFor="appInteligente" className='text-center font-bold '>Eficiencia Energetica</label>
                <select name="eficienciaEnergetica" id="eficienciaEnergetica" onChange={onInputChange} value={eficienciaEnergetica}>
                    <option value="-1">N/A</option>
                    <option value="33344207">A+</option>
                    <option value="33344208">A</option>
                </select>
            </div>

            <div className='flex flex-col'>
                <label htmlFor="appInteligente" className='text-center font-bold '>App Inteligente</label>
                <input type="text" name="appInteligente" id="appInteligente" onChange={onInputChange} value={appInteligente} />
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

        <section id='construccion' className={`grid grid-cols-4 gap-3 m-2 ${construccion ? '' : 'hidden'} `}>

            <div className='flex flex-col'>
                <label htmlFor="largoCable" className='text-center font-bold '>Largo Del Cable</label>
                <input type='number' name="largoCable" id="largoCable" value={largoCable} onChange={onInputChange} />
            </div>

            <div className='flex flex-col'>
                <label htmlFor="corrienteMaxima" className='text-center font-bold '>Corriente Maxima</label>
                <input type='number' name="corrienteMaxima" id="corrienteMaxima" value={corrienteMaxima} onChange={onInputChange} />
            </div>

            <div className='flex flex-col'>
                <label htmlFor="cantidadTomas" className='text-center font-bold '>Cantidad de Tomas</label>
                <input type='number' name="cantidadTomas" id="cantidadTomas" value={cantidadTomas} onChange={onInputChange} />
            </div>

            <div className='flex flex-col'>
                <label htmlFor="ConProteccionSobreCarga" className='text-center font-bold '>Con Proteccion Sobre Carga</label>
                <select name="ConProteccionSobreCarga" id="ConProteccionSobreCarga" value={ConProteccionSobreCarga} onChange={onInputChange}>
                    <option value="242084">No</option>
                    <option value="242085">Si</option>
                </select>
            </div>

            <div className='flex flex-col'>
                <label htmlFor="tipoConectores" className='text-center font-bold '>Tipo Conectores</label>
                <select name="tipoConectores" id="tipoConectores" value={tipoConectores} onChange={onInputChange}>
                    <option value="26059155">Espiga Plana</option>
                </select>
            </div>

            <div className='flex flex-col'>
                <label htmlFor="ConReduccionDeRuido" className='text-center font-bold '>Con Reduccion de Ruido Electrico</label>
                <select name="ConReduccionDeRuido" id="ConReduccionDeRuido" value={ConReduccionDeRuido} onChange={onInputChange}>
                    <option value="242084">No</option>
                    <option value="242085">Si</option>
                </select>
            </div>

            <div className='flex flex-col'>
                <label htmlFor="conUSB" className='text-center font-bold '>Con USB</label>
                <select name="conUSB" id="conUSB" value={conUSB} onChange={onInputChange}>
                    <option value="242084">No</option>
                    <option value="242085">Si</option>
                </select>
            </div>

        </section>

        <section id='emergencia' className={`grid grid-cols-4 gap-3 m-2 ${emergencia ? '' : 'hidden'} `}>

            <div className='flex flex-col'>
                <label htmlFor="capacidadBateria" className='text-center font-bold '>Capacidad de bateria</label>
                <input type='number' name="capacidadBateria" id="capacidadBateria" value={capacidadBateria} onChange={onInputChange} />
            </div>

            <div className='flex flex-col'>
                <label htmlFor="tiempoCarga" className='text-center font-bold '>Tiempo de carga de la  bateria</label>
                <select type='number' name="tiempoCarga" id="tiempoCarga" value={tiempoCarga} onChange={onInputChange} >
                    <option value="8889386">3 H</option>
                    <option value="8108820">4 H</option>
                    <option value="5146030">8 H</option>
                </ select>
            </div>

            <div className='flex flex-col'>
                <label htmlFor="cantidadLed" className='text-center font-bold '>Cantidad de Leds</label>
                <input type='number' name="cantidadLed" id="cantidadLed" value={cantidadLed} onChange={onInputChange} />
            </div>

            <div className='flex flex-col'>
                <label htmlFor="incluyePila" className='text-center font-bold '>Incluye Pila</label>
                <select name="incluyePila" id="incluyePila" onChange={onInputChange} value={incluyePila}>
                    <option value="242084">No</option>
                    <option value="242085">Si</option>
                </select>
            </div>

            <div className='flex flex-col'>
                <label htmlFor="incluyeBateriaRecargable" className='text-center font-bold '>Incluye Bateria Recargable</label>
                <select name="incluyeBateriaRecargable" id="incluyeBateriaRecargable" onChange={onInputChange} value={incluyeBateriaRecargable}>
                    <option value="242084">No</option>
                    <option value="242085">Si</option>
                </select>
            </div>

            <div className='flex flex-col'>
                <label htmlFor="autonomiaMaximaHoras" className='text-center font-bold '>Autonomia maxima de horas</label>
                <select name="autonomiaMaximaHoras" id="autonomiaMaximaHoras" onChange={onInputChange} value={autonomiaMaximaHoras}>
                    <option value="8108820">4 H</option>
                    <option value="5146030">8 H</option>
                </select>
            </div>

            <div className='flex flex-col'>
                <label htmlFor="autonomiaMinimaHoras" className='text-center font-bold '>Autonomia minima de horas</label>
                <select name="autonomiaMinimaHoras" id="autonomiaMinimaHoras" onChange={onInputChange} value={autonomiaMinimaHoras}>
                     <option value="8108820">4 H</option>
                    <option value="5146030">8 H</option>
                </select>
            </div>

            <div className='flex flex-col'>
                <label htmlFor="lumenesMaximo" className='text-center font-bold '>Lumenes Maximo</label>
                <select name="lumenesMaximo" id="lumenesMaximo" onChange={onInputChange} value={lumenesMaximo}>
                     <option value="8110855">50 LM</option>
                    <option value="8108101">100 LM</option>
                </select>
            </div>

            <div className='flex flex-col'>
                <label htmlFor="lumenesminimo" className='text-center font-bold '>Lumenes minimo</label>
                <select name="lumenesminimo" id="lumenesminimo" onChange={onInputChange} value={lumenesminimo}>
                     <option value="8110855">50 LM</option>
                    <option value="8108101">100 LM</option>
                </select>
            </div>

            <div className='flex flex-col'>
                <label htmlFor="tipoMontaje" className='text-center font-bold '>Tipo Montaje</label>
                <select name="tipoMontaje" id="tipoMontaje" onChange={onInputChange} value={tipoMontaje}>
                     <option value="3964545">De Pared</option>
                </select>
            </div>

            <div className='flex flex-col'>
                <label htmlFor="tipoPosicion" className='text-center font-bold '>Tipo Posicion</label>
                <select name="tipoPosicion" id="tipoPosicion" onChange={onInputChange} value={tipoPosicion}>
                     <option value="12728631">Vertical u Horizontal</option>
                </select>
            </div>

               <div className='flex flex-col'>
                    <label htmlFor="encendidoAutomatico" className='text-center font-bold '>Encendido automarico</label>
                    <select name="encendidoAutomatico" id="encendidoAutomatico" onChange={onInputChange} value={encendidoAutomatico}>
                        <option value="242084">No</option>
                        <option value="242085">Si</option>
                    </select>
                </div>

               <div className='flex flex-col'>
                    <label htmlFor="indicadorCarga" className='text-center font-bold '>Indicador de Carga</label>
                    <select name="indicadorCarga" id="indicadorCarga" onChange={onInputChange} value={indicadorCarga}>
                        <option value="242084">No</option>
                        <option value="242085">Si</option>
                    </select>
                </div>

               <div className='flex flex-col'>
                    <label htmlFor="conManija" className='text-center font-bold '>Con Manija</label>
                    <select name="conManija" id="conManija" onChange={onInputChange} value={conManija}>
                        <option value="242084">No</option>
                        <option value="242085">Si</option>
                    </select>
                </div>

            <div className='flex flex-col'>
                <label htmlFor="botonEncendido" className='text-center font-bold '>Boton de encendido</label>
                <select name="botonEncendido" id="botonEncendido" onChange={onInputChange} value={botonEncendido}>
                    <option value="242084">No</option>
                    <option value="242085">Si</option>
                </select>
            </div>

            <div className='flex flex-col'>
                <label htmlFor="conSoporteColgar" className='text-center font-bold '>Con Soporte para Colgar</label>
                <select name="conSoporteColgar" id="conSoporteColgar" onChange={onInputChange} value={conSoporteColgar}>
                    <option value="242084">No</option>
                    <option value="242085">Si</option>
                </select>
            </div>

        </section>

        <section id='fuentes' className={`grid grid-cols-4 gap-3 m-2 ${fuentes ? '' : 'hidden'} `}>

            <div className='flex flex-col'>
                <label htmlFor="voltajeMaximoEntrada" className='text-center font-bold '>Voltaje Maximo de Entrada</label>
                <select type='number' name="voltajeMaximoEntrada" id="voltajeMaximoEntrada" value={voltajeMaximoEntrada} onChange={onInputChange} >
                    <option value="18114370">12V</option>
                    <option value="">110V</option>
                    <option value="17195572">220V</option>
                </select>
            </div>

            <div className='flex flex-col'>
                <label htmlFor="voltajeMinimoEntrada" className='text-center font-bold '>Voltaje Minimo de Entrada</label>
                <select type='number' name="voltajeMinimoEntrada" id="voltajeMinimoEntrada" value={voltajeMinimoEntrada} onChange={onInputChange} >
                    <option value="18114370">12V</option>
                    <option value="">110V</option>
                    <option value="17195572">220V</option>
                </select>
            </div>

            <div className='flex flex-col'>
                <label htmlFor="voltajeMaximoSalida" className='text-center font-bold '>Voltaje Maximo de Salida</label>
                <select type='number' name="voltajeMaximoSalida" id="voltajeMaximoSalida" value={voltajeMaximoSalida} onChange={onInputChange} >
                    <option value="18114370">12V</option>
                    <option value="17195572">220V</option>
                </select>
            </div>

            <div className='flex flex-col'>
                <label htmlFor="voltajeMinimoSalida" className='text-center font-bold '>Voltaje Minimo de Salida</label>
                <select type='number' name="voltajeMinimoSalida" id="voltajeMinimoSalida" value={voltajeMinimoSalida} onChange={onInputChange}>
                    <option value="18114370">12V</option>
                    <option value="17195572">220V</option>
                </select>
            </div>

            <div className='flex flex-col'>
                <label htmlFor="potenciaSalida" className='text-center font-bold '>Potencia maxima de Salida</label>
                <select name="potenciaSalida" id="potenciaSalida" value={potenciaSalida} onChange={onInputChange}>
                    <option value="">120 W</option>
                    <option value="">150 W</option>
                    <option value="2126733">250 W</option>
                </select>
            </div>

        </section>

        <section id='tiraLed' className={`grid grid-cols-4 gap-3 m-2 ${tiraLed ? '' : 'hidden'} `}>

            <div className='flex flex-col'>
                <label htmlFor="incluyeControladorColor" className='text-center font-bold '>Incluye Control Remoto Color</label>
                <select type='number' name="incluyeControladorColor" id="incluyeControladorColor" value={incluyeControladorColor} onChange={onInputChange} >
                    <option value="242084">No</option>
                    <option value="242085">Si</option>
                </select>
            </div>

            <div className='flex flex-col'>
                <label htmlFor="incluyeFuenteAlimentacion" className='text-center font-bold '>Incluye fuente de Alimentacion</label>
                <select name="incluyeFuenteAlimentacion" id="incluyeFuenteAlimentacion" value={incluyeFuenteAlimentacion} onChange={onInputChange} >
                    <option value="242084">No</option>
                    <option value="242085">Si</option>
                </select>
            </div>

            <div className='flex flex-col'>
                <label htmlFor="cantidadDeLedPorMetro" className='text-center font-bold '>Cantidad de Led Por Metro</label>
                <input type='number' name="cantidadDeLedPorMetro" id="cantidadDeLedPorMetro" value={cantidadDeLedPorMetro} onChange={onInputChange} />
            </div>

            <div className='flex flex-col'>
                <label htmlFor="tipoLed" className='text-center font-bold '>Tipo Led (5050)</label>
                <input type='number' name="tipoLed" id="tipoLed" value={tipoLed} onChange={onInputChange} />
                
            </div>

            <div className='flex flex-col'>
                <label htmlFor="potenciaPorMetro" className='text-center font-bold '>Potencia Por Metro</label>
                <select name="potenciaPorMetro" id="potenciaPorMetro" value={potenciaPorMetro} onChange={onInputChange}>
                    <option value="154354">15 W</option>
                    <option value="154354">30 W</option>
                    <option value="154354">48 W</option>
                </select>
            </div>

            <div className='flex flex-col'>
                <label htmlFor="gradoProteccion" className='text-center font-bold '>Grado Proteccion</label>
                <input name="gradoProteccion" id="gradoProteccion" value={gradoProteccion} onChange={onInputChange} />
                
            </div>

        </section>

        <section id='proyector' className={`grid grid-cols-4 gap-3 m-2 ${proyector ? '' : 'hidden'} `}>

            <div className='flex flex-col'>
                <label htmlFor="instalacionProyector" className='text-center font-bold '>Modo De Instalacion (MONTABLE)</label>
                <input type='text' name="instalacionProyector" id="instalacionProyector" value={instalacionProyector} onChange={onInputChange} />
            </div>

            <div className='flex flex-col'>
                <label htmlFor="sensorMovimiento" className='text-center font-bold '>Sensor de Movimiento</label>
                <select name="sensorMovimiento" id="sensorMovimiento" value={sensorMovimiento} onChange={onInputChange}>
                    <option value="242084">No</option>
                    <option value="242085">Si</option>
                </select>
            </div>

            <div className='flex flex-col'>
                <label htmlFor="resistenteAlAgua" className='text-center font-bold '>Resistente al Agua</label>
                <select name="resistenteAlAgua" id="resistenteAlAgua" value={resistenteAlAgua} onChange={onInputChange}>
                    <option value="242084">No</option>
                    <option value="242085">Si</option>
                </select>
            </div>

        

        </section>

        <section id='linterna' className={`grid grid-cols-4 gap-3 m-2 ${linterna ? '' : 'hidden'} `}>

            <div className='flex flex-col'>
                <label htmlFor="tipoBateriaLinterna" className='text-center font-bold '>Tipo de bateria (AAA)</label>
                <select name="tipoBateriaLinterna" id="tipoBateriaLinterna" value={tipoBateriaLinterna} onChange={onInputChange}>
                    <option value="6073399">AAA</option>
                </select>
            </div>

            <div className='flex flex-col'>
                <label htmlFor="alcanceProyeccion" className='text-center font-bold '>Tipo de bateria (AAA)</label>
                <input type="text" name="alcanceProyeccion" id="alcanceProyeccion" onChange={onInputChange} value={alcanceProyeccion} />
            </div>

            <div className='flex flex-col'>
                <label htmlFor="cantidadBaterias" className='text-center font-bold '>Cantidad de Baterias</label>
                <input type="text" name="cantidadBaterias" id="cantidadBaterias" onChange={onInputChange} value={cantidadBaterias} />
            </div>

            <div className='flex flex-col'>
                <label htmlFor="tamanioBateria" className='text-center font-bold '>Tamaño de las Baterias</label>
                <input type="text" name="tamanioBateria" id="tamanioBateria" onChange={onInputChange} value={tamanioBateria} />
            </div>

            <div className='flex flex-col'>
                <label htmlFor="diametro" className='text-center font-bold '>Diametro</label>
                <input type="text" name="diametro" id="diametro" onChange={onInputChange} value={diametro} />
            </div>

            <div className='flex flex-col'>
                <label htmlFor="colorLinterna" className='text-center font-bold '>Color de la linterna</label>
                <select name="colorLinterna" id="colorLinterna" value={colorLinterna} onChange={onInputChange}>
                    <option value="6073399">Negro</option>
                </select>
            </div>

            <div className='flex flex-col'>
                <label htmlFor="potenciaLinterna" className='text-center font-bold '>Potencia de la Linterna</label>
                <input type="text" name="potenciaLinterna" id="potenciaLinterna" onChange={onInputChange} value={potenciaLinterna} />
            </div>

            <div className='flex flex-col'>
                <label htmlFor="tipoLinterna" className='text-center font-bold '>Tipo de Linterna</label>
                <input type="text" name="tipoLinterna" id="tipoLinterna" onChange={onInputChange} value={tipoLinterna} />
            </div>

            <div className='flex flex-col'>
                <label htmlFor="incluyePilaLinterna" className='text-center font-bold '>Diametro</label>
                <select name="incluyePilaLinterna" id="incluyePilaLinterna" value={incluyePilaLinterna} onChange={onInputChange}>
                    <option value="242084">No</option>
                    <option value="242085">Si</option>
                </select>
            </div>

            <div className='flex flex-col'>
                <label htmlFor="resistenteAlPolvo" className='text-center font-bold '>Es Resistente al Polvo</label>
                <select name="resistenteAlPolvo" id="resistenteAlPolvo" value={resistenteAlPolvo} onChange={onInputChange}>
                    <option value="242084">No</option>
                    <option value="242085">Si</option>
                </select>
            </div>

            <div className='flex flex-col'>
                <label htmlFor="esRecargable" className='text-center font-bold '>Es Recargable</label>
                <select name="esRecargable" id="esRecargable" value={esRecargable} onChange={onInputChange}>
                    <option value="242084">No</option>
                    <option value="242085">Si</option>
                </select>
            </div>


            <div className='flex flex-col'>
                <label htmlFor="resistenteAlAgua" className='text-center font-bold '>Es Resistente Al Agua</label>
                <select name="resistenteAlAgua" id="resistenteAlAgua" value={resistenteAlAgua} onChange={onInputChange}>
                    <option value="242084">No</option>
                    <option value="242085">Si</option>
                </select>
            </div>

           <div className='flex flex-col'>
                <label htmlFor="cantidadModosLuz" className='text-center font-bold '>Cantidad de modos de luz</label>
                <input type="text" name="cantidadModosLuz" id="cantidadModosLuz" onChange={onInputChange} value={cantidadModosLuz} />
            </div>

            <div className='flex flex-col'>
                <label htmlFor="duracionMaxima" className='text-center font-bold '>Duracion Maxima</label>
                <input type="text" name="duracionMaxima" id="duracionMaxima" onChange={onInputChange} value={duracionMaxima} />
            </div>

            <div className='flex flex-col'>
                <label htmlFor="tipoAlimentacion" className='text-center font-bold '>Tipo de Alimentacion</label>
                <input type="text" name="tipoAlimentacion" id="tipoAlimentacion" onChange={onInputChange} value={tipoAlimentacion} />
            </div>
        

        </section>

        <section id='fotocontroles' className={`grid grid-cols-4 gap-3 m-2 ${fotocontroles ? '' : 'hiddne'}`}>
            <div className='flex flex-col'>
                <label htmlFor="colorCarcasa" className='text-center font-bold '>Color de la carcasa</label>
                <input type="text" name="colorCarcasa" id="colorCarcasa" onChange={onInputChange} value={colorCarcasa} />
            </div>

            <div className='flex flex-col'>
                <label htmlFor="materialCarcasa" className='text-center font-bold '>Material de la carcasa</label>
                <input type="text" name="materialCarcasa" id="materialCarcasa" onChange={onInputChange} value={materialCarcasa} />
            </div>

            <div className='flex flex-col'>
                <label htmlFor="tipoFotocontrol" className='text-center font-bold '>Tipo de fotocontrol</label>
                <input type="text" name="tipoFotocontrol" id="tipoFotocontrol" onChange={onInputChange} value={tipoFotocontrol} />
            </div>

            <div className='flex flex-col'>
                <label htmlFor="ambientesRecomendados" className='text-center font-bold '>Ambientes Recomendados</label>
                <input type="text" name="ambientesRecomendados" id="ambientesRecomendados" onChange={onInputChange} value={ambientesRecomendados} />
            </div>

            <div className='flex flex-col'>
                <label htmlFor="voltajeFotocontrol" className='text-center font-bold '>Voltaje del fotocontrol</label>
                <input type="text" name="voltajeFotocontrol" id="voltajeFotocontrol" onChange={onInputChange} value={voltajeFotocontrol} />
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
