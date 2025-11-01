import './VistaNosotras.css';

//vista home?


const VistaNosotras = () => {
  return (
    <section className="nosotras">
      <h1 className="nosotras-titulo">Sobre Nosotras</h1>
      
      <div className="nosotras-contenido">
        <img className="nosotras-img" alt="Equipo o identidad de la marca"
             src="/assets/tres_generaciones_manos.jpg" />

        <p className="nosotras-parrafo">
          Tres generaciones unidas por un misma necesidad, crecer juntas. Somos nosotras tres, entendiendo que la felicidad de la otra es la propia.
          Por eso nos comprometemos día a día con nuestro negocio, para darle lo mejor a nuestros clientes.
          Por esto calidad, innovación y experiencia de usuario se unen en esta app para ofrecer productos de calidad únicas. Bienvenidos!
        </p>
      </div>
    </section>
  );
};

export default VistaNosotras;
