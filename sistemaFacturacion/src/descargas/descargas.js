const XLSX = require('xlsx');//llamamos a la libreria xlsx

const pedidos = (Pedidos,path) =>{
    let wb = XLSX.utils.book_new();
    let extencion = "xlsx";
    extencion = path.split('.')[1] ? path.split('.')[1] : extencion;
    path = path.split('.')[0];

    wb.props = {
        Title: "Pedidos",
        subject: "Test",
        Author: "Electro Aaenida"
    }

    let newWS = XLSX.utils.json_to_sheet(Pedidos)

    XLSX.utils.book_append_sheet(wb, newWS,'Pedidos');
    XLSX.writeFile(wb,path + "." + extencion );
};

const ventas = (Ventas,path)=>{

    let wb = XLSX.utils.book_new();

    wb.props = {
        Title: "Ventas",
        subject: "Test",
        Author: "Electro Avenida"
    }

    //Lo que hacemos es ordenar el array por fechas
    Ventas.sort((a,b)=>{
        if(a.fecha > b.fecha){
            return 1;
        }else if(a.fecha < b.fecha){
            return -1
        }
        return 0
    });
    console.log(Ventas[0])
    //borraos las propiedades que no son necesarias
    Ventas.forEach(venta => {
        delete venta._id
        delete venta.tipo_pago
        delete venta.productos
        delete venta.comprob
        delete venta.direccion
        delete venta.cod_comp
        delete venta.cod_doc
        delete venta.dnicuit
        delete venta.observaciones
        delete venta.__v
        delete venta.abonado
        delete venta.condIva
        delete venta.gravado21
        delete venta.iva21
        delete venta.gravado105
        delete venta.iva105
        delete venta.cant_iva;
        delete venta.qr;
        delete venta.cae;
        delete venta.vencimientoCae;
        delete venta.localidad;
        delete venta.precioSinDescuento;
        delete venta.telefono;  
        delete venta.comprobantes;


        //si es unn recibo o un recibo_p le pasamos al nombrecliente el cliente
        if (venta.tipo_comp === "Recibos" || venta.tipo_comp === "Recibos_P") {
            venta.nombreCliente = venta.cliente;
       }

        //borramos lo que sean del recibo que no van
        delete venta.cliente;
        (venta.tipo_comp === "Recibos" || venta.tipo_comp === "Recibos_P") && delete venta.codigo;
        (venta.tipo_comp === "Recibos" || venta.tipo_comp === "Recibos_P") && delete venta.localidad;
        (venta.tipo_comp === "Recibos" || venta.tipo_comp === "Recibos_P") && delete venta.saldoAFavor;
    });

    Ventas.forEach(venta=>{
        const fecha = venta.fecha.slice(0,10).split('-',3);
        const horas = venta.fecha.slice(11,18).split(':',3);
        let dia = fecha[2];
        let mes = fecha[1];
        let anio = fecha[0];
        let hora = horas[0];
        let minuts = horas[1];
        let secons = horas[2];
        mes = mes === 13 ? 1 : mes;

        venta.fecha = `${dia}/${mes}/${anio} - ${hora}:${minuts}:${secons}`;
    });
    
    let newWs = XLSX.utils.json_to_sheet(Ventas)

    XLSX.utils.book_append_sheet(wb,newWs,'Ventas');
    let extencion = "xlsx";

    extencion = path.split('.')[1] ? path.split('.')[1] : extencion;
    path = path.split('.')[0];
    XLSX.writeFile(wb,path + "." + extencion)
};

const comprobantes = async (datos,path) =>{

    let wb = XLSX.utils.book_new();

    wb.props = {
        Title: "Por Comprobante",
        subject: "Test",
        Author: "Electro Avenida"
    };

    for await (let elem of datos){

        if (elem.nombreCliente) {
            elem.codCliente = elem.cliente;
            elem.cliente = elem.nombreCliente;
        };

        if (elem.precioFinal) {
            elem.total = elem.precioFinal;
        }

        delete elem._id ;
        delete elem.rubro;
        delete elem.stock;
        delete elem.empresa;
        delete elem.productos;
        delete elem.__v;
        delete elem.observaciones;
        delete elem.descuento;
        delete elem.nombreCliente;
        delete elem.precioFinal;
    }

    let newWs = XLSX.utils.json_to_sheet(datos)

    XLSX.utils.book_append_sheet(wb,newWs,'Por Cimprbante');
    let extencion = "xlsx";
    extencion = path.split('.')[1] ? path.split('.')[1] : extencion;
    path = path.split('.')[0];
    XLSX.writeFile(wb,path + "." + extencion);
}

module.exports = [pedidos,ventas,comprobantes];