import 'package:flutter/material.dart';

class BuscadorAppBar extends StatelessWidget {
const BuscadorAppBar({ Key? key }) : super(key: key);

  @override
  Widget build(BuildContext context){
    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 30),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            const Expanded(
              child:  TextField(
                decoration: InputDecoration(border: OutlineInputBorder(),labelText:'Codigo'),
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
                print('Pulsando');
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

