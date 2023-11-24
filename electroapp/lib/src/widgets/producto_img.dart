import 'package:flutter/material.dart';

class ProductoImg extends StatelessWidget {
const ProductoImg({ Key? key }) : super(key: key);

  @override
  Widget build(BuildContext context){
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 30,vertical: 20),
      child: Container(
        width: double.infinity,
        height: 500,
        decoration: BoxDecoration(
          color: Colors.yellow[50],
          borderRadius: BorderRadius.circular(50)
        ),
        child: const  Column(
          children: [
            _ImagenProducto(),
            _MarcaProducto()
          ],
        ),
      ),
    );
  }
}

class _ImagenProducto extends StatelessWidget {
const _ImagenProducto({ Key? key }) : super(key: key);

  @override
  Widget build(BuildContext context){
    return const Padding(
      padding: EdgeInsets.all(50),
      child: Image(image:AssetImage('assets/imgs/azul.png')),
    );
  }
}

class _MarcaProducto extends StatelessWidget {
const _MarcaProducto({ Key? key }) : super(key: key);

  @override
  Widget build(BuildContext context){
    return Row(
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              Container(
                decoration: BoxDecoration(
                  border: Border.all(
                    color:Colors.black,
                    width: 2.0
                  ),
                ),
                padding: const EdgeInsets.all(10),
                child: const  Text('Marca',
                style: TextStyle(
                  fontSize: 25,
                  fontWeight: FontWeight.normal,
                ),
              ),
              )
            ],
          );
  }
}
