import { ref, onValue } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";
import { db } from "./firebase-config.js";

document.addEventListener("DOMContentLoaded", () => {
  const cuentaDestinoInput = document.getElementById("cuentaDestino");
  const sugerenciasDiv = document.getElementById("sugerencias");
  const nombreDestinoInput = document.getElementById("nombreDestino");

  cuentaDestinoInput.addEventListener("input", () => {
    const valor = cuentaDestinoInput.value.trim().toUpperCase();

    if (valor.length < 3) {
      sugerenciasDiv.innerHTML = "";
      sugerenciasDiv.style.display = "none";
      return;
    }

    const usuariosRef = ref(db, "usuarios");
    onValue(usuariosRef, (snapshot) => {
      const data = snapshot.val();
      sugerenciasDiv.innerHTML = "";

      const sugerencias = Object.values(data).filter(user =>
        user.numeroCuenta && user.numeroCuenta.includes(valor)
      );

      if (sugerencias.length === 0) {
        sugerenciasDiv.style.display = "none";
        return;
      }

      sugerencias.forEach(user => {
        const div = document.createElement("div");
        div.classList.add("sugerencia-item");

        div.innerHTML = `
          <strong>${user.nombres} ${user.apellidos}ㅤ</strong><br><br>
          <span style="color: gray;">${user.numeroCuenta}</span>
        `;

        div.addEventListener("click", () => {
          cuentaDestinoInput.value = user.numeroCuenta;
          nombreDestinoInput.value = `${user.nombres} ${user.apellidos}`;
          sugerenciasDiv.style.display = "none";
        });

        sugerenciasDiv.appendChild(div);
      });

      sugerenciasDiv.style.display = "block";
    }, {
      onlyOnce: true
    });
  });
});
