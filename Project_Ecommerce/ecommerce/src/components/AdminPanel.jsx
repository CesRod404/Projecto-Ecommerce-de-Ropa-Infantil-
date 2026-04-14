// AdminPanel.jsx
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";

export default function AdminPanel() {
  const { token } = useContext(AuthContext);

  const API_URL = import.meta.env.VITE_API_URL || "";

  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    categoria: "",
    imagen: "",
    temporada: "",
    rangoEdad: "",
    stock: "",
    tallas: [] // array de tallas seleccionadas
  });

  const obtenerProductos = async () => {
    try {
      const response = await fetch(`${API_URL}/api/productos`);
      const data = await response.json();
      setProductos(data);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

  useEffect(() => {
    obtenerProductos();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const toggleTalla = (t) => {
    setFormData(prev => {
      const exists = prev.tallas.includes(t);
      return {
        ...prev,
        tallas: exists ? prev.tallas.filter(x => x !== t) : [...prev.tallas, t]
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const formDataToSend = new FormData();

      if (formData.nombre) formDataToSend.set("nombre", formData.nombre);
      if (formData.descripcion) formDataToSend.set("descripcion", formData.descripcion);
      if (formData.precio !== "") formDataToSend.set("precio", String(formData.precio));
      if (formData.categoria) formDataToSend.set("categoria", formData.categoria);
      if (formData.temporada) formDataToSend.set("temporada", formData.temporada);
      if (formData.rangoEdad) formDataToSend.set("rangoEdad", formData.rangoEdad);

      if (formData.stock !== "" && formData.stock !== null && formData.stock !== undefined) {
        formDataToSend.set("stock", String(formData.stock));
      }

      // Enviar tallas como múltiples entradas con la misma key "tallas"
      if (Array.isArray(formData.tallas) && formData.tallas.length > 0) {
        formData.tallas.forEach(t => formDataToSend.append("tallas", t));
      }

      if (formData.imagen && formData.imagen instanceof File) {
        formDataToSend.set("imagen", formData.imagen);
      }

      const url = editandoId
        ? `${API_URL}/api/productos/${editandoId}`
        : `${API_URL}/api/productos`;

      const method = editandoId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formDataToSend
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("Respuesta no OK:", response.status, text);
        alert("Error al guardar producto. Revisa la consola del servidor y la respuesta.");
        return;
      }

      alert(editandoId ? "Producto actualizado" : "Producto creado");

      setFormData({
        nombre: "",
        descripcion: "",
        precio: "",
        categoria: "",
        imagen: "",
        temporada: "",
        rangoEdad: "",
        stock: "",
        tallas: []
      });

      // Limpiar preview de imagen
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      setImagePreview(null);

      setEditandoId(null);
      obtenerProductos();

    } finally {
      setLoading(false);
    }
  };

  const eliminarProducto = async (idProducto) => {
    if (!window.confirm("¿Seguro que quieres eliminar este producto?")) return;

    await fetch(`${API_URL}/api/productos/${idProducto}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });

    obtenerProductos();
  };

  const esRopa = formData.categoria.includes("ropa");

  return (
    <div className="admin-container">
      <h2 className="admin-title">Panel Administrador</h2>

      {editandoId && (
        <p className="editing-indicator">
          Estás editando un producto
        </p>
      )}

      <form onSubmit={handleSubmit} className="admin-form">

        <input name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} required />
        <textarea name="descripcion" placeholder="Descripción" value={formData.descripcion} onChange={handleChange} />
        <input name="precio" type="number" placeholder="Precio" value={formData.precio} onChange={handleChange} required />

        <select
          name="categoria"
          value={formData.categoria}
          onChange={(e) => {
            const nuevaCategoria = e.target.value;
            setFormData({
              ...formData,
              categoria: nuevaCategoria,
              temporada: nuevaCategoria.includes("ropa") ? formData.temporada : "",
              rangoEdad: nuevaCategoria.includes("ropa") ? formData.rangoEdad : ""
            });
          }}
          required
        >
          <option value="">Selecciona categoría</option>
          <option value="bautizo-niño">Bautizo Niño</option>
          <option value="bautizo-niña">Bautizo Niña</option>
          <option value="ropa-niña">Ropa Niña</option>
          <option value="ropa-niño">Ropa Niño</option>
          <option value="accesorio">Accesorio</option>
        </select>

        {esRopa && (
          <>
            <select
              name="temporada"
              value={formData.temporada}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona temporada</option>
              <option value="verano">Verano</option>
              <option value="invierno">Invierno</option>
            </select>

            <input
              type="text"
              name="rangoEdad"
              placeholder="Rango de edad (Ej: 2-4 años)"
              value={formData.rangoEdad}
              onChange={handleChange}
              required
            />
          </>
        )}

        <input
          type="number"
          name="stock"
          placeholder="Stock total"
          value={formData.stock}
          onChange={handleChange}
          min="0"
        />

        <div className="tallas-group">
          <label>
            <input
              type="checkbox"
              checked={formData.tallas.includes("chico")}
              onChange={() => toggleTalla("chico")}
            /> Chico
          </label>
          <label>
            <input
              type="checkbox"
              checked={formData.tallas.includes("mediano")}
              onChange={() => toggleTalla("mediano")}
            /> Mediano
          </label>
          <label>
            <input
              type="checkbox"
              checked={formData.tallas.includes("grande")}
              onChange={() => toggleTalla("grande")}
            /> Grande
          </label>
        </div>

        <input
          type="file"
          name="imagen"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            setFormData({ ...formData, imagen: file });
            if (file) {
              if (imagePreview) URL.revokeObjectURL(imagePreview);
              setImagePreview(URL.createObjectURL(file));
            } else {
              setImagePreview(null);
            }
          }}
          required={!editandoId}
        />

        {imagePreview && (
          <div className="image-preview-container">
            <p className="image-preview-label">Vista previa:</p>
            <img src={imagePreview} alt="Vista previa" className="image-preview" />
          </div>
        )}

        <button type="submit" disabled={loading} className="admin-button">
          {loading
            ? editandoId
              ? "Actualizando..."
              : "Creando..."
            : editandoId
            ? "Actualizar Producto"
            : "Crear Producto"}
        </button>
      </form>

      <div className="product-grid">
        {productos.map((producto) => (
          <div key={producto._id} className="product-card">

            {producto.imagen && (
              <img
                src={producto.imagen}
                alt={producto.nombre}
                className="product-image"
              />
            )}

            <div className="product-content">
              <div className="product-name">{producto.nombre}</div>
              <div className="product-price">${producto.precio}</div>
              <div className="product-category">{producto.categoria}</div>
              <div className="product-tallas">
                {Array.isArray(producto.tallas) && producto.tallas.length > 0
                  ? `Tallas: ${producto.tallas.join(", ")}`
                  : null}
              </div>
              <div className="product-stock">
                {producto.stock !== undefined ? `Stock: ${producto.stock}` : null}
              </div>

              <button
                onClick={() => {
                  setEditandoId(producto._id);
                  setFormData({
                    nombre: producto.nombre || "",
                    descripcion: producto.descripcion || "",
                    precio: producto.precio ?? "",
                    categoria: producto.categoria || "",
                    temporada: producto.temporada || "",
                    rangoEdad: producto.rangoEdad || "",
                    imagen: "",
                    tallas: Array.isArray(producto.tallas) ? producto.tallas : [],
                    stock: producto.stock ?? ""
                  });
                }}
                className="card-button edit-button"
              >
                Editar
              </button>

              <button
                onClick={() => eliminarProducto(producto._id)}
                className="card-button delete-button"
              >
                Eliminar
              </button>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}