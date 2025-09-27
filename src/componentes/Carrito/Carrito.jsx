import "./Carrito.css";

// src/components/Carrito/Carrito.jsx 
// Va a mostrar el carrito con los productos que se han añadido 
// Vamos a colocar la funcionalidad de obtener el total del carrito
// reduce es el método que nos permite reducir el array productos a un solo valor
// Accediendo al precio del producto por la cantidad del mismo inicializados en 0

export const Carrito = ({ carrito, removerDelCarrito }) => {
       const obtenerTotal = () => {
        return carrito.reduce ((total, producto) =>
            total + (producto.precio * (producto.cantidad || 0 )), 0);
       };

    return (
        <div className="carrito">

            <h2>Carrito</h2>

            {/*Si mostrar si esta vacío, si el largo de carrito es igual a = 0 indico que carrito está vacío*/}

            {carrito.length === 0 ? (
                <p>El carrito está vacío</p>
            ) : (

            carrito.map(producto => (
                <div key={producto.id} className="carrito-producto">

            {/* Recorro carrito y muestro nombre, precio, cantidad y total de productos */}

            <span> Producto: {producto.nombre} </span>
            <span> Cantidad: {producto.cantidad}</span> 
            <span> Precio $: {producto.precio} </span>
            <span> Total: $ {producto.precio * producto.cantidad}</span>

            <button onClick={() => removerDelCarrito(producto.id)}>Eliminar</button>
                
            {/* Botón con función flecha para remover por el id de cada producto del carrito */}
            </div>
                ))
            )}
        </div>
    );
};
export default Carrito;
