import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import './ItemDetailContainer.css';
import ItemDetail from '../ItemDetail/ItemDetail.jsx';

// id esta definido en App

export const ItemDetailContainer = () => {
    const [ detail, setDetail] = useState({});
    const { id } = useParams();
    const [cargando, setCargando] = useState(true);
    const [ error, setError ] = useState(null);


      useEffect(() => {
        fetch("/data/productosArray.json")
        .then((respuesta) => {
          if (!respuesta.ok) {
            throw new Error("No se pudo cargar el producto");
          }
          return respuesta.json();
          })
//1 = id del producto
        .then((data) => {
          const encontrado = data.find((parametroIterador) => parametroIterador.id === id);
          if(!encontrado) {
            setDetail(encontrado);
            setCargando(false);

           } else {
            throw new Error("Producto no encontrado");
          }

        })
        .catch((error) => {
          console.log(error);
        });
      }, [id]);

      const {nombre, precio, descripcion, img, stock} = detail;

      return(
   <section className="item-detail-container">
      {cargando && <p className="cargando">Cargando Productos...</p>}
      {error && <p className ="error">{error}</p>}

      {!cargando && !error && (

        <ItemDetail
          detail={detail}
        />
        )}
    </section>
      )
};

    export default ItemDetailContainer;
//1.28 minutos de clase 5 y 6 respecto al contedor en blanco
//Ver el cargando de itemlistcontainer
// el primer detail es props el segundo estado
// objeto con claves
//<main>
//        {Object.keys(detail).length ? (
//          <ItemDetail detail={detail} />
//        ) : (
//          <p>Cargando...</p>
//        )}
//      </main>;
