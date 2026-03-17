
const API_URL = "https://fakestoreapi.com/products";

// GET: obtener todos los productos
export async function getProducts() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Error en la solicitud");
    return await res.json();
  } catch (err) {
    throw err;
  }
}

// POST: ejemplo para crear un producto (Fake Store lo permite)
export async function createProduct(product) {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product)
    });
    if (!res.ok) throw new Error("Error en la solicitud");
    return await res.json();
  } catch (err) {
    throw err;
  }
}