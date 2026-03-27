import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Productos from "./pages/Productos";
import Tortas from "./pages/Tortas";
import Presupuesto from "./pages/Presupuesto";
import PresupuestoTorta from "./pages/PresupuestoTorta";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminPedidos from "./pages/admin/AdminPedidos";
import AdminLogin from "./pages/admin/AdminLogin";
import WhatsAppButton from "./components/WhatsAppButton";
import PascuasPopup from "./components/PascuasPopup";

function App() {
  const location = useLocation();

  return (
    <div className="app">
      <Navbar />

      {location.pathname === "/" && <PascuasPopup />}

      <main style={{ minHeight: "70vh" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/tortas" element={<Tortas />} />
          <Route path="/presupuesto" element={<Presupuesto />} />
          <Route path="/presupuesto/tortas" element={<PresupuestoTorta />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          <Route path="/admin/pedidos" element={<AdminPedidos />} />
        </Routes>
      </main>

      <WhatsAppButton />
      <Footer />
    </div>
  );
}

export default App;
