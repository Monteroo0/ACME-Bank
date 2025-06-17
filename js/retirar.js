import { ref, onValue, update, push, get } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";
import { db } from "./firebase-config.js";

document.addEventListener("DOMContentLoaded", () => {
  // Obtiene referencias a elementos del DOM
  const cuentaInput = document.getElementById("cuentaDestino");
  const nombreInput = document.getElementById("nombreDestino");
  const montoInput = document.getElementById("valor");
  const btnRetirar = document.querySelector("button[type='submit']");
  const btnCerrarSesion = document.getElementById("btnCerrarSesion");

  // Verifica si el usuario está autenticado
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  if (!usuario) {
    alert("No has iniciado sesión. Redirigiendo al login.");
    window.location.href = "index.html";
    return;
  }

  // Rellena los campos con los datos del usuario y los hace de solo lectura
  if (usuario.nombres && usuario.apellidos && usuario.numeroCuenta) {
    const bienvenida = document.getElementById("bienvenidaUsuario");
    if (bienvenida) {
      bienvenida.textContent = `Bienvenido(a), ${usuario.nombres}`;
    }

    cuentaInput.value = usuario.numeroCuenta;
    nombreInput.value = `${usuario.nombres} ${usuario.apellidos}`;
    cuentaInput.readOnly = true;
    nombreInput.readOnly = true;
  }

  // Cierra sesión al hacer clic en el botón correspondiente
  btnCerrarSesion?.addEventListener("click", () => {
    localStorage.removeItem("usuario");
    window.location.href = "index.html";
  });

  // Procesa el retiro al hacer clic en el botón
  btnRetirar.addEventListener("click", async (e) => {
    e.preventDefault();

    const monto = parseFloat(montoInput.value.trim());
    // Valida que el monto sea válido
    if (isNaN(monto) || monto <= 0) {
      alert("Ingresa un monto válido.");
      return;
    }

    try {
      // Obtiene el saldo actual del usuario desde Firebase
      const snapshot = await get(ref(db, `usuarios/${usuario.clave}`));
      const datos = snapshot.val();

      if (!datos || typeof datos.saldo !== "number") {
        alert("Error al obtener el saldo actual.");
        return;
      }

      // Verifica si el saldo es suficiente
      if (datos.saldo < monto) {
        alert("Saldo insuficiente.");
        return;
      }

      // Actualiza el saldo en la base de datos
      const nuevoSaldo = datos.saldo - monto;
      await update(ref(db, `usuarios/${usuario.clave}`), { saldo: nuevoSaldo });

      // Actualiza el saldo en localStorage
      usuario.saldo = nuevoSaldo;
      localStorage.setItem("usuario", JSON.stringify(usuario));

      // Genera una referencia única y registra la transacción
      const referencia = crypto.randomUUID();
      const fechaFormateada = new Date().toLocaleString("es-CO", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
      });

      await push(ref(db, `transacciones/${usuario.clave}`), {
        referencia,
        tipo: "retiro",
        concepto: "Retiro por canal electrónico",
        monto,
        fecha: fechaFormateada,
        timestamp: Date.now()
      });

      // Muestra un resumen del retiro en la interfaz
      const resumen = document.createElement("div");
      resumen.classList.add("resumen-transaccion");
      resumen.innerHTML = `
        <button class="cerrar-resumen">✖</button>
        <h3>Recibo de Retiro</h3>
        <p><strong>Fecha:</strong> ${fechaFormateada}</p>
        <p><strong>Referencia:</strong> ${referencia}</p>
        <p><strong>Tipo:</strong> Retiro</p>
        <p><strong>Concepto:</strong> Retiro por canal electrónico</p>
        <p><strong>Valor:</strong> $${monto.toLocaleString("es-CO")}</p>
        <button onclick="window.print()">Imprimir</button>
      `;
      document.body.appendChild(resumen);
      resumen.querySelector(".cerrar-resumen").addEventListener("click", () => resumen.remove());

      // Notifica al usuario y limpia el campo de monto
      alert(`Retiro de $${monto.toLocaleString("es-CO")} realizado exitosamente ✅`);
      montoInput.value = "";
    } catch (error) {
      console.error("Error al procesar el retiro:", error.message);
      alert("Ocurrió un error al procesar el retiro.");
    }
  });
});