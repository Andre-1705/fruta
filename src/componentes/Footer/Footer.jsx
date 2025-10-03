import './Footer.css';

export const Footer = () => {
  return (
    <footer>
      
      <div className="iconos-redes">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
            <img src="/assets/icon/logo_face.png" alt="Logo Facebook"/>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
            <img src="/assets/icon/logo_insta.png" alt="Logo Instagram"/>
        <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">Tik Tok</a>
            <img src="/assets/icon/logo_tiktok.png" alt="Logo Tik Tok"/>
         <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer">Whats Apps</a>
            <img src="/assets/icon/logo_watsapp.png" alt="Logo Whats Apps"/>

      </div>
         <p>Reservamos fruta solo por derecha &copy; 2025</p>
    </footer>
  );
};

export default Footer;
