import React from "react";
import { Routes, Route } from "react-router-dom";

import AgrotechHome       from "./pages/AgrotechHome.jsx";
import VerTodo            from "./pages/VerTodo.jsx";
import Perfil             from "./pages/Perfil.jsx";
import DescripcionProduct from "./pages/DescripcionProduct.jsx";
import AñadirProduct      from "./pages/AñadirProduct";
import Checkout           from "./pages/Checkout";
import Login              from "./pages/Login.jsx";
import Register           from "./pages/Register.jsx";
import ProtectedRoute     from "./router/ProtectedRoute.jsx";
import AdminUsuarios      from "./pages/AdminUsuarios.jsx";
import AdminProductos     from "./pages/AdminProductos.jsx";
import MisProductos       from "./pages/MisProductos.jsx";
import ConfirmacionPedido from "./pages/ConfirmacionPedido.jsx";

function App() {
  return (
    <Routes>
      {/* ── Rutas públicas ──────────────────────────────────────────── */}
      <Route path="/login"    element={<Login />} />
      <Route path="/registro" element={<Register />} />
      <Route path="/"         element={<AgrotechHome />} />
      <Route path="/ver-todo" element={<VerTodo />} />
      <Route path="/producto" element={<DescripcionProduct />} />

      {/* ── Rutas autenticadas (cualquier rol) ──────────────────────── */}
      <Route element={<ProtectedRoute />}>
        <Route path="/perfil"           element={<Perfil />} />
        <Route path="/checkout"         element={<Checkout />} />
        <Route path="/añadir-producto"  element={<AñadirProduct />} />
        <Route path="/mis-productos"    element={<MisProductos />} />
        <Route path="/confirmacion/:id" element={<ConfirmacionPedido />} />
      </Route>

      {/* ── Solo admin ──────────────────────────────────────────────── */}
      <Route element={<ProtectedRoute roles={["Administrador"]} />}>
        <Route path="/admin/usuarios"  element={<AdminUsuarios />} />
        <Route path="/admin/productos" element={<AdminProductos />} />
      </Route>
    </Routes>
  );
}

export default App;