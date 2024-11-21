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
    String selectedValue = 'Opcion 1';

    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 30,horizontal: 20),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            
            Expanded(
              child:  TextField(
                controller: _textController,
                decoration: InputDecoration(
                  border: const OutlineInputBorder(),
                  labelText:'Codigo',
                  suffixIcon: _textController.text.isNotEmpty
                    ? IconButton(onPressed: (){
                      setState(() {
                        _textController.clear();
                        FocusScopeNode currentFocus = FocusScope.of(context);
                        currentFocus.requestFocus();
                      });
                    }, icon: const Icon(Icons.clear)) : null
                  ),
                
                keyboardType: TextInputType.number,
                onChanged: (value){
                  if (value.length == 4 && value.substring(3,4) != "-") {
                    texto = '${value.substring(0,3)}-${value.substring(3,4)}';
                    _textController.value = _textController.value.copyWith(
                      text:'${value.substring(0,3)}-${value.substring(3,4)}',
                      selection: TextSelection.fromPosition(
                      TextPosition(offset: texto.length )
                      )
                    );
                  }else if(value.length == 8 && value.substring(7,8) != "-"){
                    texto = '${value.substring(0,7)}-${value.substring(7,8)}';
                    _textController.value = _textController.value.copyWith(
                      text:'${value.substring(0,7)}-${value.substring(7,8)}',
                      selection: TextSelection.fromPosition(
                      TextPosition(offset: texto.length )
                      )
                    );
                  }else{
                    texto = value;
                  }
                  
                },
              ),
            ),

            const SizedBox(width: 40),

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
              child: (
                const Icon(Icons.search)
              )
              )

          ]),
      ),
    );
  }
}
