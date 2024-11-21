class Product {
  String id = "";
  String desc = "";
  String marca = "MARCA";
  num precio = 0.00;
  String stock = "0.00";
  bool oferta = false;
  num precioOferta = 0.00;
  

  Product(id,desc,marca,precio,stock,oferta,precioOferta){
    this.desc = desc;
    this.id = id;
    this.marca = marca;
    this.precio = precio;
    this.stock = stock;
    this.oferta = oferta;
    this.precioOferta = oferta ? precioOferta : 0.0;
  }

}