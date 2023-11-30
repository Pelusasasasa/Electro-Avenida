import 'package:flutter/material.dart';

class ProductoInfo extends StatelessWidget {

  final String desc;
  final num precio;
  final String stock;
  final bool oferta;
  final num precioOferta;


const ProductoInfo({
  Key? key,
  required this.desc,
  required this.precio,
  required this.stock,
  required this.oferta,
  required this.precioOferta,
  }) : super(key: key);
  

  @override
  Widget build(BuildContext context){
    var finalDesc;

    if (desc.length > 30) {
      finalDesc = desc.substring(0,30);
    }else{
      finalDesc = desc;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 30),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Center(
            child: Text(finalDesc,style: const TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.bold
            )),
          ),
          const SizedBox(height: 20),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              oferta ?  
              //Se se cumple la condicion
              Column(
                children: [
                  Text('Oferta; \$$precioOferta',style: const TextStyle(
                    color:Colors.red,
                    fontSize: 23
                  )),
                  Text('Precio:  \$$precio',style: TextStyle(
                      fontSize: 18,
                      decoration: oferta ? TextDecoration.lineThrough : null,
                      color: Colors.grey,
                      fontWeight: FontWeight.bold
                    )),
                ],
              )
              : 
              //Si no se cumple la condicion
              Text('Precio:  \$$precio',style: TextStyle(
                      fontSize: 18,
                      decoration: oferta ? TextDecoration.lineThrough : null,
                      color: Colors.grey,
                      fontWeight: FontWeight.bold
              )),
              
              //Se ejecuta siempre
              Text('Stock: $stock',style: const TextStyle(
                  fontSize: 18,
                  color: Colors.grey,
                  fontWeight: FontWeight.bold
                ))
            ],
          )
        ],
      ),
    );
  }
}