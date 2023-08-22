const {abrirVentana, configAxios} = require('./funciones');
const {dialog, ipcRenderer, ipcMain} = require('electron');
const [pedidos] = require('./descargas/descargas')

const axios = require("axios");
require("dotenv").config;
const URL = process.env.URL;



//menu de la aplciacion
const templateMenu = [
    //Descargas
    {
        label: 'Convertir excel',
        submenu: [
        {
            label: 'Pedidos',
            async click() {
                const path = (await dialog.showSaveDialog()).filePath;
                pedidos((await axios.get(`${URL}pedidos`,configAxios)).data,path)
            }
        },
        {
            label: 'Ventas',
            click() {
                abrirVentana('fechas/fechas.html',600,300);

            }
        },
        {
            label:"Por Comprobante",
            click(){
                abrirVentana('fechas/fechas.html',600,300,false,'porComprobante');
            }
        }
        
    ]
    },
    //Datos
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
                    abrirVentana("numeros/numeros.html",600,550)
                }
            },{
                label: "Vendedores",
                click(){
                    abrirVentana("usuarios/usuarios.html",800,400)
                }
            }
        ]
    },
    //Clientes
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
    //Productos
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
                    ventanaPrincipal.webContents.send('cambioCodigo');

                }
            },{
                label: "Aum porcentaje",
                click(){
                    ventanaPrincipal.webContents.send('aumPorcentaje')
                }
            },{
                label: "Listado Por Marca",
                click(){
                    abrirVentana("./productos/listadoPorMarca.html",1200,1000)
                }
            },
            {
                label: "Cambiar Precios con lista",
                click(){
                    abrirVentana("./productos/cambiarPrecios.html",1400,1100);
                }
            }
        ]
    },
    //Listados
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
                label: "Remitos",
                click(){
                    abrirVentana("listados/remitos.html",1200,1000)
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
    //Utilidad
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
                label:"Agregar tarjeta",
                click(){
                    abrirVentana("utilidad/cargarTarjeta.html",500,500)
                }
            },
            {
                label:"Agregar cheque",
                click(){
                    abrirVentana("utilidad/agregarCheque.html",500,550)
                }
            },
            {
                label:"Ultimas Ventas",
                click(){
                    abrirVentana("utilidad/ultimasVentas.html",1200,1000);
                }
            }
        ]
    },
    //Pestamos
    {
        label:"Prestamos",
        submenu:[
            {
                label:"Realizar Prestamo",
                click(){
                    ventanaPrincipal.webContents.send('abrir-prestamo');
                }
            },
            {
                label:"Ver Prestamos",
                click(){
                    ventanaPrincipal.webContents.send('ver-prestamos');
                }
            },
            {
                label:"Ver Prestamos Anulados",
                click(){
                    ventanaPrincipal.webContents.send('ver-prestamos-anulados');
                }
            }
        ]
    },
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