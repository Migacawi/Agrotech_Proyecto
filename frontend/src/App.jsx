import { Routes, Route } from "react-router-dom";
import AgrotechHome from "./pages/AgrotechHome.jsx";
import VerTodo from "./pages/VerTodo.jsx";
import Perfil from "./pages/Perfil";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AgrotechHome />} />
      <Route path="/ver-todo" element={<VerTodo />} />
      <Route path="/perfil" element={<Perfil />} />
    </Routes>
  );
}

export default App;