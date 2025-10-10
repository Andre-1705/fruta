import './App.css';
import { Header } from './componentes/Header/Header.jsx';
import { Footer } from './componentes/Footer/Footer.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VistaContacto from './pages/VistaContacto.jsx';
import VistaProductos from './pages/VistaProductos.jsx';
import VistaCarrito from './pages/VistaCarrito.jsx';
import VistaNosotras from './pages/VistaNosotras.jsx';
import Producto from './pages/Producto.jsx';


function App() {
  return (
    <Router>
      <Header />

      <Routes>
        <Route path="/VistaContacto" element={<VistaContacto />} />
        <Route path="/VistaNosotras" element={<VistaNosotras />} />
        <Route path="/VistaProductos" element={<VistaProductos />} />
        <Route path="/VistaCarrito" element={<VistaCarrito />} />
        <Route path="/producto/:id" element={<Producto />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;


