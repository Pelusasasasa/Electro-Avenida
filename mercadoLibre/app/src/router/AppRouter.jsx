import { Navigate, Route, Routes } from "react-router-dom";
import { PublicacionesRouter } from "../Publicaciones/router/PublicacionesRouter";
import { ConsultasRouter } from "../Consultas/router/ConsultasRouter";
import { VentaRouter } from "../Ventas/router/VentaRouter";

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/ventas/list"/>} />
        <Route path="/publicaciones/*" element={<PublicacionesRouter />} />
        <Route path="/ventas/*" element={<VentaRouter />} />
        <Route path="/consultas/*" element={<ConsultasRouter />} />
        
    </Routes>
  )
}
