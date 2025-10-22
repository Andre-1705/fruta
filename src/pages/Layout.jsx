// src/pages/Layout.jsx

import './Layouts.css';
import { Header } from '../componentes/Header/Header.jsx';
import { Footer } from '../componentes/Footer/Footer.jsx';
import { Outlet } from "react-router-dom";


export default function Layout() {
  return (
    <div className="layout">
      <Header />
      <main className="contenido">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
