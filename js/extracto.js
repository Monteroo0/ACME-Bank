import { ref, get } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";
import { db } from "./firebase-config.js";

document.addEventListener("DOMContentLoaded", () => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const cuentaInput = document.getElementById("cuentaUsuario");
  const nombreInput = document.getElementById("nombreUsuario");
  const btnCerrarSesion = document.getElementById("btnCerrarSesion");
  const bienvenida = document.getElementById("bienvenidaUsuario");
  const btnGenerar = document.getElementById("btnGenerar");

  if (!usuario) {
    alert("No has iniciado sesión.");
    window.location.href = "index.html";
    return;
  }

  cuentaInput.value = usuario.numeroCuenta;
  nombreInput.value = `${usuario.nombres} ${usuario.apellidos}`;
  bienvenida.textContent = `Bienvenido(a), ${usuario.nombres}`;

  btnCerrarSesion.addEventListener("click", () => {
    localStorage.removeItem("usuario");
    window.location.href = "index.html";
  });

  btnGenerar.addEventListener("click", async () => {
    const anio = document.getElementById("anio").value;
    const mes = document.getElementById("mes").value;

    if (!anio || !mes) {
      alert("Por favor ingresa el año y mes para el extracto.");
      return;
    }

    try {
      const snapshot = await get(ref(db, `transacciones/${usuario.clave}`));
      const transacciones = snapshot.val();
      const movimientosFiltrados = [];

      for (const key in transacciones) {
        const tx = transacciones[key];
        const [dia, mesTx, anioTx] = tx.fecha.split(",")[0].split("/");

        if (mesTx === mes && anioTx === anio) {
          movimientosFiltrados.push(tx);
        }
      }

      if (movimientosFiltrados.length === 0) {
        alert("No se encontraron movimientos para ese período.");
        return;
      }

      // Crear contenido para el extracto
      let contenido = `Extracto Bancario - ${nombreInput.value} (${cuentaInput.value})\n\n`;
      contenido += `Fecha\t\tReferencia\tTipo\t\tConcepto\t\tValor\n`;
      contenido += `-----------------------------------------------------------------\n`;

      movimientosFiltrados.forEach(tx => {
        contenido += `${tx.fecha}\t${tx.referencia}\t${tx.tipo}\t${tx.concepto}\t$${tx.monto.toLocaleString("es-CO")}\n`;
      });

      // Generar archivo
      const blob = new Blob([contenido], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Extracto_${mes}_${anio}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generando extracto:", error);
      alert("Error al generar el extracto.");
    }
  });
});
