import { Routes, Route } from "react-router-dom";
import AgrotechHome from "./pages/AgrotechHome.jsx";
import VerTodo from "./pages/VerTodo.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AgrotechHome />} />
      <Route path="/ver-todo" element={<VerTodo />} />
    </Routes>
  );
}

export default App;