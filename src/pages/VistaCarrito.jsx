import { Carrito } from '../componentes/Carrito/Carrito';


export default function VistaCarrito({ carrito, agregarAlCarrito, removerDelCarrito }) {
  return (
    <section>
      <h2>Hora de Armar... Tu propio carrito!!!!</h2>
      <Carrito
        carrito={carrito}
        agregarAlCarrito={agregarAlCarrito}
        removerDelCarrito={removerDelCarrito}
      />
    </section>
  );
}