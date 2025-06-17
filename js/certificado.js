import { db } from "./firebase-config.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

document.addEventListener("DOMContentLoaded", async () => {
  // Obtiene datos del usuario desde localStorage para verificar autenticación
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  
  // Verifica si el usuario está autenticado y tiene los datos necesarios
  if (!usuario || !usuario.numeroCuenta || !usuario.nombres) {
    alert("Debes iniciar sesión.");
    window.location.href = "index.html";
    return;
  }

  // Actualiza la interfaz con los datos del usuario (nombres y número de cuenta)
  // Corrección: Usa comillas invertidas para interpolación de cadenas
  document.getElementById("bienvenidaUsuario").textContent = `Bienvenido(a), ${usuario.nombres}`;
  document.getElementById("nombreCertificado").textContent = `${usuario.nombres} ${usuario.apellidos}`;
  document.getElementById("cuentaCertificado").textContent = usuario.numeroCuenta;

  try {
    // Consulta la fecha de creación del usuario en Firebase
    const refUsuario = ref(db, `usuarios/${usuario.clave}`);
    const snapshot = await get(refUsuario);
    if (snapshot.exists()) {
      const datos = snapshot.val();
      // Muestra la fecha de creación o un mensaje por defecto si no existe
      document.getElementById("fechaCertificado").textContent = datos.fechaCreacion || "(no registrada)";
    } else {
      document.getElementById("fechaCertificado").textContent = "(no encontrada)";
    }
  } catch (error) {
    // Maneja errores al consultar la base de datos y muestra un mensaje en la interfaz
    console.error("Error obteniendo fecha de creación:", error);
    document.getElementById("fechaCertificado").textContent = "(error al obtener)";
  }

  // Agrega evento para cerrar sesión, eliminando datos de localStorage
  document.getElementById("btnCerrarSesion").addEventListener("click", () => {
    localStorage.removeItem("usuario");
    window.location.href = "index.html";
    // SUGERENCIA: Extraer esta lógica a una función reutilizable para evitar duplicación
  });

  // Agrega evento para imprimir el certificado usando la función nativa de impresión
  document.getElementById("btnImprimirCertificado").addEventListener("click", () => {
    window.print();
  });
  // SUGERENCIA: Agregar un indicador de carga mientras se consulta la base de datos
});