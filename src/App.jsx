// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Productos from "./pages/Productos";
import Cookies from "./pages/Cookies";
import Presupuesto from "./pages/Presupuesto";
import Navbar from "./components/Navbar"; // 👈 nuevo
import Footer from "./components/Footer";
import Carrito from "./pages/Carrito";
import AdminPedidos from "./pages/admin/AdminPedidos";
import AdminLogin from "./pages/admin/AdminLogin";
import WhatsAppButton from "./components/WhatsAppButton";

function App() {
  return (
    <div className="app">
      <Navbar /> {/* 👈 en vez de Header */}
      {/* sin padding para que el Home sea full width */}
      <main style={{ minHeight: "70vh" }}>
        <Routes>
          {/* públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/presupuesto" element={<Presupuesto />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* admin */}
          <Route path="/admin/pedidos" element={<AdminPedidos />} />
        </Routes>
      </main>
      <WhatsAppButton />
      <Footer />
    </div>
  );
}

export default App;
