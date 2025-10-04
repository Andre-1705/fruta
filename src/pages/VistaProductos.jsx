import ItemList from '../componentes/ItemList/ItemList.jsx';
import './VistaProductos.css';

// Ver si requiere de mas css y props

const VistaProductos = ({ carrito, agregarAlCarrito, removerDelCarrito }) => {
  return (

    <div className="vista-productos"> 
      <h1>Hora de Armar... tu propio carrito!!!!</h1>
      <ItemList
        lista={producto}
        hoveredId={hoveredId}
        setHoveredId={setHoveredId}
        carrito={carrito}
        agregarAlCarrito={agregarAlCarrito}
        removerDelCarrito={removerDelCarrito}
      />
    </div>
  );
};

export default VistaProductos;
