import { db } from "./firebase-config.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

window.addEventListener("DOMContentLoaded", async () => {
  const btnCerrarSesion = document.getElementById("btnCerrarSesion");
  if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener("click", () => {
      localStorage.removeItem("usuario");
      window.location.href = "index.html";
    });
  }

  const datosLocales = JSON.parse(localStorage.getItem("usuario"));

  if (!datosLocales || !datosLocales.tipoId || !datosLocales.identificacion) {
    alert("No hay sesión iniciada. Redirigiendo al inicio.");
    window.location.href = "index.html";
    return;
  }

  const idFirebase = `${datosLocales.tipoId}_${datosLocales.identificacion}`;

  try {
    const snapshot = await get(ref(db, `usuarios/${idFirebase}`));

    if (!snapshot.exists()) {
      console.warn("Usuario no encontrado en Firebase.");
      return;
    }

    const usuario = snapshot.val();

    document.getElementById("saldoCOP").textContent = usuario.saldo.toLocaleString("es-CO");
    document.getElementById("saldoUSD").textContent = (usuario.saldo / 4200).toFixed(2);
    document.getElementById("saldoEUR").textContent = (usuario.saldo / 4700).toFixed(2);

    document.getElementById("nombreUsuario").textContent = usuario.nombres;
    document.getElementById("ciudadUsuario").textContent = usuario.ciudad || "No registrada";
    document.getElementById("cuentaUsuario").textContent = usuario.numeroCuenta;
    document.getElementById("fechaCreacion").textContent = usuario.fechaCreacion;
    document.getElementById("bienvenidaUsuario").textContent = `Bienvenido(a), ${usuario.nombres}`;

  } catch (error) {
    console.error("Error al obtener datos del usuario:", error);
    alert("Error al conectar con la base de datos.");
  }
});
