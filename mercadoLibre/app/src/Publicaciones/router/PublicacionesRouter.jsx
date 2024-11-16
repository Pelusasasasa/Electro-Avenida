import { Route, Routes } from "react-router-dom";
import { ListPublicaciones } from "../pages/ListPublicaciones"

export const PublicacionesRouter = () => {
  return (
        <Routes>
            <Route path="/list" element={<ListPublicaciones />}/>
        </Routes>
  )
}
