const {model,Schema} = require('mongoose')


const tipoVenta = new Schema({
   "Ultima Factura A": String,
   "Ultima Factura B": String,
   "Ultima N Credito A":String,
   "Ultima N Credito B":String,
   "Ultima Recibo A":String,
   "Ultima Recibo B":String,
   "Ultima N Debito A":String,
   "Ultima N Debito B":String,
   "Ultimo Recibo": String,
   "Ultimo Prestamo": String,
   "Ultimo Presupuesto": String,
   "Ultimo Remito": String,
   "Ultimo Remito Contado": String,
   "Ultimo Remito Cta Cte": String,
   "dolar": String,
   "Ultimo Pago":{
      type:Number,
      default:0
   },
   "saldo Inicial":{
      type:Number,
      default:0
   }
})

module.exports = model('tipoVenta',tipoVenta)