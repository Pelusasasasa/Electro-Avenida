import axios from 'axios';

const client_id = '8351426981367452';
const aux = 'https://api.mercadolibre.com/';
const client_secret = 'n03VlrPoBnTyRmGDtDusOQwuu7qaNpHv';
const code = 'TG-670e5faf324be700011ea691-231090073'
const refresh_token = "TG-670e60957e88f500012c13e8-231090073"
const redirect_uri = 'https://www.electro-avenida.com.ar/';
const URL = process.env.REACT_APP_URL

export const actualizarToken = async() => {
    const numeros = (await axios.get(`${URL}tipoVenta`)).data;

    numeros.autorizacionML = await obtenerAccessToken();
    await axios.put(`${URL}tipoVenta`, numeros);
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

export const obtenerAccessToken = async() => {
  
   try {
     const respuesta = await axios.post(`${aux}oauth/token`, {
      grant_type: 'refresh_token',
      client_id,
      client_secret,
      redirect_uri,
      refresh_token,
      code,
    });
    console.log(respuesta.data)
    console.log(respuesta.data.access_token);
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

