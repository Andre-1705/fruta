import './App.css';
import { useState } from 'react';
import { Header } from './componentes/Header/Header';
import { Footer } from './componentes/Footer/Footer';
import { ItemListContainer } from './componentes/ItemListContainer/ItemListContainer';
import Formulario from './componentes/Formulario/Formulario';

function App() {
  const [carrito, setCarrito] = useState([]);

  const productosArray = [
    {
      id: 1,
      img: "/assets/banana.jpg",
      nombre: 'Banana',
      precio: 100,
      descripcion: 'ecuatoriana',
    },
    {
      id: 2,
      img: "/assets/naranja.jpg",
      nombre: 'Naranja',
      precio: 200,
      descripcion: 'roja',
    },
    {
      id: 3,
      img: "/assets/mandarina.jpg",
      nombre: 'Mandarina',
      precio: 300,
      descripcion: 'de estación',
    }
  ];


  // Función para agregar un producto al carrito
  //

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

  const removerDelCarrito = (id) => {
    setCarrito(previoCarrito => previoCarrito.filter(producto => producto.id !== id));
  };

  return (
    <>
      <div>
        <Header />

        <ItemListContainer
          titulo="Productos"
          productosArray={productosArray}
          carrito={carrito}
          agregarAlCarrito={agregarAlCarrito}
          removerDelCarrito={removerDelCarrito}
        />

        <Formulario />
        <Footer />
      </div>
    </>
  );
}

export default App;