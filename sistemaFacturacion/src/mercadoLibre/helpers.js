async function obtenerInformacionUsuario(autherizacion) {
  console.log(aux)
  try {
    const res = (await axios.get(`${aux}users/me`, {
      headers:{
        'Authorization': `Bearer ${autherizacion}`
      }
    })).data;

  console.log(res)
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

module.exports = {
    buscarIDDeProductoPorSKU,
    buscarinfoProductoPorId,
    buscarMilItems,
    devolveDireccion,
    filtrarPorTitle,
    modificarPrecioPorIdDeProducto,
    modificarPrecioYStockPorIdDeProducto,
    obtenerInformacionUsuario,
};