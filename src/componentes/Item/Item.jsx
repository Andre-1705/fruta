
import './Item.css';

export const Item = ({ producto })  => { 

    return(
// La "key" es importante para que React pueda identificar cada elemento de forma única
        <article className="tarjeta" key={producto.id}>
                {/* Se accede y se muestra la imagen del producto */}
                <img src={producto.img} alt={producto.nombre} />
                {/* Se accede y se muestra el nombre del producto */}
                <h2>{ producto.nombre }</h2>
                {/* Se accede y se muestra el precio del producto */}
                <p>Precio: ${producto.precio}</p>
                {/* Se accede y semuestra la descripción del producto */}
                <p>{ producto.descripcion}</p>
            </article>
 );
};