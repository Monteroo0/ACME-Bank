import { ref, get } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";
import { db } from "./firebase-config.js";

document.addEventListener("DOMContentLoaded", async () => {
  // Verifica si el usuario está autenticado
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  if (!usuario) {
    alert("Debes iniciar sesión");
    location.href = "index.html";
    return;
  }

  // Actualiza la interfaz con los datos del usuario
  document.getElementById("bienvenidaUsuario").textContent = `Bienvenido(a), ${usuario.nombres}`;
  document.getElementById("nombreUsuario").textContent = `${usuario.nombres} ${usuario.apellidos}`;
  document.getElementById("cuentaUsuario").textContent = usuario.numeroCuenta;
  document.getElementById("ciudadUsuario").textContent = usuario.ciudad || "–";
  document.getElementById("fechaCreacion").textContent = usuario.fechaCreacion || "–";

  // Muestra el saldo en diferentes monedas
  document.getElementById("saldoCOP").textContent = usuario.saldo.toLocaleString("es-CO");
  document.getElementById("saldoUSD").textContent = (usuario.saldo / 4000).toFixed(2);
  document.getElementById("saldoEUR").textContent = (usuario.saldo / 4400).toFixed(2);
  // SUGERENCIA: Usar una API de tasas de cambio en tiempo real en lugar de tasas fijas

  try {
    // Obtiene las transacciones del usuario desde Firebase
    const snapshot = await get(ref(db, `transacciones/${usuario.clave}`));
    const transacciones = snapshot.val();

    if (transacciones) {
      // Procesa y ordena las últimas 10 transacciones por fecha
      const transList = Object.values(transacciones)
        .map(tx => {
          const fechaObj = tx.timestamp
            ? new Date(tx.timestamp)
            : new Date(tx.fecha || 0);
          return { ...tx, fechaObj };
        })
        .sort((a, b) => b.fechaObj - a.fechaObj)
        .slice(0, 10);

      const lista = document.getElementById("listaTransacciones");

      // Muestra cada transacción en la interfaz
      transList.forEach((tx) => {
        const li = document.createElement("li");
        let detalle = tx.concepto || tx.descripcion || "–";
        let montoTexto = `$${tx.monto.toLocaleString("es-CO")}`;
        let color = "black";

        // Ajusta el formato y color según el tipo de transacción
        if (["consignación", "envío", "pago", "retiro"].includes(tx.tipo.toLowerCase())) {
          montoTexto = `- $${tx.monto.toLocaleString("es-CO")}`;
          color = "red";
        } else if (tx.tipo.toLowerCase() === "recibido") {
          detalle = `De ${tx.remitente || "–"}`;
          montoTexto = `+ $${tx.monto.toLocaleString("es-CO")}`;
          color = "green";
        }

        li.innerHTML = `
          <strong>${tx.tipo.toUpperCase()}</strong> – ${detalle}
          <br>
          <span style="color: gray; font-size: 0.9rem">${tx.fecha}</span>
          <br>
          <span style="font-weight: bold; color: ${color};">${montoTexto}</span>
        `;

        // Redirige a la página de movimientos al hacer clic
        li.addEventListener("click", () => {
          window.location.href = "movimientos.html";
        });
        lista.appendChild(li);
      });
    }
  } catch (error) {
    console.error("Error al cargar transacciones:", error);
  }

  // Cierra sesión al hacer clic en el botón correspondiente
  document.getElementById("btnCerrarSesion")?.addEventListener("click", () => {
    localStorage.removeItem("usuario");
    location.href = "index.html";
  });
});