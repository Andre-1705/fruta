// Importación del componente ItemList
import { ItemList } from "../ItemList/ItemList";
import { Carrito } from "../Carrito/Carrito";
import { useState } from "react";
import './ItemListContainer.css';

// Definición del componente ItemListContainer. Este componente recibe "titulo" y "productos" como props.
export const ItemListContainer = ({ titulo, productos }) => {
    const [hoveredId, setHoveredId] = useState(null); // null = ninguna tarjeta activa
    const [carrito, setCarrito] = useState([]);

    const agregarAlCarrito = (producto) => {
        setCarrito((previoCarrito) => {
            const existe = previoCarrito.find(item => item.id === producto.id);
            if (existe) {
                return previoCarrito.map(item =>
                    item.id === producto.id
                        ? { ...item, cantidad: item.cantidad + 1 }
                        : item
                );
            } else {
                return [...previoCarrito, { ...producto, cantidad: 1 }];
            }
        });
    };

    const removerDelCarrito = (id) => {
        setCarrito((previoCarrito) => previoCarrito.filter(item => item.id !== id));
    };

    return( 
        // El elemento <seccion> agrupa el contenido relacionado
        <section className="fila">
            <h1>{titulo}</h1>
            {/* Renderiza el componente ItemList, pasándole la lista de productos como props. Trabajo en el hover*/}
            <ItemList
                lista={productos}
                hoveredId={hoveredId}
                setHoveredId={setHoveredId}
                agregarAlCarrito={agregarAlCarrito}
            />
            <Carrito
                carrito={carrito}
                removerDelCarrito={removerDelCarrito}
            />
        </section>
    );
};
export default ItemListContainer;