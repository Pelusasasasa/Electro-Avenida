const pdfCTRL = {};

const pdf = require('html-pdf');
const qrcode = require('qrcode');


const fs = require('fs');

const path = require('path');

let html = fs.readFileSync(__dirname + '/pdf.html','utf8');


pdfCTRL.crearPdf = async(req,res)=>{

    const [venta,cliente,{QR,cae,vencimientoCae,texto,numero}] = req.body;
    let trs = "";
    if (venta.tipo_comp === "Ticket Factura" || venta.tipo_comp === "Nota Credito") {
    venta.productos.forEach(({objeto,cantidad})=>{
        trs = trs + `<tr>
                            <td>${objeto._id}</td>
                            <td>${objeto.descripcion}</td>
                            <td class="izquierda">${parseFloat(cantidad).toFixed(2)}</td>
                            <td class="izquierda">${objeto.unidad}</td>
                            ${venta.condIva !== "Inscripto" ? `<td class="izquierda">${parseFloat(objeto.precio_venta).toFixed(2)}</td>` : ""}
                            ${(venta.condIva === "Inscripto" && objeto.iva === "N") ? `<td class="izquierda">${(parseFloat(objeto.precio_venta)/1.21).toFixed(2)}</td>` : ""}
                            ${(venta.condIva === "Inscripto" && objeto.iva === "R") ? `<td class="izquierda">${(parseFloat(objeto.precio_venta)/1.105).toFixed(2)}</td>` : ""}
                            ${venta.condIva !== "Inscripto" ? `<td class="izquierda">${(parseFloat(cantidad)*parseFloat(objeto.precio_venta)).toFixed(2)}</td>` : ""}
                            ${(venta.condIva === "Inscripto" && objeto.iva === "N") ? `<td class="izquierda">${((parseFloat(cantidad)*parseFloat(objeto.precio_venta))/1.21).toFixed(2)}</td>`  : ""}
                            ${(venta.condIva === "Inscripto" && objeto.iva === "R") ? `<td class="izquierda">${((parseFloat(cantidad)*parseFloat(objeto.precio_venta))/1.105).toFixed(2)}</td>`  : ""}
                            ${(venta.condIva === "Inscripto" && objeto.iva === "N") ? `<td class="izquierda">21%</td>`  : "" }
                            ${(venta.condIva === "Inscripto" && objeto.iva === "R") ? `<td class="izquierda">10.5%</td>`  : "" }
                            ${(venta.condIva === "Inscripto") ? `<td class="izquierda">${(parseFloat(cantidad)*parseFloat(objeto.precio_venta)).toFixed(2)}</td>`  : "" }
                       </tr>`;
        });
    }else{
        venta.productos.forEach(ticket=>{
            trs = trs + `<tr>
                                <td>${ticket.fecha}</td>
                                <td>${ticket.numero}</td>
                                <td>${ticket.pagado}</td>
                           </tr>`;
            });
    }

    const date = new Date(venta.fecha);
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    day = day < 10 ? `0${day}` : day;
    month = month < 10 ? `0${month}` : month;
    month = month===13 ? 1 : month;
    
    const codigoComprobante = verCodigoComp(venta.cod_comp);
    const tipoCompropobante = verTipoComp(venta.cod_comp);
    
    
    // const qr = (await qrcode.toDataURL(QR)).split('/\r\n|\r|\n/');
    const a = await generarQR(texto);
    
    const img = (await qrcode.toDataURL(a));


    //Generamos el qr
    async function generarQR(texto) {
        const url = `https://www.afip.gob.ar/fe/qr/?p=${texto}`;
        return url
    };

    let textoFactura = "";
    if(venta.tipo_comp === "Recibos"){
        textoFactura = "RECIBO";
    }else if(venta.tipo_comp === "Ticket Factura"){
        textoFactura = "FACTURA";
    }else{
        textoFactura = "NOTA CREDITO"
    }

    html = html.replace('{{tipoCompropobante}}',tipoCompropobante);
    html = html.replace('{{codigoComprobante}}',codigoComprobante);
    html = html.replace('{{textoFactura}}',textoFactura);
    html = numero ? html.replace('{{numero}}',numero.toString().padStart(8,'0')) :  html.replace("{{numero}}",venta.nro_comp);
    html = html.replace('{{day}}',day);
    html = html.replace('{{month}}',month);
    html = html.replace('{{year}}',year);
    //cliente
    html = html.replace('{{cliente}}',venta.nombreCliente);
    html = venta.dnicuit.length === 8 ? html.replace('{{dniocuit}}',"DNI") : html.replace('{{dniocuit}}','CUIT');
    html = html.replace('{{dnicuit}}',venta.dnicuit);
    html = venta.condIva === "" ? html.replace('{{condIva}}',"Consumidor Final") : html.replace('{{condIva}}',venta.condIva)
    html = html.replace('{{direccion}}',venta.direccion);
    html = html.replace('{{localidad}}',venta.localidad);
    html = (venta.tipo_pago !== "CC" || venta.cliente === "M122") ? html.replace('{{condVenta}}',"Contado") : html.replace('{{condVenta}}',"Cuenta Corriente")
    html = html.replace('{{}}',);

    //encabezado
    html = venta.tipo_comp === "Recibos" ? html.replace('{{codigo}}',"<td>Fecha</td>")  : html.replace('{{codigo}}',"<td>Codigo</td>");
    html = venta.tipo_comp === "Recibos" ? html.replace('{{productoServicio}}',"<td>Nro. Comprobante</td>") : html.replace('{{productoServicio}}',"<td>Producto/Servicio</td>");
    html = venta.tipo_comp === "Recibos" ? html.replace('{{cantidad}}',"<td>Pagado</td>") : html.replace('{{cantidad}}',"<td>Cantidad</td>");
    html = venta.tipo_comp === "Recibos" ? html.replace('{{medida}}',"") : html.replace('{{medida}}',"<td>U. Medida</td>");
    html = venta.tipo_comp === "Recibos" ? html.replace('{{precioU}}',"") : html.replace('{{precioU}}',"<td>Precio Unit.</td>");
    html = venta.tipo_comp === "Recibos" ? html.replace('{{subtotal}}',"") : html.replace('{{subtotal}}',"<td>Subtotal</td>");
    html = (venta.condIva === "Inscripto" && venta.tipo_comp === "Ticket Factura") ? html.replace('{{alicuota}}',`<td>Alicuota IVA</td>`) : html.replace('{{alicuota}}',"");
    html = (venta.condIva === "Inscripto"  && venta.tipo_comp === "Ticket Factura") ? html.replace('{{subtotalIva}}',`<td>Subtotal c/IVA</td>`) : html.replace('{{subtotalIva}}',"");
    
    html = html.replace('{{trs}}',trs)

    //afip
    if (venta.tipo_comp !== "Recibos") {
        html = html.replace('{{image}}', img);
        html = html.replace('{{cae}}', cae);
        html = html.replace('{{vencimientoCae}}', vencimientoCae);    
    }else{
        html = html.replace('{{image}}', "");
        html = html.replace('{{cae}}', "");
        html = html.replace('{{vencimientoCae}}', "");    
    }
    

    //totales
    html = (venta.condIva === "Inscripto" && venta.tipo_comp === "Ticket Factura") ? html.replace('{{importeNeto}}',`<p class="IVA neto">Importe Neto Gravado: $<span>${venta.gravado21 + venta.gravado105}</span></p>`) : html.replace('{{importeNeto}}',"");
    html = (venta.condIva === "Inscripto" && venta.tipo_comp === "Ticket Factura") ? html.replace('{{iva21}}',`<p class="IVA iva21">IVA 21%: $<span>${venta.iva21.toFixed(2)}</span></p>`) : html.replace('{{iva21}}',"");
    html = (venta.condIva === "Inscripto" && venta.tipo_comp === "Ticket Factura") ? html.replace('{{iva105}}',`<p class="IVA iva105">IVA 10.5%: $<span>${venta.iva105.toFixed(2)}</span></p>`) : html.replace('{{iva105}}',"");
    html = venta.condIva !== "Inscripto" ? html.replace('{{subtotal}}',`<p class="SinIVA">Subtotal: $<span>${venta.precioFinal + parseFloat(venta.descuento)}</span></p>`) : html.replace('{{subtotal}}',"");
    html = html.replace('{{descuento}}',parseFloat(venta.descuento).toFixed(2));
    html = html.replace('{{precioFinal}}',venta.precioFinal);

    const config = {
         "height": "10.5in", "width": "8in",  "format" : "A4", "type": "pdf", "zoomFactor": "0.65",    
        };
        pdf.create(html,config).toFile(`pdfs/${venta.nro_comp}--${venta.nombreCliente}--${venta.tipo_comp}.pdf`,(err,res)=>{
            if (err) {
                console.log(err);
            }else{
                console.log(res)
            }
            html = fs.readFileSync(__dirname + '/pdf.html','utf8');
        })
        res.send("a");
}



const verCodigoComp = (codigoComprobante)=>{
    if (codigoComprobante === 6) {
        return "Cod: 006"
    }else if(codigoComprobante === 1){
        return "Cod: 001"
    }else if(codigoComprobante === 3){
        return "Cod: 003"
    }else if(codigoComprobante === 4){
        return "Cod: 004"
    }else if(codigoComprobante === 8){
        return "Cod: 008"
    }else if(codigoComprobante === 9){
        return "Cod: 009"
    }
}

const verTipoComp = (codigo)=>{
    if(codigo === 1 || codigo === 4 ||  codigo === 3){
        return "A"
    }else{
        return "B"
    }
}

module.exports = pdfCTRL;



