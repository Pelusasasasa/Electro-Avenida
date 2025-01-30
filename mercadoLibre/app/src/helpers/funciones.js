import axios from 'axios';

const client_id = '8351426981367452';
const aux = 'https://api.mercadolibre.com/';
const client_secret = 'n03VlrPoBnTyRmGDtDusOQwuu7qaNpHv';
const code = 'TG-670e5faf324be700011ea691-231090073'
const refresh_token = "TG-670e60957e88f500012c13e8-231090073"
const redirect_uri = 'https://www.electro-avenida.com.ar/';
const URL = process.env.REACT_APP_URL;
const gananciaML = 10;
const porcentajeDescuentoML = 0.81;
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

export const calcularPrecioSujerido = (costo = 0, costodolar = 0, impuesto, dolar, tipoVenta, unidadPack, utilidad) => {
    const costoFinal = costodolar !== 0 ? (costodolar + impuesto) * dolar  :  costo + impuesto;
        let ganancia = costoFinal + (costoFinal * gananciaML / 100);
        let utilidadPlus = ganancia + (ganancia * utilidad / 100);
        utilidad = tipoVenta === 'UNIDAD' ? utilidadPlus : utilidadPlus * unidadPack;

        //Variables para el calculo
        const comisionPorcentual = 13.5 / 100; //13.5%
        const adicionalPorcentual = 8 / 100; //3%
        const costoEnvio = 4805.99;

        //Rango Inicial para calcular el preico publicado
        let precioPublicado = utilidadPlus;

        while(true){

            //Determinacion del costo fijo segun el rango de preico
            let costoFijo = 0;

            if (precioPublicado < 12000){
                costoFijo = 900;
            }else if( precioPublicado <= 30000){
                costoFijo = 1800;
            };

            // Si el precio es mayor a 30,000, se suma el costo del envío
            const aplicaEnvioGratis = precioPublicado > 30000;
            const costoEnvioFinal = aplicaEnvioGratis ? costoEnvio : 0;

            // Cálculo de la comisión porcentual y adicional
            const comision = precioPublicado * comisionPorcentual;
            const adicional = precioPublicado * adicionalPorcentual;

            // Cálculo del costo total
            const costoTotal = comision + adicional + costoFijo + costoEnvioFinal;

            // Calcular el monto recibido con el precio actual
            const montoRecibido = precioPublicado - costoTotal;

            // Si el monto recibido está cerca del monto deseado, terminamos
            if (Math.abs(montoRecibido - utilidad) < 0.01) {
                break;
            }

            // Ajustar el precio publicado
            precioPublicado += (utilidad - montoRecibido) / 2;   
        }

        // Resultado detallado
    return precioPublicado.toFixed(2);
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

export const modificarPrecioYStockPorIdDeProducto = async(codigo,  precio, stock, tipoVenta, unidadPack) => {
    const {authorizacion} = (await axios.get(`${URL}codigoML`)).data;
    try { 
        const { data } = (await axios.put(`${aux}items/${codigo}`,
            {   
                price: precio,
                available_quantity: stock,
                attributes: [
                    {"id": "SALE_FORMAT", "value_id": tipoVenta === 'UNIDAD' ? "1359391" : "1359392"},
                    {"id": "UNITS_PER_PACK", "value_name": unidadPack}
                ]
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
        console.log(error.response.data)
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