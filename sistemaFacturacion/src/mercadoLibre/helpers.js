const client_id = '8351426981367452';
const aux = 'https://api.mercadolibre.com/';
const client_secret = 'n03VlrPoBnTyRmGDtDusOQwuu7qaNpHv';
const code = 'TG-670e5faf324be700011ea691-231090073'
const refresh_token = "TG-670e60957e88f500012c13e8-231090073"
const redirect_uri = 'https://www.electro-avenida.com.ar/';

async function obtenerInformacionUsuario(autherizacion) {
  try {
    const res = (await axios.get(`${aux}users/me`, {
      headers:{
        'Authorization': `Bearer ${autherizacion}`
      }
    })).data;

  return res
  } catch (error) {
    console.log(error)
  }
};

const devolveDireccion = async(id, autherizacion) => {
    try {
        const res = (await axios.get(`${aux}/users/${id}/addresses`,{
            headers: {
                'Authorization': `Bearer ${autherizacion}`
            }
        })).data;
        console.log(res)
    }  catch (error) {
        console.log(error)
    }
};

const buscarMilItems = async() => {
    try {
        const res = (await axios.get(`${aux}users/${id}/items/search?search_type=scan`,
            {headers: {
                'Authorization': `Bearer ${autherizacion}`
            }}
        )).data;
        return res
    } catch (error) {
        return error
    }
};

const filtrarPorTitle = async(id, authorizacion, text) => {
    try {
        const res = (await axios.get(`${aux}users/${id}/items/search?q=${text}`,
            {
                 headers: {
                    'Authorization': `Bearer ${authorizacion}`
                }
            }
            
        )).data;

        return res;
    }catch (error) {
        console.log(error)
    }
}

const buscarIDDeProductoPorSKU = async(id, authorizacion, sku) => {
    try{
        const res = (await axios.get(`${aux}users/${id}/items/search?seller_sku=${sku}`,{
            headers: {
            'Authorization': `Bearer ${authorizacion}`
            }
        })).data.results[0];

        return res;
    }catch(error){
        console.log(error);
    }
};

const buscarinfoProductoPorId = async(authorizacion, codigo) => {

    try {
        const res = (await axios.get(`${aux}items/${codigo}`,{
            headers: {
                'Authorization': `Bearer ${authorizacion}`
            }
        })).data;
        return res
    } catch (error) {
        console.log(error)
    }
};

const buscarVariacionesProducto = async(authorizacion, codigo) => {
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

const modificarVariacionProducto = async(authorizacion, codigoML, codigoVaration) => {
    try {
        const res = (await axios.get(`${aux}items/${codigoML}/variations/${codigoVaration}`,
            {
                price: precioML,
                available_quantity: stockML
            },
            {
                headers: {
                    'Authorization': `Bearer ${authorizacion}`
                }
            }
        )).data;
        return res
    } catch (error) {
        return error
    }
};

const modificarPrecioPorIdDeProducto = async(authorizacion, codigo, precio) => {
    try {
        const res = (await axios.put(`${aux}items/${codigo}`,
            {
                price: precio
            },
            {
                headers: {
                    'Authorization': `Bearer ${authorizacion}`
                }
            }
        )).data;
        return res;
    } catch (error) {
        console.log(error)
    }
};

const modificarPrecioYStockPorIdDeProducto = async(authorizacion, codigo, precio, stock) => {
    try {
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
        return res;
    } catch (error) {
        console.log(error)
    }
};

const obtenerAccessToken = async() => {
  
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

module.exports = {
    buscarIDDeProductoPorSKU,
    buscarinfoProductoPorId,
    buscarMilItems,
    devolveDireccion,
    filtrarPorTitle,
    modificarPrecioPorIdDeProducto,
    modificarPrecioYStockPorIdDeProducto,
    obtenerInformacionUsuario,
    obtenerAccessToken,
    buscarVariacionesProducto,
    modificarVariacionProducto
};