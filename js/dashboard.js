import { ref, get, child } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";
import { db } from "./firebase-config.js";

document.addEventListener("DOMContentLoaded", async () => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  if (!usuario) {
    alert("Debes iniciar sesión");
    location.href = "index.html";
    return;
  }

  // Mostrar info básica
  document.getElementById("bienvenidaUsuario").textContent = `Bienvenido(a), ${usuario.nombres}`;
  document.getElementById("nombreUsuario").textContent = `${usuario.nombres} ${usuario.apellidos}`;
  document.getElementById("cuentaUsuario").textContent = usuario.numeroCuenta;
  document.getElementById("ciudadUsuario").textContent = usuario.ciudad || "–";
  document.getElementById("fechaCreacion").textContent = usuario.fechaCreacion || "–";

  // Mostrar saldo
  document.getElementById("saldoCOP").textContent = usuario.saldo.toLocaleString("es-CO");
  document.getElementById("saldoUSD").textContent = (usuario.saldo / 4000).toFixed(2); // Tasa estimada
  document.getElementById("saldoEUR").textContent = (usuario.saldo / 4400).toFixed(2); // Tasa estimada

  // Mostrar últimas transacciones
  try {
    const snapshot = await get(ref(db, `transacciones/${usuario.clave}`));
    const transacciones = snapshot.val();

    if (transacciones) {
      const transList = Object.values(transacciones)
        .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
        .slice(0, 10);

      const lista = document.getElementById("listaTransacciones");

      transList.forEach((tx) => {
        const li = document.createElement("li");
        let detalle = tx.concepto || "Sin concepto";
        let montoTexto = `$${tx.monto.toLocaleString("es-CO")}`;
        let color = "black";

        // Mostrar "Para [destinatario]" si es consignación/enviado
        if (tx.tipo.toLowerCase() === "consignación" || tx.tipo.toLowerCase() === "envío") {
          detalle = `Para ${tx.destinatario || "–"}`;
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

        li.addEventListener("click", () => {
          window.location.href = "movimientos.html";
        });
        lista.appendChild(li);
      });
    }
  } catch (error) {
    console.error("Error al cargar transacciones:", error);
  }

  // Cierre de sesión
  document.getElementById("btnCerrarSesion")?.addEventListener("click", () => {
    localStorage.removeItem("usuario");
    location.href = "index.html";
  });
});
