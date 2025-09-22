 // Importación del hook useState de React, aunque no se está utilizando en este momento.
import { useState } from 'react'

// Importación de los estilos CSS para este componente
import './App.css'
// Importación de los componentes Header, Footer e ItemListContainer
import { Header } from './componentes/Header/Header'
import { Footer } from './componentes/Footer/Footer' 
import { ItemListContainer } from './componentes/ItemListContainer/ItemListContainer'
import { Nosotros } from './componentes/Nosotros/Nosotros'


// Definición del componente principal de la aplicación: App.
function App() {
  // Array de objetos "productos". Cada objeto representa una fruta con sus propiedades 
 const productos = [
  { id:1, 
    img: "/assets/banana.jpg",
    nombre: 'Banana',
    precio: 100, 
    descripcion: 'ecuatoriana',
 },
  { id:2,
    img: "/assets/naranja.jpg",
    nombre: 'Naranja',
    precio: 200,
    descripcion: 'roja',
  },
  { id:3,
    img: "/assets/mandarina.jpg",
    nombre: 'Mandarina',
    precio: 300,
    descripcion: 'de estación',
  }
  ]

  // El método return contiene el JSX que se renderizará.
  return (
    // Fragmento de React para agrupar los elementos.
    <>
    <div>
      {/* Renderiza el componente Header */}
      <Header />

      {/* Renderiza el componente ItemListContainer, pasándole el título y la lista de productos como props. */}
       <ItemListContainer titulo ="Bienvenidos a 'Fruta':
                        Acá las cosas caen por su propio peso" productos={productos}/> 

      {/* Renderiza el componente Nosotros */}
       <Nosotros /> 
       
      {/* Renderiza el componente Footer */}
      <Footer />

    </div>
    
    </>

  );
}

// Exportación por defecto del componente App.
export default App;
