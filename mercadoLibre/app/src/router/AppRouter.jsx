import { Route, Routes } from "react-router-dom";
import { PublicacionesRouter } from "../Publicaciones/router/PublicacionesRouter";

export const AppRouter = () => {
  return (
    <Routes>
        <Route path="/publicaciones/*" element={<PublicacionesRouter />} />
    </Routes>
  )
}
