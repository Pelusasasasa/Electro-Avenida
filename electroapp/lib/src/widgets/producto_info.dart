import 'package:flutter/material.dart';

class ProductoInfo extends StatelessWidget {

  final String desc;
  final double precio;
  final double stock;

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
      child: const Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Title',style: TextStyle(
            fontSize: 40,
            fontWeight: FontWeight.bold
          )),
          SizedBox(height: 20),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              Text('Precio',style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold
                )),
                
              Text('Stock',style: TextStyle(
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