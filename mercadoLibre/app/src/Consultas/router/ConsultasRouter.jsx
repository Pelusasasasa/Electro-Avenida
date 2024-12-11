import { Route, Routes } from "react-router-dom"
import { ListaConsulta } from "../pages/ListaConsulta"

export const ConsultasRouter = () => {
  return (
    <Routes>
        <Route  path="/list" element={<ListaConsulta />}/>
    </Routes>
  )
}
