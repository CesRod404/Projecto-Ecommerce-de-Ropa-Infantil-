import { useEffect, useState, useContext } from "react";
import { AuthContext } from "./AuthContext";

export default function Carrito() {

  const { token } = useContext(AuthContext);
  const API_URL = import.meta.env.VITE_API_URL;

  const [carrito, setCarrito] = useState([]);
  const [direcciones, setDirecciones] = useState([]);
  const [direccionSeleccionada, setDireccionSeleccionada] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const [nuevaDireccion, setNuevaDireccion] = useState({
    calle: "",
    numero: "",
    ciudad: "",
    estado: "",
    codigoPostal: "",
    telefono: ""
  });

  const [loading, setLoading] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const [mostrarModal, setMostrarModal] = useState(false);
  const [pedidoConfirmado, setPedidoConfirmado] = useState(null);

  // ============================
  // CARGAR CARRITO Y DIRECCIONES
  // ============================
  useEffect(() => {

    if (!token) return;

    const cargarDatos = async () => {
      try {

        const carritoRes = await fetch(`${API_URL}/api/usuario/carrito`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const carritoData = await carritoRes.json();
        setCarrito(carritoData);

        const dirRes = await fetch(`${API_URL}/api/usuario/direcciones`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const dirData = await dirRes.json();
        setDirecciones(dirData);

        if (dirData.length > 0) {
          setDireccionSeleccionada(dirData[0]._id);
        }

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();

  }, [token]);

  // ============================
  // AGREGAR DIRECCION
  // ============================
  const agregarDireccion = async () => {

    try {
      const res = await fetch(`${API_URL}/api/usuario/direcciones`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(nuevaDireccion)
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setDirecciones(data);
      setDireccionSeleccionada(data[data.length - 1]._id);
      setMostrarFormulario(false);

      setNuevaDireccion({
        calle: "",
        numero: "",
        ciudad: "",
        estado: "",
        codigoPostal: "",
        telefono: ""
      });

    } catch (error) {
      setMensaje(error.message);
    }
  };


  ///===========================
  //Quitar dirección
  ///=========================
   const quitarDireccion = async (idDireccion) => {

    try {
      const res = await fetch(`${API_URL}/api/usuario/direcciones/${idDireccion}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setDirecciones(data);


    } catch (error) {
      setMensaje(error.message);
    }
  };


  // ============================
  // REALIZAR PEDIDO
  // ============================
  const realizarPedido = async () => {

    if (!carrito.length) return;

    if (!direccionSeleccionada) {
      setMensaje("Debes seleccionar una dirección");
      return;
    }

    setProcesando(true);
    setMensaje("");

    try {

      const productosPedido = carrito.map(item => ({
        producto: item.producto._id,
        cantidad: item.cantidad
      }));

      const response = await fetch(`${API_URL}/api/pedidos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          productos: productosPedido,
          direccionId: direccionSeleccionada
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setCarrito([]);
      setPedidoConfirmado(data);
      setMostrarModal(true);

    } catch (error) {
      setMensaje("Error: " + error.message);
    } finally {
      setProcesando(false);
    }
  };

  // ============================
// AUMENTAR CANTIDAD
// ============================
const aumentarCantidad = async (productoId, cantidadActual) => {
  try {
    const res = await fetch(
      `${API_URL}/api/usuario/carrito/${productoId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ cantidad: cantidadActual + 1 })
      }
    );

    const data = await res.json();
    setCarrito(data.carrito);

  } catch (error) {
    console.error(error);
  }
};

// ============================
// DISMINUIR CANTIDAD
// ============================
const disminuirCantidad = async (productoId, cantidadActual) => {
  try {

    if (cantidadActual <= 1) {
      // si es 1 lo eliminamos
      await fetch(
        `${API_URL}/api/usuario/carrito/${productoId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setCarrito(carrito.filter(item => item.producto._id !== productoId));
      return;
    }

    const res = await fetch(
      `${API_URL}/api/usuario/carrito/${productoId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ cantidad: cantidadActual - 1 })
      }
    );

    const data = await res.json();
    setCarrito(data.carrito);

  } catch (error) {
    console.error(error);
  }
};


  const total = carrito.reduce((acc, item) =>
    acc + item.producto.precio * item.cantidad, 0
  );

  if (loading) return <p>Cargando carrito...</p>;

  return (
    <section className="carrito-container">

      <h2>Mi Carrito</h2>

      {mensaje && <div className="mensaje">{mensaje}</div>}

      {/* DIRECCIONES */}
      <div className="direccion-box">

        <h3>Dirección de envío</h3>

        {direcciones.length > 0 ? (
          <select
            value={direccionSeleccionada}
            onChange={(e) => setDireccionSeleccionada(e.target.value)}
          >
            {direcciones.map(dir => (
              <option key={dir._id} value={dir._id}>
                {dir.calle} {dir.numero}, {dir.ciudad}
              </option>
            ))}
          </select>
        ) : (
          <p>No tienes direcciones guardadas</p>
        )}

        <button
          className="btn-agregar"
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
        >
          {mostrarFormulario ? "Cancelar" : "Agregar dirección"}
        </button>

        {direcciones.map(dir => (
          <div key={dir._id} className="direccion-item">
            <span>
              {dir.calle} {dir.numero}, {dir.ciudad}
            </span>
            <button
              onClick={() => quitarDireccion(dir._id)}
              className="card-button delete-button"
            >
              Eliminar
            </button>
          </div>
        ))}

        

        {mostrarFormulario && (
          <div className="form-direccion">
            {Object.keys(nuevaDireccion).map(campo => (
              <input
                key={campo}
                placeholder={campo}
                value={nuevaDireccion[campo]}
                onChange={(e) =>
                  setNuevaDireccion({
                    ...nuevaDireccion,
                    [campo]: e.target.value
                  })
                }
              />
            ))}

            <button className="btn-guardar" onClick={agregarDireccion}>
              Guardar Dirección
            </button>
          </div>
        )}

      </div>

      {/* PRODUCTOS */}
      {carrito.map(item => (
        <div key={item.producto._id} className="carrito-item">

          <img
            src={`${API_URL}${item.producto.imagen}`}
            alt={item.producto.nombre}
          />

          <div className="info">
            <h3>{item.producto.nombre}</h3>
            <p>Precio: ${item.producto.precio}</p>
            <div className="cantidad-control">
              <button
                className="btn-cantidad"
                onClick={() =>
                  disminuirCantidad(item.producto._id, item.cantidad)
                }
              >
                −
              </button>

              <span>{item.cantidad}</span>

              <button
                className="btn-cantidad"
                onClick={() =>
                  aumentarCantidad(item.producto._id, item.cantidad)
                }
              >
                +
              </button>
            </div>

          </div>

        </div>
      ))}

      {carrito.length > 0 && (
        <>
          <hr />
          <h3 className="total">Total: ${total}</h3>

          <button
            onClick={realizarPedido}
            disabled={procesando}
            className="btn-pagar"
          >
            {procesando ? "Procesando..." : "Pagar"}
          </button>
        </>
      )}

      {/* MODAL */}
      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal">

            <h2>Pedido confirmado 🎉</h2>

            <p><strong>N° Pedido:</strong> {pedidoConfirmado._id}</p>
            <p><strong>Estado:</strong> En proceso</p>

            <hr />

            <h3>Datos para transferencia</h3>

            <p><strong>Banco:</strong> Banco Ejemplo</p>
            <p><strong>Titular:</strong> Mi Tienda Online</p>
            <p><strong>Cuenta:</strong> 1234567890</p>
            <p><strong>CLABE:</strong> 000123456789000000</p>

            <p className="aviso">
              Una vez realizado el pago tu pedido será confirmado por el administrador.
            </p>

            <button
              className="btn-cerrar-modal"
              onClick={() => setMostrarModal(false)}
            >
              Cerrar
            </button>

          </div>
        </div>
      )}

    </section>
  );
}
