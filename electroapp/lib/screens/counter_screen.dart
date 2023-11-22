
import 'package:flutter/material.dart';

class CounterScreen extends StatefulWidget {
  const CounterScreen({super.key});

  @override
  State<CounterScreen> createState() => _CounterScreenState();
}

class _CounterScreenState extends State<CounterScreen> {
  
  @override
  Widget build(BuildContext context) {

    const fontSize30 = TextStyle(fontSize: 30);
    const fontSize20 = TextStyle(fontSize: 20);

    const fontWeight = TextStyle(fontWeight: FontWeight.normal);

    return Scaffold(
      appBar: AppBar(
        title: const Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text('Electro Avenida',style: TextStyle(color: Color(0xFF000000)))
          ],
        ),
        elevation: 0,
      ),
      body: Center(
        child: Column(
          children: [
            TextFormField(
              decoration: const InputDecoration(
                hintText: "Buscar producto..."
              ),
            ),
            const Image(image: NetworkImage('http://192.168.0.101:4000/api/productos/035-019/image')),
            const Text('Lampara led bulbo 12W Frio',style:fontSize30),
            const  Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                Text('Marca',style: fontSize20),
                Text('Precio',style: fontSize20)
              ],
            )
          ],
        ),
      ),
    );
  }
}