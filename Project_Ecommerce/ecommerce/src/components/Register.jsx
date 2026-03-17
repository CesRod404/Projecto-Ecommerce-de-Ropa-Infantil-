import { useState } from "react";
import { NavLink } from "react-router-dom";


export default function Register() {
  const [form, setForm] = useState({ nombre: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setMessage(data.message);
    } catch (err) {
      setMessage("Error en el registro");
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Registro</h2>
        <input name="nombre" placeholder="Nombre" onChange={handleChange} />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} />
        <input name="password" type="password" placeholder="Contraseña" onChange={handleChange} />
        <button type="submit">Registrarse</button>
        <p>{message}</p>

        
        <p className="register-login-link">
          ¿Ya tienes cuenta?{" "}
          <NavLink to="/login" className="link">
            Inicia sesión aquí
          </NavLink>
        </p>
      </form>
    </div>
  );
}