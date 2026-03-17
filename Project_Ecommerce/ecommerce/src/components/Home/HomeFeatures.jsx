import logoEnvio from "../../images/logoEnvio.png"
import logoServicio from "../../images/logoServicio.png"
import logoTarjeta from "../../images/logoTarjeta.png"

export default function HomeFeatures() {
  return (
    <section className="home-features">
      <div className="home-features__item">
        <img src={logoEnvio} alt="" className="home-features__logo" />
        <p>Envío Gratis</p>
        <p>En pedidos superiores a 50$</p>
      </div>
      <div className="home-features__item">
        <img src={logoServicio} alt="" className="home-features__logo" />
        <p>Pago Seguro</p>
        <p>100% protección garantizada</p>
      </div>
      
      <div className="home-features__item">
        <img src={logoTarjeta} alt="" className="home-features__logo" />
        <p>Atención Personal</p>
        <p>Asesoramiento experto</p>
      </div>
    </section>
  );
}