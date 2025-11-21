
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './componentes/ProtectedRoute.jsx';

// Componentes visuales
import { Header } from './componentes/Header/Header.jsx';
import { Footer } from './componentes/Footer/Footer.jsx';
import  ItemListContainer from './componentes/ItemListContainer/ItemListContainer.jsx';
import Home from './pages/Home.jsx';

// Vistas principales
import VistaContacto from './pages/VistaContacto.jsx';
//import VistaProductos from './pages/VistaProductos.jsx';
import VistaCarrito from './pages/VistaCarrito.jsx';
import VistaNosotras from './pages/VistaNosotras.jsx';
import InicioSesion from './pages/InicioSesion.jsx';

// Para la ruta dinámica producto:id importo ItemDetailContainer

import ItemDetailContainer from './componentes/ItemDetailContainer/ItemDetailContainer.jsx';
import ProductosAdminPanel from './componentes/adminComponents/ProductosAdminPanel.jsx';
import AdminRoute from './componentes/AdminRoute.jsx';
import NotFound from './pages/NotFound.jsx';

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
            {/* Página de inicio de sesión dedicada */}
            <Route path="/login" element={<InicioSesion />} />
            {/* /Registrate muestra el mismo formulario de inicio de sesión */}
            <Route path="/Registrate" element={<InicioSesion />} />
            <Route path="/VistaProductos" element={<ItemListContainer />} />
            <Route path="/VistaCarrito" element={
            <ProtectedRoute>
                <VistaCarrito />
              </ProtectedRoute>} />
            <Route path="/producto/:id" element={<ItemDetailContainer />} />
            <Route path="/categoria/:categoria" element={<ItemListContainer />} />

            <Route path="/dashboard" element={
              <ProtectedRoute>
                <h2>Panel de Administración</h2>
              </ProtectedRoute>} />
            <Route path="/admin/productos" element={
              <AdminRoute>
                <ProductosAdminPanel />
              </AdminRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
