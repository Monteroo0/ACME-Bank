import { db } from './firebase-config.js';
import { ref, get, child } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

// Función para obtener los datos de un usuario desde Firebase
export async function obtenerUsuario(tipo, numero) {
  try {
    // Consulta el usuario en la base de datos usando la clave tipo_numero
    const snapshot = await get(child(ref(db), `usuarios/${tipo}_${numero}`));
    if (snapshot.exists()) {
      const data = snapshot.val();
      // Verifica que el tipo de identificación coincida
      if (data.tipoId === tipo) {
        return data;
      }
    }
    return null;
  } catch (error) {
    // Maneja errores al consultar la base de datos
    console.error("Error al obtener usuario:", error);
    return null;
  }
}