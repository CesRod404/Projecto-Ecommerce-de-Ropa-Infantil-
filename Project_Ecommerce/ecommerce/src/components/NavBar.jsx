import { NavLink, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "./AuthContext";

import corazon from "../images/corazon.png";
import carrito from "../images/carrito-de-compras.png";
import logoPrincipal from "../images/ropa-de-bebe.png";
import acceso from "../images/acceso.png";
import accesoActivo from "../images/accesoVerde.png";

export default function NavBar() {
  const { isAuthenticated, logout, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleLoginClick = () => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      setShowMenu(!showMenu);
    }
  };

  const handleLogout = () => {
    logout();
    setShowMenu(false);
    navigate("/");
  };

  return (
    <div className="container">
      <NavLink to={"/"}>
      <img src={logoPrincipal} alt="Logo de tienda" className="logo_principal" />
      </NavLink>

      {/* Botón hamburguesa solo visible en móvil */}
      <button 
        onClick={() => setShowMenu(!showMenu)} 
        className="hamburger"
      >
        ☰
      </button>


      <nav className={`menu ${showMenu ? "menu--active" : ""}`}>
        <NavLink to="/" className="menu__link">Inicio</NavLink>
        <NavLink to="/catalogo" className="menu__link">Catálogo</NavLink>
        <NavLink to="/bautizo" className="menu__link">Bautizo</NavLink>
        <NavLink to="/ninas" className="menu__link">Niñas</NavLink>
        <NavLink to="/ninos" className="menu__link">Niños</NavLink>
        <NavLink to="/accesorios" className="menu__link">Accesorios</NavLink>
        <NavLink to="/contacto" className="menu__link">Contacto</NavLink>
        <NavLink to="/pedidos" className="menu__link">Mis pedidos</NavLink>

        {isAdmin && (
          <NavLink to="/admin" className="menu__link admin-link">
            Panel Admin
          </NavLink>
          
        )}

        {isAdmin && (
          <NavLink to="/adminPedidos" className="menu__link admin-link">
            Admin Pedidos
          </NavLink>
          
        )}

      </nav>

      <div className="container__logo">
            <div className="icon-wrapper login-wrapper">
                <button onClick={handleLoginClick} className="icon-button">
                <img
                    src={isAuthenticated ? accesoActivo : acceso}
                    alt="Acceso"
                    className="icon-img"
                />
                </button>

                {isAuthenticated && showMenu && (
                <div className="dropdown-menu">
                    <button onClick={handleLogout} className="logout-button">
                    Cerrar sesión
                    </button>
                </div>
                )}
            </div>

            {/* FAVORITOS */}
            <div className="icon-wrapper">
                <NavLink to="/favoritos" className="icon-link">
                <img src={corazon} alt="Favoritos" className="icon-img" />
                </NavLink>
            </div>

            {/* CARRITO */}
            <div className="icon-wrapper">
                <NavLink to="/carrito" className="icon-link">
                <img src={carrito} alt="Carrito" className="icon-img" />
                </NavLink>
            </div>   
      </div>
    </div>
  );
}
