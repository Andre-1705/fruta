//falta decidir home, css de main!


import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Componentes visuales
import { Header } from './componentes/Header/Header.jsx';
import { Footer } from './componentes/Footer/Footer.jsx';

// Vistas principales
import VistaContacto from './pages/VistaContacto.jsx';
import VistaProductos from './pages/VistaProductos.jsx';
import VistaCarrito from './pages/VistaCarrito.jsx';
import VistaNosotras from './pages/VistaNosotras.jsx';

// Para la ruta dinámica producto:id importo ItemDetailContainer

import ItemDetailContainer from './componentes/ItemDetailContainer/ItemDetailContainer.jsx';

function App() {
  return (
      <Router>
        <Header />

        <Routes>
          <Route path="/VistaContacto" element={<VistaContacto />} />
          <Route path="/VistaNosotras" element={<VistaNosotras />} />
          <Route path="/VistaProductos" element={<VistaProductos />} />
          <Route path="/VistaCarrito" element={<VistaCarrito />} />
          <Route path="/producto/:id" element={<ItemDetailContainer/>} />
        </Routes>
        <Footer />
      </Router>
  );
}

export default App;
