import { useEffect } from "react"
import { useOrdenesStore } from "../../hooks/useOrdenesStore"
import OrdenItem from "../components/OrdenItem";

export const VentaList = () => {

  const { active, isLoading, ordenes, clearAll, startGetOrdenes } = useOrdenesStore();

  useEffect(() => {
    startGetOrdenes();
  },[]);


  return (
    <section className="w-full bg-yellow-500">
      <h1 className="text-center font-bold text-2xl mb-2">Ordenes</h1>
      <div className="flex justify-center gap-2">
        <label htmlFor="buscador" className="text-2xl">Buscador</label>
        <input type="text" name="buscador" className="w-72 text-2xl border border-black" id="buscador" />
      </div>

      <main className="h-[calc(100vh-120px)] bg-white overflow-scroll mt-2">
        <table className="w-full">
          <thead >
            <tr>
              <th className="border border-black">Fecha</th>
              <th className="border border-black">Cliente</th>
              <th className="border border-black">Importe</th>
              <th className="border border-black">Status</th>
              <th className="border border-black">Ver Detalles</th>
            </tr>
          </thead>
          <tbody>
            {
              ordenes.map( orden => (
                <OrdenItem key={orden.id} {...orden} />
              ))
            }
          </tbody>
        </table>
      </main>

    </section>
    )}
