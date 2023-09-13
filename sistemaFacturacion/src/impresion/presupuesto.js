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
            const now = new Date(venta.fecha);
            const date = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString();
            const [anio,mes,dia] = date.slice(0,10).split('-',3);
            const [hora,minuto,segundo] = date.slice(11,19).split(':',3);

            numero.innerHTML=venta.nro_comp;
            venta.observaciones !== "" ? clientes.innerHTML += ` (${venta.observaciones})` : "";

            fecha.innerHTML = `${dia}/${mes}/${anio} ${hora}:${minuto}:${segundo}`;
            vendedor.innerHTML = venta.vendedor;
            numeroComp.innerHTML = venta.nro_comp;
            subtotal.innerHTML =  venta.descuento ? (parseFloat(venta.precioFinal)+parseFloat(venta.descuento)).toFixed(2) : 0;
            precioFinal.innerHTML=(parseFloat(venta.precioFinal)).toFixed(2);
            tipoPago.innerHTML= venta.tipo_pago;
            tipoFactura.innerHTML = venta.tipo_pago === "PP" ? "X" : "R";
            presupuesto.innerHTML = venta.tipo_pago === "PP" ? "Comprobante no valido como Factura" : "";    
            descuento.innerHTML = venta.descuento ? venta.descuento : "0.00";
            if ((venta.tipo_pago === "CC" && valorizado !== "valorizado") || valorizado === "no valorizado" || venta.tipo_pago === "RT") {
                precioFinal.innerText = ""
                subtotal.innerText=""
                descuento.innerText= ""
            };

            tbody.innerHTML = "";
             for await (let elem of lista) {
                console.log(elem)
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
        console.log(JSON.parse(args))
        const [venta,cliente,valorizado,lista,opciones] = JSON.parse(args);
        await listar(venta,valorizado,lista,opciones);
        await listarCliente(cliente,venta);
        await ipcRenderer.send('imprimir',JSON.stringify(opciones));
    });

    async function listarCliente(cliente,venta) {
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