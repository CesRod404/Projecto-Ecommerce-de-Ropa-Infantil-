import { useContext, useState } from "react";
import { AuthContext } from "./AuthContext";
import { useNavigate, NavLink } from "react-router-dom";

export default function ProductoCard({
  producto,
  likes,
  setLikes
}) {

  const { token, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const [mensajeCarrito, setMensajeCarrito] = useState("");

  const liked = likes.includes(producto._id);

  
  const toggleLike = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const res = await fetch(
      `${API_URL}/api/usuario/likes/${producto._id}`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    const data = await res.json();
    setLikes(data.likes); 
  };

  
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

  return (
    <div className="catalogo-card">
      <NavLink to={`/producto/${producto._id}`}>

    
        <img
          src={`${API_URL}${producto.imagen}`}
          alt={producto.nombre}
        />
      <h3>{producto.nombre}</h3>
      <p>${producto.precio}</p>
  

        
      </NavLink>
      <div
        className="favorite-heart"
        onClick={toggleLike}
        style={{ cursor: "pointer", fontSize: "22px" }}
      >
        {liked ? "❤️" : "🤍"}
      </div>

      <button className="add-to-cart-btn" onClick={agregarCarrito}>
        Agregar al carrito
      </button>

      {mensajeCarrito && (
        <div className="mensaje-carrito">
          {mensajeCarrito}
        </div>
      )}

    </div>
  );
}
