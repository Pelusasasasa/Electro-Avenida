class Product {
  String id = "";
  String desc = "";
  String marca = "MARCA";
  num precio = 0.00;
  String stock = "0.00";

  Product(id,desc,marca,precio,stock){
    print(precio);
    this.desc = desc;
    this.id = id;
    this.marca = marca;
    this.precio = precio;
    this.stock = stock;
  }

}