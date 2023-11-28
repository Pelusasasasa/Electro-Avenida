import 'package:flutter/material.dart';
import 'package:flutter/services.dart';


class BuscadorAppBar extends StatefulWidget {
  final Function getProducto;
  
const BuscadorAppBar({ 
  Key? key,
  required this.getProducto,
  }) : super(key: key);

  @override
  State<BuscadorAppBar> createState() => _BuscadorAppBarState();
}

class _BuscadorAppBarState extends State<BuscadorAppBar> {
  TextEditingController _textController = TextEditingController();

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
                controller: _textController,
                decoration: const InputDecoration(border: OutlineInputBorder(),labelText:'Codigo'),
                inputFormatters: [
                  // FilteringTextInputFormatter.allow(RegExp(r'[0-9-]'))
                ],
                keyboardType: TextInputType.multiline,
                onChanged: (value){
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
                widget.getProducto(texto);
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
