import { Route, Routes } from "react-router-dom";
import { ListPublicaciones } from "../pages/ListPublicaciones"
import { PostPublicacion } from "../pages/PostPublicacion";

export const PublicacionesRouter = () => {
  return (
        <Routes>
            <Route path="/list" element={<ListPublicaciones />}/>
            <Route path="/agregar" element={<PostPublicacion />}/>
            
        </Routes>
  )
}
