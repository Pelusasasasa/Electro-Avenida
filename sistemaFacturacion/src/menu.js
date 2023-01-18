const {abrirVentana} = require('./funciones');
const {dialog} = require('electron');
const [pedidos] = require('./descargas/descargas')

const axios = require("axios");
require("dotenv").config;
const URL = process.env.URL;

//menu de la aplciacion
const templateMenu = [
    {
        label: 'Convertir excel',
        submenu: [{
            label: 'Pedidos',
            async click() {
                const path = (await dialog.showSaveDialog()).filePath;
                pedidos((await axios.get(`${URL}pedidos`)).data,path)
            }
        },
        {
            label: 'Ventas',
            click() {
                abrirVentana('fechas/fechas.html',600,200);

            }
        }]
    },
    {
        label: "Datos",
        submenu: [
            {
                label: "Rubros",
                submenu: [
                    {
                        label: "Agregar rubros",
                        click(){
                            abrirVentana("rubros/rubros.html",600,650)
                        }
                    },
                    {
                        label: "Graficos",
                        click(){
                            abrirVentana(`rubros/grafico.html`,1200,650)
                        }
                    }
                ]
            },
            {
                label: "Numeros",
                click(){
                    abrirVentana("numeros/numeros.html",600,1000)
                }
            },{
                label: "Vendedores",
                click(){
                    validarUsuario("ValidarUsuario")
                }
            }
        ]
    },
    {
        label: "Clientes",
        submenu:[
            {
                label:"Listado Saldo",
                click(){
                    abrirVentana("clientes/listadoSaldo.html",1200,600)
                }
            },
            {
                label: "Arreglar Saldo",
                click(){
                    abrirVentana('clientes/arreglarSaldo.html',600,500)
                }
            },
            {
                label: "Arreglar Compensada",
                click(){
                    validarUsuario("arreglarCompensada")
                }
            }
        ]
    },
    {
        label: "Productos",
        submenu:[
            
            {
                label:"Listado de Stock",
                click(){
                    abrirVentana("productos/listadoStock.html",1000,900)
                }
            },
            {
                label: "Cambio de codigo",
                click(){
                    abrirVentana("productos/cambioCodigo.html",700,300)
                }
            },{
                label: "Aum porcentaje",
                click(){
                    abrirVentana("./productos/aumPorcentaje.html",600,200);
                }
            },{
                label: "Listado Por Marca",
                click(){
                    abrirVentana("./productos/listadoPorMarca.html",1200,1000)
                }
            }
        ]
    },
    {
        label: "Listado",
        submenu:[
            {
                label: "PorComprobante",
                click(){
                    abrirVentana("listados/porComrpobante.html",1200,600)
                }
            },
            {
                label: "Presupuesto",
                click(){
                    abrirVentana("listados/presupuestos.html",1200,1000)
                }
            },
            {
                label: "Buscar Venta",
                click(){
                    abrirVentana("listados/buscarVentas.html",1200,1000)
                }
            },
            {
                label: "Stock Negativo",
                click(){
                    abrirVentana("listados/stockNegativo.html",1200,1000)
                }
            },
            {
                label: "Libro Ventas",
                click(){
                    abrirVentana("listados/libroVentas.html",1100,1000)
                }
            }
        ]
    },
    {
        label: "Utilidad",
        submenu:[
            {
                label:"Gerencial",
                click(){
                    abrirVentana("utilidad/gerencial.html",1200,1000)
                }
            },
            {
                label:"Imprimir Presupuesto",
                click(){
                    abrirVentana("utilidad/imprimirPresupuesto.html",400,200)
                }
            },
            {
                label:"Cargar Factura",
                click(){
                    abrirVentana("utilidad/cargarFactura.html",800,900);
                }
            },{
                label:"Agregar tarjeta",
                click(){
                    abrirVentana("utilidad/cargarTarjeta.html",500,500)
                }
            },{
                label:"Agregar cheque",
                click(){
                    abrirVentana("utilidad/agregarCheque.html",500,550)
                }
            },{
                label:"Ultimas Ventas",
                click(){
                    abrirVentana("utilidad/ultimasVentas.html",1200,1000);
                }
            }
        ]
    },
    // { VER LO DE LA CONEXION
    //     label: `${conexion}`,
    //     click(){
    //         if (a === 2) {
    //             tipoConexion = `a=1;module.exports = a`;
    //             fs.writeFile(__dirname + '/config.js',tipoConexion,()=>{
    //                 app.relaunch();
    //                 app.exit(0);
    //             })
    //         }else{
    //             tipoConexion = `a=2;module.exports = a`;
    //             fs.writeFile(__dirname + '/config.js',tipoConexion,()=>{
    //                 app.relaunch();
    //                 app.exit(0);
    //             })
    //         }
    //     }
    // },
    {
        label:"",
        accelerator: process.platform == 'darwin' ? 'Comand+D' : 'Ctrl+D',
        click(item, focusedWindow) {
            focusedWindow.toggleDevTools();
        }
    },
];


const validarUsuario = (texto)=>{
    ventanaPrincipal.webContents.send('validarUsuario',JSON.stringify(texto))
}

module.exports = templateMenu;