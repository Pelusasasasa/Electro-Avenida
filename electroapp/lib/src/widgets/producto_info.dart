import 'package:flutter/material.dart';

class ProductoInfo extends StatelessWidget {

  final String desc;
  final num precio;
  final String stock;


const ProductoInfo({
  Key? key,
  required this.desc,
  required this.precio,
  required this.stock,
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
              Text('Precio:  \$$precio',style: const TextStyle(
                  fontSize: 18,
                  color: Colors.grey,
                  fontWeight: FontWeight.bold
                )),
                
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