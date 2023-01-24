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
app.use('/api/usuarios',require('./routes/usuarios'))
app.use('/api/clientes',require('./routes/clientes'))
app.use('/api/pedidos',require('./routes/pedidos'))
app.use('/api/productos',require('./routes/productos'))
app.use('/api/tipoVenta',require('./routes/tipoVenta'))
app.use('/api/movProductos',require('./routes/movProductos'))
app.use('/api/cancelados',require('./routes/cancelados'))
app.use('/api/ventas',require('./routes/ventas'))
//Presupuesto
app.use('/api/presupuesto',require('./routes/presupuesto'))
//CuentaComp
app.use('/api/cuentaComp',require('./routes/cueCorrComp'));
//Cuenta Historica
app.use('/api/cuentaHisto',require('./routes/cueCorrHist'));
//Imprimir un pdf
app.use('/api/crearPdf',require('./routes/pdf'));
//cheques
app.use('/api/cheques',require('./routes/cheques'));
//tarjetas
app.use('/api/tarjetas',require('./routes/tarjetas'));
//tipo Tarjetas
app.use('/api/tipoTarjetas',require('./routes/tipoTarjetas'));
//vales
app.use('/api/vales',require('./routes/vale'));
//cuentas
app.use('/api/cuentas',require('./routes/cuenta'));
//movCaja
app.use('/api/movCajas',require('./routes/movCaja'));
//comprobante de pago
app.use('/api/compPagos',require('./routes/comp_pago'));
//Ultimos
app.use('/api/ultimos',require('./routes/ultimos'));
//Provedor
app.use('/api/provedor',require('./routes/provedor'));
//datos Comprobantes
app.use('/api/dat_comp',require('./routes/dat_comp'));
//rubros
app.use('/api/rubros',require('./routes/rubros'));
//Cuenta Corriente provedor
app.use('/api/ctactePro',require('./routes/ctatePro'));
//Recibos
app.use('/api/recibos',require('./routes/recibo'));
module.exports = app