import 'package:electroapp/src/widgets/custom_widgets.dart';
import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:electroapp/src/models/product.dart';
import 'package:http/http.dart' as http;



class BuscadorPage extends StatefulWidget {
const BuscadorPage({ Key? key }) : super(key: key);

  @override
  State<BuscadorPage> createState() => _BuscadorPageState();
}

class _BuscadorPageState extends State<BuscadorPage> {
    var product = Product("", "", "", 0.00, "");

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
      jsonData['stock']
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
                children: [
                  ProductoImg(codigo:product.id,marca:product.marca),
                  ProductoInfo(desc:product.desc,precio:product.precio,stock:product.stock)
                ]
              ),
            ),
          )
        ],
      )
    );
  }
}