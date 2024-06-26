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

app.use('/api/usuarios',require('./routes/usuarios'))

app.use('/api/pedidos',require('./routes/pedidos'))
app.use('/api/productos',require('./routes/productos'))
app.use('/api/tipoVenta',require('./routes/tipoVenta'))
app.use('/api/movProductos',require('./routes/movProductos'))

app.use('/api/ventas',require('./routes/ventas'))
//Presupuesto
app.use('/api/presupuesto',require('./routes/presupuesto'))


app.use('/api/cuentaComp',require('./routes/cueCorrComp'));
app.use('/api/cuentaHisto',require('./routes/cueCorrHist'));

//Imprimir un pdf
app.use('/api/crearPdf',require('./routes/pdf'));
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
//Remitos
app.use('/api/remitos',require('./routes/remito'));
//Prestamos
app.use('/api/prestamos',require('./routes/prestamo'));
//Diferencia de caja
app.use('/api/difCaja',require('./routes/difCaja'));
module.exports = app