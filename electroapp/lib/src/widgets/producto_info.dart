import 'package:flutter/material.dart';

class ProductoInfo extends StatelessWidget {

  final String desc;
  final double precio;
  final String stock;

const ProductoInfo({
  Key? key,
  required this.desc,
  required this.precio,
  required this.stock,
  }) : super(key: key);
  

  @override
  Widget build(BuildContext context){
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 30),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Center(
            child: Text(desc,style: const TextStyle(
              fontSize: 25,
              fontWeight: FontWeight.bold
            )),
          ),
          const SizedBox(height: 20),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              Text('Precio:  \$$precio',style: const TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold
                )),
                
              Text('Stock: $stock',style: const TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold
                ))
            ],
          )
        ],
      ),
    );
  }
}