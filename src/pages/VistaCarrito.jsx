import { Carrito } from '../componentes/Carrito/Carrito';


export default function VistaCarrito({ carrito, agregarAlCarrito, removerDelCarrito }) {
  return (
    <section>
      <h2>Revisa cómo esta quedando tu carrito</h2>
      <Carrito
        carrito={carrito}
        agregarAlCarrito={agregarAlCarrito}
        removerDelCarrito={removerDelCarrito}
      />
    </section>
  );
}
