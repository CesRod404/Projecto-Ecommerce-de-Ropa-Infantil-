import { useEffect, useState } from "react";


const API_URL = import.meta.env.VITE_API_URL;


const estados = [
  "todos",
  "por_confirmar",
  "confirmado",
  "en_camino",
  "cancelado"
];

export default function AdminPedidos() {

  const [pedidos, setPedidos] = useState([]);
  const [estadoFiltro, setEstadoFiltro] = useState("todos");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const obtenerPedidos = async (estado = "todos") => {
    try {
      setLoading(true);

      let url = `${API_URL}/api/pedidos`;

      if (estado !== "todos") {
        url += `?estado=${estado}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      setPedidos(data);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const cambiarEstado = async (idPedido, nuevoEstado) => {
    try {
      const response = await fetch(
        `${API_URL}/api/pedidos/${idPedido}/estado`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ estado: nuevoEstado })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      obtenerPedidos(estadoFiltro);

    } catch (error) {
      console.error(error);
    }
  };

  const eliminarPedido = async (idPedido) => {

    const confirmar = window.confirm("¿Seguro que deseas eliminar este pedido?");
    if (!confirmar) return;

    try {

      const response = await fetch(
        `${API_URL}/api/pedidos/${idPedido}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      obtenerPedidos(estadoFiltro);

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    obtenerPedidos(estadoFiltro);
  }, [estadoFiltro]);

  return (
    <div className="admin-container">
      <h1>Panel de Pedidos</h1>

      <select
        className="filtro-select"
        value={estadoFiltro}
        onChange={(eventoCambio) => setEstadoFiltro(eventoCambio.target.value)}
      >
        {estados.map((estado) => (
          <option key={estado} value={estado}>
            {estado}
          </option>
        ))}
      </select>

      {loading ? (
        <p>Cargando pedidos...</p>
      ) : (
        <div className="tabla-wrapper">
          <table>
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Productos</th>
                <th>Dirección</th> 
                <th>Fecha</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {pedidos.map((pedido) => (
                <tr key={pedido._id}>
                  <td>{pedido.usuario?.email}</td>

                  <td>
                    {pedido.productos.map((item, indexProducto) => (
                      <div key={indexProducto} className="producto-item">
                        {item.producto?.nombre} x{item.cantidad}
                      </div>
                    ))}
                  </td>

                  {/* MOSTRAR DIRECCIÓN */}
                  <td className="direccion-cell">
                    {pedido.direccionEnvio ? (
                      <div>
                        <div>{pedido.direccionEnvio.calle}</div>
                        <div>{pedido.direccionEnvio.ciudad}</div>
                        <div>{pedido.direccionEnvio.codigoPostal}</div>
                        <div>{pedido.direccionEnvio.pais}</div>
                      </div>
                    ) : (
                      "Sin dirección"
                    )}
                  </td>

                  <td>{new Date(pedido.fecha).toLocaleDateString()}</td>

                  <td className="total">${pedido.total}</td>

                  <td>
                    <select
                      className={`estado-select ${pedido.estado}`}
                      value={pedido.estado}
                      onChange={(eventoCambio) =>
                        cambiarEstado(pedido._id, eventoCambio.target.value)
                      }
                    >
                      {estados
                        .filter((estadoItem) => estadoItem !== "todos")
                        .map((estadoItem) => (
                          <option key={estadoItem} value={estadoItem}>
                            {estadoItem}
                          </option>
                        ))}
                    </select>
                  </td>

                  <td>
                    <button
                      className="btn-eliminar"
                      onClick={() => eliminarPedido(pedido._id)}
                    >
                      Eliminar
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
