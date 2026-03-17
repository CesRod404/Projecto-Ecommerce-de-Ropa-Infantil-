import { useEffect, useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

export default function HomeDestacados() {
  const { token, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const [productos, setProductos] = useState([]);
  const [todosProductos, setTodosProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mostrarSelector, setMostrarSelector] = useState(false);

  const obtenerDestacados = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_URL}/api/productos/destacados`
      );
      const data = await response.json();
      if (response.ok) setProductos(data);
    } catch (error) {
      console.error("Error obteniendo destacados:", error);
    } finally {
      setLoading(false);
    }
  };

  const obtenerTodosProductos = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/productos`
      );
      const data = await response.json();
      if (response.ok) setTodosProductos(data);
    } catch (error) {
      console.error("Error obteniendo productos:", error);
    }
  };

  useEffect(() => {
    obtenerDestacados();
    if (isAdmin) obtenerTodosProductos();
  }, [isAdmin]);

  const cambiarDestacado = async (idProducto, nuevoEstado) => {
    try {
      const response = await fetch(
        `${API_URL}/api/productos/${idProducto}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ destacado: nuevoEstado })
        }
      );

      if (!response.ok) {
        alert("Error actualizando destacado");
        return;
      }

      obtenerDestacados();
      obtenerTodosProductos();

    } catch (error) {
      console.error("Error cambiando destacado:", error);
    }
  };

  return (
    <section className="home-destacados">
      <div className="home-destacados__container">

        <div className="home-destacados__header">
          <div>
            <span className="home-destacados__subtitle">Destacados</span>
            <h2 className="home-destacados__title">Productos Favoritos</h2>
          </div>

          <NavLink
            to="/catalogo"
            className="home-destacados__catalog-button"
          >
            Ver todo el catálogo
          </NavLink>
        </div>

        {/* ADMIN PANEL */}
        {isAdmin && (
          <div className="home-destacados__admin">
            <button
              className="admin-toggle-button"
              onClick={() => setMostrarSelector(!mostrarSelector)}
            >
              Añadir producto
            </button>

            {mostrarSelector && (
              <div className="admin-selector">
                <select
                  className="admin-select"
                  defaultValue=""
                  onChange={(e) => {
                    const id = e.target.value;
                    if (id) {
                      cambiarDestacado(id, true);
                      e.target.value = "";
                    }
                  }}
                >
                  <option value="">Seleccionar producto</option>
                  {todosProductos
                    .filter(p => !p.destacado)
                    .map(producto => (
                      <option key={producto._id} value={producto._id}>
                        {producto.nombre}
                      </option>
                    ))}
                </select>
              </div>
            )}
          </div>
        )}

        {loading ? (
          <div className="home-destacados__loading">Cargando...</div>
        ) : (
          <div className="home-destacados__grid">
            {productos.map(producto => (
              <div
                key={producto._id}
                className="home-destacados__card"
              >
                <div
                  className="card-click-area"
                  onClick={() => navigate(`/producto/${producto._id}`)}
                >
                  <div className="card-image-wrapper">
                    {producto.imagen && (
                      <img
                        src={`${API_URL}${producto.imagen}`}
                        alt={producto.nombre}
                      />
                    )}
                  </div>

                  <div className="card-content">
                    <span className="card-category">
                      {producto.categoria}
                    </span>
                    <h3 className="card-title">
                      {producto.nombre}
                    </h3>
                  </div>
                </div>

                {isAdmin && (
                  <button
                    className="remove-destacado-button"
                    onClick={() =>
                      cambiarDestacado(producto._id, false)
                    }
                  >
                    Quitar
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
