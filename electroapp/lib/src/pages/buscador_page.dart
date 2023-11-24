import 'package:electroapp/src/widgets/custom_widgets.dart';
import 'package:flutter/material.dart';

class BuscadorPage extends StatelessWidget {
const BuscadorPage({ Key? key }) : super(key: key);

  @override
  Widget build(BuildContext context){
    return const Scaffold(
      body:Column(
        children: [
          BuscadorAppBar(),
          ProductoImg(),
          ProductoInfo(desc:"Descripcion",precio:3,stock:4)
        ],
      )
    );
  }
}