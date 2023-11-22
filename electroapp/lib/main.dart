
import 'package:electroapp/screens/counter_screen.dart';
import 'package:flutter/material.dart';

void main(){
  runApp( const MyApp());
}

class MyApp extends StatelessWidget{
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primarySwatch: Colors.yellow,
      ),
      home: const CounterScreen()
    );
  }

}