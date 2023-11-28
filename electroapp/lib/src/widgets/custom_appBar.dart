import 'package:flutter/material.dart';


class BuscadorAppBar extends StatelessWidget {
  final Function getProducto;
  
const BuscadorAppBar({ 
  Key? key,
  required this.getProducto,
  }) : super(key: key);


  @override
  Widget build(BuildContext context){

    var texto = "";

    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 30),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            Expanded(
              child:  TextField(
                decoration: const InputDecoration(border: OutlineInputBorder(),labelText:'Codigo'),
                keyboardType: TextInputType.number,
                onChanged: (value){
                  if (value.length == 4 && !value.contains('-')) {
                    print(value);
                  }
                  texto = value;
                },
              ),
            ),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.yellow,
                padding: const EdgeInsets.symmetric(horizontal: 20,vertical: 15),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10)
                )
              ),
              onPressed: (){
                FocusScopeNode currentFocus = FocusScope.of(context);
                  if (!currentFocus.hasPrimaryFocus) {
                      currentFocus.unfocus();
                  }
                getProducto(texto);
              }, 
              child: const Text('Buscar',style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color:Colors.black
              ),))
            
          ]),
      ),
    );
  }
}

