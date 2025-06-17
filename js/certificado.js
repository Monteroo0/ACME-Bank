import { db } from "./firebase-config.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

document.addEventListener("DOMContentLoaded", async () => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  if (!usuario || !usuario.numeroCuenta || !usuario.nombres) {
    alert("Debes iniciar sesión.");
    window.location.href = "index.html";
    return;
  }

  document.getElementById("bienvenidaUsuario").textContent = `Bienvenido(a), ${usuario.nombres}`;
  document.getElementById("nombreCertificado").textContent = `${usuario.nombres} ${usuario.apellidos}`;
  document.getElementById("cuentaCertificado").textContent = usuario.numeroCuenta;

  try {
    const refUsuario = ref(db, `usuarios/${usuario.clave}`);
    const snapshot = await get(refUsuario);
    if (snapshot.exists()) {
      const datos = snapshot.val();
      document.getElementById("fechaCertificado").textContent = datos.fechaCreacion || "(no registrada)";
    } else {
      document.getElementById("fechaCertificado").textContent = "(no encontrada)";
    }
  } catch (error) {
    console.error("Error obteniendo fecha de creación:", error);
    document.getElementById("fechaCertificado").textContent = "(error al obtener)";
  }

  document.getElementById("btnCerrarSesion").addEventListener("click", () => {
    localStorage.removeItem("usuario");
    window.location.href = "index.html";
  });

  document.getElementById("btnImprimirCertificado").addEventListener("click", () => {
    window.print();
  });
});
