import { Routes, Route } from "react-router-dom";

import AgrotechHome      from "./pages/AgrotechHome.jsx";
import VerTodo           from "./pages/VerTodo.jsx";
import Perfil            from "./pages/Perfil.jsx";
import DescripcionProduct from "./pages/DescripcionProduct.jsx";
import AñadirProduct     from "./pages/AñadirProduct";
import Checkout          from "./pages/Checkout";
import Login             from "./pages/Login.jsx";
import ProtectedRoute    from "./router/ProtectedRoute.jsx";

function App() {
  return (
    <Routes>

      {/* ── Rutas públicas ──────────────────────────────────────────── */}
      <Route path="/login"    element={<Login />} />
      <Route path="/"         element={<AgrotechHome />} />
      <Route path="/ver-todo" element={<VerTodo />} />
      <Route path="/producto" element={<DescripcionProduct />} />

      {/* ── Rutas autenticadas (cualquier rol) ──────────────────────── */}
      <Route element={<ProtectedRoute />}>
        <Route path="/perfil"   element={<Perfil />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/añadir-producto" element={<AñadirProduct />} />
        <Route path="/mis-productos"   element={<AñadirProduct />} />
  
      </Route>

      {/* ── Solo vendedor o admin ────────────────────────────────────── 
      <Route element={<ProtectedRoute roles={['vendedor', 'admin']} />}>
        <Route path="/añadir-producto" element={<AñadirProduct />} />
        <Route path="/mis-productos"   element={<AñadirProduct />} />
      </Route>
        */}
    </Routes>
  );
}

export default App;
