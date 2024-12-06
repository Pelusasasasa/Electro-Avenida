import axios from 'axios';

const seller_id = '231090073';
const client_id = '8351426981367452';
const aux = 'https://api.mercadolibre.com/';
const client_secret = 'n03VlrPoBnTyRmGDtDusOQwuu7qaNpHv';
const code = 'TG-670e5faf324be700011ea691-231090073'
const refresh_token = "TG-670e60957e88f500012c13e8-231090073"
const redirect_uri = 'https://www.electro-avenida.com.ar/';
const URL = process.env.REACT_APP_URL;
const gananciaML = 25;
const porcentajeDescuentoML = 0.54;
const envio = 28000;
const primerCostoFijo = 12000;
const segundoCostoFijo = 28000;
const valorPrimerCostoFijo = 900;
const valorSegundoCostoFijo = 1800;

export const actualizarToken = async() => {
    const numeros = (await axios.get(`${URL}tipoVenta`)).data;
    
    numeros.autorizacionML = await obtenerAccessToken();
    // await axios.put(`${URL}tipoVenta`, numeros);
};

export const buscarVariacionesProducto = async(codigo) => {
    const numeros = (await axios.get(`${URL}tipoVenta`)).data;
    const authorizacion = numeros.autorizacionML;
    try {
        const res = (await axios.get(`${aux}items/${codigo}/variations`,{
            headers: {
                'Authorization': `Bearer ${authorizacion}`
            }
        })).data;

        return res
    } catch (error) {
        return error
    }
};

export const calcularPrecioSujerido = (costo, impuesto) => {
    const costoFinal = costo + impuesto;
    let utilidad = costoFinal + (costoFinal * gananciaML / 100);
    let descuentoML = (utilidad / porcentajeDescuentoML);

    let costoEnvio = 0;
    let costoFijo = 0;

    //Vemos cuanto nos cobran del envio en mercado libre dependiendo de la utilidad
    if (descuentoML > envio){
        costoEnvio = 6779;
    }else{
        costoEnvio = 0;
    };

    //Vemos cuanto nos descuentan por el costo fijo dependiendo de el valor de la utilidad
    if (descuentoML < primerCostoFijo){
        costoFijo = valorPrimerCostoFijo;
    }else if(descuentoML < segundoCostoFijo){
        costoFijo = valorSegundoCostoFijo
    }else{
        costoFijo = 0;
    };

    let precioML = 0;
    precioML = descuentoML + costoEnvio + costoFijo
    return precioML.toFixed(2);
};

export const modificarVariacionProducto = async(codigoML, codigoVaration, precioML, stockML) => {
    const numeros = (await axios.get(`${URL}tipoVenta`)).data;
    const authorizacion = numeros.autorizacionML;

    try {
        const res = (await axios.put(`${aux}items/${codigoML}/variations/${codigoVaration}`,
            {
                price: precioML,
                available_quantity: stockML
            },
            {
                headers: {
                    'Authorization': `Bearer ${authorizacion}`,
                    'Content-Type': 'application/json',
                    "Accept": 'application/json'
                }
            }
        )).data;
        return res
    } catch (error) {
        return error
    }
};

export const modificarPrecioYStockPorIdDeProducto = async(codigo, precio, stock) => {
    const numeros = (await axios.get(`${URL}tipoVenta`)).data;
    const authorizacion = numeros.autorizacionML;
    try {
        // await axios.put(`${aux}items/${codigo}`,
        //     {
        //         status: 'paused'
        //     },
        //     {
        //         headers: {
        //             'Authorization': `Bearer ${authorizacion}`
        //         }
        //     }
        // )
        const res = (await axios.put(`${aux}items/${codigo}`,
            {
                price: precio,
                available_quantity: stock
            },
            {
                headers: {
                    'Authorization': `Bearer ${authorizacion}`
                }
            }
        )).data;
        console.log(res.data.response.data)
        return res;
    } catch (error) {
        console.log(error.response.data)
    }
};

export const obtenerAccessToken = async() => {
  
   try {
     const respuesta = await axios.post(`${aux}oauth/token`, {
      grant_type: 'refresh_token',
      client_id,
      client_secret,
      redirect_uri,
      refresh_token,
      code,
    },
    {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    }
);
    return respuesta.data.access_token;
  } catch (error) {
    console.error('Error obteniendo el token:', error.response.data);
  }
};

export const obtenerInformacionUsuario = async() => {
    const numeros = (await axios.get(`${URL}tipoVenta`)).data;
    const autherizacion = numeros.autorizacionML;
  try {
    const res = (await axios.get(`${aux}users/me`, {
      headers:{
        'Authorization': `Bearer ${autherizacion}`
      }
    })).data;

  return res
  } catch (error) {
    return 'error'
  }
};

export const publicarML = async(elem) => {
    const numeros = (await axios.get(`${URL}tipoVenta`)).data;
    const autherizacion = numeros.autorizacionML;

    try {
        const res = (await axios.post(`${aux}items`, elem, {
            headers: {
                'Authorization': `Bearer ${autherizacion}`
            }
        })).data;
        return res;
    } catch (error) {
        console.log(error)
        return error
        
    }
};

export const subirImagenes = async(files) => {
    console.log(files)

    const res = (await axios.post(`${URL}mercadoLibre/imagenes`, files)).data;
    console.log(res)
};

export const traerConsultas = async() => {
    const numeros = (await axios.get(`${URL}tipoVenta`)).data;
    const authorizacion = numeros.autorizacionML;
    try {
        const consultas = (await axios.get(`${aux}/questions/search?api_version=4&seller_id=${Selection}`, {
            headers:{
                Authorization: `Bearer ${authorizacion}`
            }
        }))
        return consultas
    } catch (error) {
        return error
    }
};

export const traerCategorias = async() => {
    const categorias = (await axios.get(`${aux}sites/MLA/categories`)).data;

    return categorias;
};

export const traerSubCategorias = async(id) => {
    
    if (id){
        const subCategorias = (await axios.get(`${aux}categories/${id}`)).data;

        return subCategorias.children_categories;
    }

    return [];
};

