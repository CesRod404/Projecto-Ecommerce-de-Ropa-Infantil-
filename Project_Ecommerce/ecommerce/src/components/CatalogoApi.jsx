import { useEffect, useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
import ProductoCard from "./ProductoCard";


export default function CatalogoApi() {

  const { token } = useContext(AuthContext);
  const API_URL = import.meta.env.VITE_API_URL;
  const [productosPorCategoria, setProductosPorCategoria] = useState({});
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // LISTA DE CATEGORÍAS
  // =========================
  const categorias = [
    { value: "bautizo-niña", label: "Bautizo Niña" },
    { value: "bautizo-niño", label: "Bautizo Niño" },
    { value: "ropa-niña", label: "Ropa Niña" },
    { value: "ropa-niño", label: "Ropa Niño" },
    { value: "accesorio", label: "Accesorios" }
  ];

  // =========================
  // CARGAR PRODUCTOS POR CATEGORÍA
  // =========================
  useEffect(() => {

    const cargarProductos = async () => {
      setLoading(true);

      let datos = {};

      if (categoriaSeleccionada) {
        const res = await fetch(
          `${API_URL}/api/productos/categoria/${categoriaSeleccionada}`
        );
        const data = await res.json();
        datos[categoriaSeleccionada] = data;
      } else {
        // Cargar todas las categorías
        for (let cat of categorias) {
          const res = await fetch(
            `${API_URL}/api/productos/categoria/${cat.value}`
          );
          const data = await res.json();
          datos[cat.value] = data;
        }
      }

      setProductosPorCategoria(datos);
      setLoading(false);
    };

    cargarProductos();

  }, [categoriaSeleccionada]);

  // =========================
  // CARGAR LIKES
  // =========================
  useEffect(() => {
    if (!token) return;

    fetch(`${API_URL}/api/usuario/mis-productos`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setLikes(data.likes.map(p => p._id)));

  }, [token]);

  if (loading) return <p className="loading">Cargando productos...</p>;

  return (
    <section className="catalogo-api">

      <h2 className="catalogo-title">Catálogo</h2>

      {/* SELECTOR */}
      <div className="catalogo-filter">
        <select
          value={categoriaSeleccionada}
          onChange={(e) => setCategoriaSeleccionada(e.target.value)}
        >
          <option value="">Todas las categorías</option>
          {categorias.map(cat => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* SECCIONES */}
      {Object.entries(productosPorCategoria).map(([categoria, productos]) => {

        const categoriaInfo = categorias.find(c => c.value === categoria);

        return (
          <div key={categoria} className="catalogo-section">

            {!categoriaSeleccionada && (
              <h3 className="categoria-title">
                {categoriaInfo?.label}
              </h3>
            )}

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

          </div>
        );
      })}

    </section>
  );
}
