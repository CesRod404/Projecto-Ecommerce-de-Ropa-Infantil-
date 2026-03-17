import { useParams } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DetalleProducto() {
  const navigate = useNavigate();
  const { id } = useParams();
  const API_URL = import.meta.env.VITE_API_URL;
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);

  const { token, isAuthenticated } = useContext(AuthContext);

  const [mensajeCarrito, setMensajeCarrito] = useState("");

  const agregarCarrito = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    await fetch(
      `${API_URL}/api/usuario/carrito/${producto._id}`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    setMensajeCarrito("Producto agregado al carrito ");

    // Ocultarlo después de 2 segundos
    setTimeout(() => {
      setMensajeCarrito("");
    }, 2000);

  };

  useEffect(() => {
    fetch(`${API_URL}/api/productos/${id}`)
      .then(res => res.json())
      .then(data => setProducto(data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return <div className="detalle-loading">Cargando producto...</div>;

  if (!producto)
    return <div className="detalle-error">Producto no encontrado</div>;

  return (
    <section className="detalle">
      <div className="detalle__container">

        {/* IMAGEN */}
        <div className="detalle__image-wrapper">
          <img
            src={`${API_URL}${producto.imagen}`}
            alt={producto.nombre}
            className="detalle__image"
          />
        </div>

        {/* INFO */}
        <div className="detalle__info">

          <h1 className="detalle__title">{producto.nombre}</h1>

          <p className="detalle__price">
            ${producto.precio}
          </p>

          <p className="detalle__description">
            {producto.descripcion}
          </p>

          <div className="detalle__meta">
            {producto.temporada && (
              <div className="detalle__meta-item">
                <span>Temporada</span>
                <strong>{producto.temporada}</strong>
              </div>
            )}

            {producto.rangoEdad && (
              <div className="detalle__meta-item">
                <span>Edad</span>
                <strong>{producto.rangoEdad}</strong>
              </div>
            )}
          </div>

          <button
            className="detalle__button"
            onClick={agregarCarrito}
          >
            Agregar al carrito
          </button>

          {mensajeCarrito && (
            <div className="mensaje-carrito">
              {mensajeCarrito}
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
