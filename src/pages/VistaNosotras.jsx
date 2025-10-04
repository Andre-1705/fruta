import './VistaNosotras.css';

const VistaNosotras = () => {
  return (
    <section className="nosotras">
      <h1>Sobre Nosotras</h1>
      <img className="nosotras-img" 
           src="/assets/tres_generaciones_manos.jpg" alt="Equipo o identidad de la marca"/>
      <p class="nosotras-parrafo">
        Tres generaciones unidas por un misma necesidad, crecer juntas. Solo somos nosotras tres. Entendiendo que la felicidad de la otra es la propia. 
        Por eso nos comprometemos día a día con nuestro negocio. Porque nos comprometemos entre nosotras para darle lo mejor a nuestros clientes. 
        Por esto calidad, innovación y experiencia de usuario se unen en esta app para ofrecer productos de calidad únicas. Bienvenidos!
      </p>
    </section>
  );
};

export default VistaNosotras;