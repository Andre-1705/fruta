
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './componentes/ProtectedRoute.jsx';

// Componentes visuales
import Layout from './pages/Layout.jsx';
import { Header } from './componentes/Header/Header.jsx';
import { Footer } from './componentes/Footer/Footer.jsx';
import Home from './pages/Home.jsx';

// Vistas principales
import VistaContacto from './pages/VistaContacto.jsx';
import VistaProductos from './pages/VistaProductos.jsx';
import VistaCarrito from './pages/VistaCarrito.jsx';
import VistaNosotras from './pages/VistaNosotras.jsx';
import Registrate from './pages/Registrate.jsx';

// Para la ruta dinámica producto:id importo ItemDetailContainer

import ItemDetailContainer from './componentes/ItemDetailContainer/ItemDetailContainer.jsx';

function App() {
  return (
    <Router>
      <div className="app-layout">
        <Header />
        <main className="app-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/VistaContacto" element={<VistaContacto />} />
            <Route path="/VistaNosotras" element={<VistaNosotras />} />
            <Route path="/Registrate" element={<Registrate />} />
            <Route path="/VistaProductos" element={<VistaProductos />} />
            <Route path="/VistaCarrito" element={
              <ProtectedRoute>
                <VistaCarrito />
              </ProtectedRoute>} />
            <Route path="/producto/:id" element={<ItemDetailContainer/>} />
            {/* Añade una ruta para el dashboard para que la redirección funcione */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <h2>Panel de Administración</h2>
              </ProtectedRoute>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
