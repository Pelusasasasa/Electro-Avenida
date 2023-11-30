import 'package:electroapp/src/models/Product.dart';
import 'package:electroapp/src/widgets/custom_widgets.dart';
import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;



class BuscadorPage extends StatefulWidget {
const BuscadorPage({ Key? key }) : super(key: key);

  @override
  State<BuscadorPage> createState() => _BuscadorPageState();
}

class _BuscadorPageState extends State<BuscadorPage> {
    var product = Product("1", "DESCRIPCION", "MARCA", 0.00, "STOCK",false,0);

  void getProducto(texto) async{
    var url = Uri.http('192.168.0.101:4000','/api/productos/$texto');
    var res = await http.get(url);
    String body = utf8.decode(res.bodyBytes);
    final jsonData = jsonDecode(body);
    product = Product(
      jsonData['_id'],
      jsonData['descripcion'],
      jsonData['marca'],
      jsonData['precio_venta'],
      jsonData['stock'],
      jsonData['oferta'],
      jsonData['precioOferta'],
    );
    setState(() {
      
    });
  }

  @override
  Widget build(BuildContext context){

    return Scaffold(
      body:Column(
        children: [
          BuscadorAppBar(getProducto:getProducto),
          Expanded(
            child: SingleChildScrollView(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  ProductoImg(codigo:product.id,marca:product.marca),
                  const SizedBox(height: 80),
                  ProductoInfo(desc:product.desc,precio:product.precio,stock:product.stock,oferta: product.oferta,precioOferta:product.precioOferta)
                ]
              ),
            ),
          )
        ],
      )
    );
  }
}