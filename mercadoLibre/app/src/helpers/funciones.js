import axios from 'axios';

const client_id = '8351426981367452';
const aux = 'https://api.mercadolibre.com/';
const client_secret = 'n03VlrPoBnTyRmGDtDusOQwuu7qaNpHv';
const code = 'TG-670e5faf324be700011ea691-231090073'
const refresh_token = "TG-670e60957e88f500012c13e8-231090073"
const redirect_uri = 'https://www.electro-avenida.com.ar/';
const URL = process.env.REACT_APP_URL;
const gananciaML = 10;
const porcentajeDescuentoML = 0.65;
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
    const {authorizacion} = (await axios.get(`${URL}codigoML`)).data;
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

export const calcularPrecioSujerido = (costo, impuesto, costodolar, dolar, cant) => {
        const costoFinal = costodolar !== 0 ? (costodolar + impuesto) * dolar  :  costo + impuesto;
        let utilidad = costoFinal + (costoFinal * gananciaML / 100);
        let descuentoML = (utilidad / porcentajeDescuentoML);

        let costoEnvio = 0;
        let costoFijo = 0;

        //Vemos cuanto nos cobran del envio en mercado libre dependiendo de la utilidad
        if (descuentoML > envio){
            costoEnvio = 0;
        }else{
            if (descuentoML < 16000){
                costoEnvio = 0;
            }else if(descuentoML < 37000){
                costoEnvio = 9611.99;
            }else{
                costoEnvio = 4805.99;
            }
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
        //    if (codigoML === 'MLA1985386570'){
        //     console.log(costoFinal)
        //     console.log(utilidad)
        //     console.log(porcentajeDescuentoML)
        //      console.log(descuentoML)
        //      console.log(costoEnvio)
        //      console.log(costoFijo)
        //  }
         precioML = (descuentoML + costoEnvio + costoFijo) * cant;
         return precioML.toFixed(2);
    }

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
    const {authorizacion} = (await axios.get(`${URL}codigoML`)).data;
    try { 
        const { data } = (await axios.put(`${aux}items/${codigo}`,
            {
                price: precio,
                available_quantity: stock
            },
            {
                headers: {
                    'Authorization': `Bearer ${authorizacion}`
                }
            }
        ))
        return data;
    } catch (error) {
        console.log(error)
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

export const ordenarLista = (lista) => {
    
    lista.sort((a, b) => {
      if(a.descripcion > b.descripcion) return 1;
      if(a.descripcion < b.descripcion) return -1;
      return 0;
    });

    return aux;
}

export const publicarML = async(elem) => {
    const {authorizacion} = (await axios.get(`${URL}codigoML`)).data;

    try {
        const res = (await axios.post(`${aux}items`, elem, {
            headers: {
                'Authorization': `Bearer ${authorizacion}`
            }
        })).data;
        return res;
    } catch (error) {
        console.log(error)
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

//Lo usamos para una vez se cargue la aplicacion se pueda actualizar el token
export const verificarToken = async() => {
    await axios.get(`${URL}codigoML/verificarAuthorizacion`);
};

//Usamos para subir las imagenes y cargarlas en mercado libre
export const subirImagenes = async(args) => {
    const formData = new FormData();
    for(let elem of args) {
        formData.append('file', elem)
    }
    const res = (await axios.post(`${URL}codigoML/imagenes`, formData)).data;
    console.log(res)
    return res;
};