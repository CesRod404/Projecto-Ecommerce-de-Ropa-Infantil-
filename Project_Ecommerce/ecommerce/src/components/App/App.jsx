import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../AuthContext";

import MainLayout from "../MainLayout";
import Home from "../Home/Home";

import CatalogoBautizo from "../Bautizo/CatalogoBautizo";
import CatalogoNinas from "../Ninas/CatalogoNinas";
import CatalogoNinos from "../Ninos/CatalogoNinos";
import CatalogoAccesorios from "../Accesorios/CatalogoAccesorios";

import CatalogoApi from "../CatalogoApi";
import DetalleProducto from "../DetalleProducto";

import Favoritos from "../Favoritos";
import Contacto from "../Contacto";
import Carrito from "../Carrito";

import Login from "../Login";
import Register from "../Register";

import AdminPanel from "../AdminPanel";
import AdminPedidos from "../AdminPedidos";
import ProtectedAdminRoute from "../ProtectedAdminRoute";
import MisPedidos from "../MisPedidos";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* ========================= */}
          {/* RUTAS CON NAVBAR */}
          {/* ========================= */}
          <Route path="/" element={<MainLayout />}>

            <Route index element={<Home />} />

            {/* Categorías */}
            <Route path="bautizo" element={<CatalogoBautizo />} />
            <Route path="ninas" element={<CatalogoNinas />} />
            <Route path="ninos" element={<CatalogoNinos />} />
            <Route path="accesorios" element={<CatalogoAccesorios />} />
            

            {/* Producto individual */}
            <Route path="producto/:id" element={<DetalleProducto />} />

            {/* Otros */}
            <Route path="catalogo" element={<CatalogoApi />} />
            <Route path="favoritos" element={<Favoritos />} />
            <Route path="carrito" element={<Carrito />} />
            <Route path="contacto" element={<Contacto />} />
            <Route path="pedidos" element={<MisPedidos/>}/>

            {/* ========================= */}
            {/* RUTA ADMIN PROTEGIDA */}
            {/* ========================= */}
            <Route
              path="admin"
              element={
                <ProtectedAdminRoute>
                  <AdminPanel />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="adminPedidos"
              element={
                <ProtectedAdminRoute>
                  <AdminPedidos/>
                </ProtectedAdminRoute>
              }
            />

          </Route>

          {/* ========================= */}
          {/* RUTAS SIN NAVBAR */}
          {/* ========================= */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
