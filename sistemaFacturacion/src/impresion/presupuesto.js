const { ipcRenderer } = require("electron");

        const fecha = document.querySelector('.fecha');
        const numero = document.querySelector('.numero');
        const vendedor = document.querySelector('.vendedor');
        const clientes = document.querySelector('.nombreCliente');
        const idCliente = document.querySelector('.idCliente');
        const cuit = document.querySelector('.cuit');
        const direccion = document.querySelector('.direccion');
        const localidad = document.querySelector('.localidad');
        const numeroComp = document.querySelector('.numero');
        const cond_iva = document.querySelector('.cond_iva');
        const subtotal = document.querySelector('.subtotal');
        const precioFinal = document.querySelector('.precioFinal');
        const tipoPago = document.querySelector('.tipoPago');
        const tbody = document.querySelector('.tbody');
        const presupuesto = document.querySelector('#presupuesto');
        const tipoFactura = document.querySelector('.tipoFactura');
        const descuento = document.querySelector('.descuento');


    const listar = async (venta,valorizado,lista,opciones)=>{
            lista = !lista ? venta.productos : lista;
            if(lista.length>51){
                const tabla = document.querySelector('.tabla');
                tabla.classList.add("hojaMuyGrande");
            }else if (lista.length>16){
                const tabla = document.querySelector('.tabla');
                tabla.classList.add('hojaGrande');
            } 

            const tomarFecha = new Date(venta.fecha);
            let dia = tomarFecha.getDate(); 
            let mes = tomarFecha.getMonth() + 1;
            const anio = tomarFecha.getFullYear();
            const hora = tomarFecha.getHours();
            const minuto = tomarFecha.getMinutes();
            const segundo = tomarFecha.getSeconds();

            dia = dia<10 ? `0${dia}` : dia;
            mes = mes<10 ? `0${mes}` : mes;

            numero.innerHTML=venta.nro_comp;
            venta.observaciones !== "" ? clientes.innerHTML += ` (${venta.observaciones})` : "";

            fecha.innerHTML = `${dia}/${mes}/${anio} ${hora}:${minuto}:${segundo}`;
            vendedor.innerHTML = venta.vendedor;
            numeroComp.innerHTML = venta.nro_comp;
            subtotal.innerHTML =  venta.descuento ? (parseFloat(venta.precioFinal)+parseFloat(venta.descuento)).toFixed(2) : 0;
            precioFinal.innerHTML=(parseFloat(venta.precioFinal)).toFixed(2);
            console.log(venta)
            tipoPago.innerHTML= venta.tipo_pago;
            tipoFactura.innerHTML = venta.tipo_pago === "PP" ? "X" : "R";
            presupuesto.innerHTML = venta.tipo_pago === "PP" ? "Comprobante no valido como Factura" : "";    
            descuento.innerHTML = venta.descuento;
    
            if ((venta.tipo_pago === "CC" && valorizado !== "valorizado") || valorizado === "no valorizado") {
                precioFinal.innerHTML = ""
                subtotal.innerHTML=""
                descuento.innerHTML= ""
            }

            tbody.innerHTML = "";
             for await (let elem of lista) {
                 if ((venta.tipo_pago !== "CC" || (valorizado === "valorizado" && venta.tipo_pago === "CC")) && valorizado !== "no valorizado") {
                    tbody.innerHTML += `
                    <tr>
                        <td>${(elem.egreso).toFixed(2)}</td>
                        <td>${elem.codProd}</td>
                        <td class="descripcion">${elem.descripcion}</td>
                        <td>${parseFloat(elem.precio_unitario).toFixed(2)}</td>
                        <td>${(parseFloat(elem.precio_unitario)*elem.egreso).toFixed(2)}</td>
                    </tr>
                    `
                }else{
                    tbody.innerHTML += `
                    <tr>
                        <td>${(elem.egreso).toFixed(2)}</td>
                        <td class="descripcion">${elem.codProd}</td>
                        <td>${elem.descripcion.slice(0,40)}</td>
                    </tr>
                    `
                }
             };
    };

    ipcRenderer.on('info-para-imprimir',async(e,args)=>{
        [venta,cliente,valorizado,lista,opciones] = JSON.parse(args);
        await listar(venta,valorizado,lista,opciones);
        await listarCliente(cliente);
        await ipcRenderer.send('imprimir',JSON.stringify(opciones));
    });

    async function listarCliente() {
        clientes.innerHTML = cliente.cliente + `(${venta.observaciones.toUpperCase()})`;
        idCliente.innerHTML = cliente._id ? cliente._id : cliente.id;
        cuit.innerHTML = cliente.cuit;
        direccion.innerHTML = cliente.direccion;
        localidad.innerHTML = cliente.localidad;
        if (cliente.cond_iva) {
            cond_iva.innerHTML = cliente.cond_iva
        }else{
            cond_iva.innerHTML = "Consumidor Final"
        }
    };


    document.addEventListener('keydown',e=>{
        if(e.key === "Escape"){
            window.close()
        }
    });