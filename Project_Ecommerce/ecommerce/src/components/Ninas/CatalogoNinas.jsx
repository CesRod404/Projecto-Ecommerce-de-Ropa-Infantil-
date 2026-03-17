import { useEffect, useState, useContext} from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import ProductoCard from "../ProductoCard";

export default function CatalogoNinas() {

  const { token } = useContext(AuthContext);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${API_URL}/api/productos/categoria/ropa-niña`)
      .then(res => res.json())
      .then(data => setProductos(data))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!token) return;

    fetch(`${API_URL}/api/usuario/mis-productos`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setLikes(data.likes.map(p => p._id)));

  }, [token]);

  if (loading) return <p>Cargando productos...</p>;

  if (productos.length === 0)
    return <p>No hay productos en la categoría Niñas</p>;

  return (
    <section className="catalogo-ninas">
      <h2>Catálogo Niñas</h2>

      <div className="catalogo-grid">
        {productos.map(producto => (
          <ProductoCard 
          key={producto._id} 
          producto={producto} 
          likes={likes}
          setLikes={setLikes}
          />
        ))}
      </div>
    </section>
  );
}
