import './App.css';
import { useState } from 'react';
import { useEffect } from 'react';
import { Header } from './componentes/Header/Header';
import { Footer } from './componentes/Footer/Footer';
import { ItemListContainer } from './componentes/ItemListContainer/ItemListContainer';
import Formulario from './componentes/Formulario/Formulario';
import { Carrito } from './componentes/Carrito/Carrito';


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
      previoCarrito.filter(producto => producto.id !== idProducto));
  };

  return (
    <>
      <div>
        <Header />

        <ItemListContainer
          titulo="Productos"
          carrito={carrito}
          agregarAlCarrito={agregarAlCarrito}
          removerDelCarrito={removerDelCarrito}
        />

        <Carrito carrito={carrito} 
          removerDelCarrito={removerDelCarrito} 
          agregarAlCarrito={agregarAlCarrito} />

        <Formulario />
        <Footer />
      </div>
    </>
  );
}

export default App;