import { useEffect, useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Favoritos() {
  const { token, isAuthenticated } = useContext(AuthContext);
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    fetch(`${API_URL}/api/usuario/mis-productos`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setLikes(data.likes))
      .finally(() => setLoading(false));
  }, [token, isAuthenticated, navigate]);

  if (loading) return <p>Cargando favoritos...</p>;

  if (likes.length === 0)
    return <p>No tienes productos en favoritos ❤️</p>;

  return (
    <section className="wishlist">
      <h2>Mis Favoritos</h2>

      <div className="catalogo-grid">
        {likes.map(producto => (
          <div key={producto._id} className="catalogo-card">

            <img
              src={`${API_URL}${producto.imagen}`}
              alt={producto.nombre}
            />

            <h3>{producto.nombre}</h3>
            <p>${producto.precio}</p>

            <Link to={`/producto/${producto._id}`}>
              Ver detalle
            </Link>

          </div>
        ))}
      </div>
    </section>
  );
}
