import { ref, onValue, push } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";
import { db } from "./firebase-config.js";

document.addEventListener("DOMContentLoaded", () => {
  const cuentaOrigenInput = document.getElementById("cuentaOrigen");
  const sugerenciasDiv = document.getElementById("sugerenciasRetiro");
  const nombreOrigenInput = document.getElementById("nombreOrigen");
  const montoInput = document.getElementById("montoRetiro");
  const btnRetirar = document.getElementById("btnRetirar");

  
  cuentaOrigenInput.addEventListener("input", () => {
    const valor = cuentaOrigenInput.value.trim().toUpperCase();

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
          <strong>${user.nombres} ${user.apellidos}</strong><br>
          <span style="color: gray;">${user.numeroCuenta}</span>
        `;

        div.addEventListener("click", () => {
          cuentaOrigenInput.value = user.numeroCuenta;
          nombreOrigenInput.value = `${user.nombres} ${user.apellidos}`;
          sugerenciasDiv.style.display = "none";
        });

        sugerenciasDiv.appendChild(div);
      });

      sugerenciasDiv.style.display = "block";
    }, {
      onlyOnce: true
    });
  });

  
  btnRetirar.addEventListener("click", () => {
    const cuenta = cuentaOrigenInput.value.trim();
    const nombre = nombreOrigenInput.value.trim();
    const monto = parseFloat(montoInput.value.trim());

    if (!cuenta || !nombre || isNaN(monto) || monto <= 0) {
      alert("Completa todos los campos correctamente.");
      return;
    }

    const transRef = ref(db, "transacciones");
    push(transRef, {
      tipo: "retiro",
      cuentaOrigen: cuenta,
      nombreOrigen: nombre,
      monto: monto,
      fecha: new Date().toISOString()
    }).then(() => {
      alert("Retiro registrado con éxito");
      cuentaOrigenInput.value = "";
      nombreOrigenInput.value = "";
      montoInput.value = "";
    }).catch((error) => {
      console.error(error);
      alert("Error al registrar el retiro");
    });
  });
});
