import{NavLink} from 'react-router-dom'

export default function HomeHeader() {
  return (
    <header className="home-header">
      <h1 className="home-header__title">
        Vestidos de ensueño para Momentos Inolvidables
      </h1>
      <p className="home-header__description">
        Descubre nuestra exclusiva colección de ropa infantil y vestidos de bautizo,
        diseñados con amor para los más pequeños de la casa.
      </p>
      <div className="home-header__buttons">
        <NavLink to="/bautizo" className="home-header__button home-header__button--black">
          Ver colección de Bautizo
        </NavLink>
        <NavLink to="/catalogo" className="home-header__button home-header__button--white">
          Explorar Catálogo
        </NavLink>
      </div>
    </header>
  );
}