import { Route, Routes } from "react-router-dom";
import { VentaList } from "../pages/VentaList";

export const VentaRouter = () => {
  return (
    <Routes>
        <Route path='/list' element={<VentaList />} />
    </Routes>
  )
};
