import './App.css';
import { useState } from 'react';
//import { useEffect } from 'react'; para futuras apis
import { Header } from './componentes/Header/Header';
import { Footer } from './componentes/Footer/Footer';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Nosotras from './pages/VistaNosotras.jsx';
import VistaContacto from './pages/VistaContacto.jsx';
import Carrito from './pages/VistaCarrito.jsx';
import VistaProductos from './pages/VistaProductos.jsx';
import VistaCarrito from './pages/VistaCarrito.jsx';
import VistaNosotras from './pages/VistaNosotras.jsx';


function App() {
  const [carrito, setCarrito] = useState([]);



  // Función para agregar un producto al carrito
  // Si el producto ya existe, incrementa su cantidad en 1
  // Si no existe, lo agrega al carrito con cantidad 1
  // Mapea el carrito y actualiza el estado

  const agregarAlCarrito = (productoNuevo) => {
    setCarrito(previoCarrito => {
      const productoExistente = previoCarrito.find(producto => producto.id === productoNuevo.id);

      if (productoExistente) {
        return previoCarrito.map(producto => {
          if (producto.id === productoNuevo.id) {
            return {
              id: producto.id,
              nombre: producto.nombre,
              precio: producto.precio,
              descripcion: producto.descripcion,
              img: producto.img,
              cantidad: producto.cantidad + 1
            };
          } else {
            return producto;
          }
        });
      } else {
        return [
          ...previoCarrito,
          {
            id: productoNuevo.id,
            nombre: productoNuevo.nombre,
            precio: productoNuevo.precio,
            descripcion: productoNuevo.descripcion,
            img: productoNuevo.img,
            cantidad: 1
          }
        ];
      }
    });
  };

  // Función para remover el producto del carrito
  // Filtra el carrito y actualiza el estado
  

  const removerDelCarrito = (idProducto) => {
    setCarrito(previoCarrito => 
      previoCarrito

        .map(producto => 
        producto.id === idProducto
          ? { ...producto, cantidad : producto.cantidad - 1 }
          : producto
        )      
        .filter(producto => producto.cantidad > 0)
      );
  };

  return (
    <>
      <div>
        
        <Router>
          <Header />

          <Routes>        
            <Route path="/VistaContacto" element={<VistaContacto />} />
            <Route path="/VistaNosotras" element={<VistaNosotras />} />
            <Route path="/VistaProductos" element={ 
              <VistaProductos
                lista={productoId}
                hoveredId={hoveredId}
                setHoveredId={setHoveredId}           
                carrito={carrito}
                agregarAlCarrito={agregarAlCarrito}
                removerDelCarrito={removerDelCarrito}
             />
            } />
            <Route path="/VistaCarrito" element={
              <VistaCarrito
                carrito={carrito}
                agregarAlCarrito={agregarAlCarrito}
                removerDelCarrito={removerDelCarrito}
              />
            } />
    </Routes>

          <Footer />
       </Router>  
    </div>
    </>
  );
}

export default App;