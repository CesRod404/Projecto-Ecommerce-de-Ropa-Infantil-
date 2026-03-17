export default function Contacto() {
  return (
    <section className="contacto">
      <h2>Contacto</h2>
      <p className="contacto__intro">
        Si deseas más información o tienes alguna duda, puedes comunicarte conmigo:
      </p>

      <div className="contacto__info">
        <div className="contacto__card">
          <h3>Correo</h3>
          <a href="mailto:cesarnef@outlook.com" className="contacto__link">
            cesarnef@outlook.com
          </a>
        </div>

        <div className="contacto__card">
          <h3>Teléfono</h3>
          <a href="tel:492949834" className="contacto__link">
            492 949 834
          </a>
        </div>
      </div>
    </section>
  );
}