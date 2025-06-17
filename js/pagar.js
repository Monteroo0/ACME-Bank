import { ref, get, set, update, push } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";
import { db } from "./firebase-config.js";

document.addEventListener("DOMContentLoaded", async () => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  if (!usuario) {
    alert("Debes iniciar sesión");
    location.href = "index.html";
    return;
  }

  document.getElementById("bienvenidaUsuario").textContent = `Bienvenido(a), ${usuario.nombres}`;
  document.getElementById("nombreUsuario").textContent = `${usuario.nombres} ${usuario.apellidos}`;
  document.getElementById("numeroCuenta").textContent = usuario.numeroCuenta;

  // Cierre de sesión
  document.getElementById("btnCerrarSesion").addEventListener("click", () => {
    localStorage.removeItem("usuario");
    location.href = "index.html";
  });

  const form = document.getElementById("formPagoServicios");
  const resumenDiv = document.getElementById("resumenPago");
  const btnImprimir = document.getElementById("btnImprimir");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const servicio = document.getElementById("servicio").value;
    const referencia = document.getElementById("referencia").value.trim();
    const valor = parseInt(document.getElementById("valor").value);

    if (!servicio || !referencia || valor <= 0) {
      alert("Todos los campos son obligatorios y deben ser válidos.");
      return;
    }

    try {
      // Obtiene datos actualizados del usuario desde Firebase
      const userRef = ref(db, `usuarios/${usuario.clave}`);
      const snapshot = await get(userRef);

      if (!snapshot.exists()) {
        alert("Usuario no encontrado en la base de datos.");
        return;
      }

      const datosActualizados = snapshot.val();
      const saldoActual = parseInt(datosActualizados.saldo || 0);

      if (valor > saldoActual) {
        alert("Saldo insuficiente para realizar el pago.");
        return;
      }

      // Calcula nuevo saldo
      const nuevoSaldo = saldoActual - valor;

      // Actualiza saldo en Firebase
      await update(userRef, { saldo: nuevoSaldo });

      // Guarda la transacción
      const transaccion = {
        tipo: "Pago",
        concepto: `Pago de ${servicio}`,
        referencia,
        monto: valor,
        fecha: new Date().toLocaleString("es-CO"),
        timestamp: Date.now()
      };

      const transRef = ref(db, `transacciones/${usuario.clave}`);
      await push(transRef, transaccion);

      // Actualiza localStorage
      usuario.saldo = nuevoSaldo;
      localStorage.setItem("usuario", JSON.stringify(usuario));

      // Muestra resumen del pago
      resumenDiv.innerHTML = `
        <h4>Resumen del pago</h4>
        <p><strong>Servicio:</strong> ${servicio}</p>
        <p><strong>Referencia:</strong> ${referencia}</p>
        <p><strong>Valor pagado:</strong> $${valor.toLocaleString("es-CO")}</p>
        <p><strong>Fecha:</strong> ${transaccion.fecha}</p>
        <p><strong>Saldo restante:</strong> $${nuevoSaldo.toLocaleString("es-CO")}</p>
      `;
      resumenDiv.style.display = "block";
      btnImprimir.style.display = "inline-block";

      alert("Pago realizado con éxito.");

    } catch (error) {
      console.error("Error al realizar el pago:", error);
      alert("Ocurrió un error al realizar el pago.");
    }
  });

  // Botón imprimir resumen
  btnImprimir.addEventListener("click", () => {
    window.print();
  });
});
