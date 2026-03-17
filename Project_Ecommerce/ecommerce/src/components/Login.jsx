import { useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext"; 

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); 
  const API_URL = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (data.token) {
        login(data); 
        setMessage("Login exitoso");
        navigate("/");
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      setMessage("Error en el login");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Contraseña"
          onChange={handleChange}
        />
        <button type="submit">Iniciar sesión</button>
        <p>{message}</p>

        <p className="login-register-link">
          ¿No tienes cuenta?{" "}
          <NavLink to="/register" className="link">
            Regístrate aquí
          </NavLink>
        </p>
      </form>
    </div>
  );
}