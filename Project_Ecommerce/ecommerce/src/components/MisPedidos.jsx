import { useEffect, useState } from "react";


export default function MisPedidos() {

  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const obtenerMisPedidos = async () => {
  try {
    const response = await fetch(
      `${API_URL}/api/pedidos/mis-pedidos`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error(data);
      setPedidos([]); // 👈 Evita que rompa
      return;
    }

    setPedidos(Array.isArray(data) ? data : []);

  } catch (error) {
    console.error("Error cargando pedidos:", error);
    setPedidos([]); // 👈 Evita crash
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    obtenerMisPedidos();
  }, []);

  return (
    <div className="mis-pedidos-container">
      <h1>Mis Pedidos</h1>

      {loading ? (
        <p>Cargando pedidos...</p>
      ) : pedidos.length === 0 ? (
        <p>No tienes pedidos aún.</p>
      ) : (
        <div className="pedidos-grid">
          {pedidos.map((pedido) => (
            <div className="pedido-card" key={pedido._id}>
              
              <div className="pedido-header">
                <span>
                  Pedido #{pedido._id.slice(-6)}
                </span>

                <span className={`estado ${pedido.estado}`}>
                  {pedido.estado}
                </span>
              </div>

              <div className="pedido-fecha">
                {new Date(pedido.fecha).toLocaleDateString()}
              </div>

              <div className="productos-lista">
                {pedido.productos.map((item, index) => (
                  <div className="producto-item" key={index}>
                    <img
                      src={`${API_URL}${item.producto?.imagen}`}
                      alt={item.producto?.nombre}
                    />
                    <div>
                      <p className="producto-nombre">
                        {item.producto?.nombre}
                      </p>
                      <p>Cantidad: {item.cantidad}</p>
                      <p>
                        ${item.producto?.precio} c/u
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pedido-total">
                Total: <strong>${pedido.total}</strong>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
