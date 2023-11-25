import 'package:flutter/material.dart';

class ProductoImg extends StatelessWidget {
const ProductoImg({
  Key? key,
  required this.codigo,
  required this.marca
  }) : super(key: key);

  final String codigo;
  final String marca;
  
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
        child: Column(
          children: [
            _ImagenProducto(codigo:codigo),
            _MarcaProducto(marca:marca)
          ],
        ),
      ),
    );
  }
}

class _ImagenProducto extends StatelessWidget {
  final String codigo;
  const _ImagenProducto({
    Key? key,
    required this.codigo
    }) : super(key: key);

  @override
  Widget build(BuildContext context){
    return Padding(
      padding: const EdgeInsets.all(50),
      child: Image.network('http://192.168.0.101:4000/api/productos/$codigo/image'),
    );
  }
}

class _MarcaProducto extends StatelessWidget {

  final String marca;

const _MarcaProducto({
  Key? key,
  required this.marca
  }) : super(key: key);

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
                child: Text(marca,
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
