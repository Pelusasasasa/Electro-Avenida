
import { Button } from "../../components/Button";

export const ListPublicaciones = () => {

  // const electron = (window).electron;
  return (
    <div className="w-full bg-yellow-500 border-l-gray-500 border pl-1">
      <header>
        <h2 className="text-center text-2xl pb-5">Publicaciones</h2>
      </header>
      <div className="w-full overflow-scroll h-96 bg-white">
        <table className="w-full">
          <thead>
            <tr>
              <th className="border border-black">N° </th>
              <th className="border border-black">Codigo ML</th>
              <th className="border border-black">Descripcion</th>
              <th className="border border-black">Precio</th>
              <th className="border border-black">Stock</th>
              <th className="border border-black">Cant. Ventas</th>
              <th className="border border-black">Catalogo</th>
            </tr>
          </thead>
          <tbody>

          </tbody>
        </table>
      </div>

      <section className="flex justify-around pt-2">
        <Button text='Agregar'/>
        <Button text='Modificar'/>
        <Button text='Salir'/>
      </section>
    </div>
  )
}
