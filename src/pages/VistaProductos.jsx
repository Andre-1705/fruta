import { useContext } from 'react';
import { CarritoContexto } from '../contexto/CarritoContexto.jsx';
import ItemListContainer from '../componentes/ItemListContainer/ItemListContainer';

export default function VistaProductos() {
  const { carrito, agregarAlCarrito, eliminarDelCarrito } = useContext(CarritoContexto);

  return (
    <ItemListContainer
      carrito={carrito}
      agregarAlCarrito={agregarAlCarrito}
      removerDelCarrito={eliminarDelCarrito}
    />
  );
}
