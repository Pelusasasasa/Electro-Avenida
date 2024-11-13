const express = require('express');
const cors = require('cors')
const app = express()
const path = require('path')


//settings
app.set('port',process.env.PORT || 4000);

//middlewares
app.use(cors());
app.use(express.json())
 
//routes

//Cancelados
app.use('/api/cancelados',require('./routes/cancelados'));
//Cheques
app.use('/api/cheques',require('./routes/cheques'));
//Clientes
app.use('/api/clientes',require('./routes/clientes'));
//comprobante de pago
app.use('/api/compPagos',require('./routes/comp_pago'));
//Imprimir un pdf
app.use('/api/crearPdf',require('./routes/pdf'));
//tarjetas
app.use('/api/tipoTarjetas',require('./routes/tipoTarjetas'));
//Cuenta Corriente provedor
app.use('/api/ctactePro',require('./routes/ctatePro'));
//Cuenta Corriente Compensada
app.use('/api/cuentaComp',require('./routes/cueCorrComp'));
//Cuenta Corriente Historica
app.use('/api/cuentaHisto',require('./routes/cueCorrHist'));
//cuentas
app.use('/api/cuentas',require('./routes/cuenta'));
//datos Comprobantes
app.use('/api/dat_comp',require('./routes/dat_comp'));
//Diferencia de caja
app.use('/api/difCaja',require('./routes/difCaja'));
//Mercado Libre
app.use('/api/mercadoLibre', require('./routes/MercadoLibre.route'))
//movCaja
app.use('/api/movCajas',require('./routes/movCaja'));
//Movimiento de productos
app.use('/api/movProductos',require('./routes/movProductos'))
//Pedidos
app.use('/api/pedidos',require('./routes/pedidos'));
//Prestamos
app.use('/api/prestamos',require('./routes/prestamo'));
//Presupuesto
app.use('/api/presupuesto',require('./routes/presupuesto'))
//Productos
app.use('/api/productos',require('./routes/productos'))
//Provedor
app.use('/api/provedor',require('./routes/provedor'));
//Recibos
app.use('/api/recibos',require('./routes/recibo'));
//Remitos
app.use('/api/remitos',require('./routes/remito'));
//rubros
app.use('/api/rubros',require('./routes/rubros'));
//tipo Tarjetas
app.use('/api/tarjetas',require('./routes/tarjetas'));
//Tipo Ventas
app.use('/api/tipoVenta',require('./routes/tipoVenta'));
//Ultimos
app.use('/api/ultimos',require('./routes/ultimos'));
//Usuarios
app.use('/api/usuarios',require('./routes/usuarios'))
//Vales
app.use('/api/vales',require('./routes/vale'));
//Variaciones
app.use('/api/variacion', require('./routes/variacion.route'));
//Ventas
app.use('/api/ventas',require('./routes/ventas'))

module.exports = app