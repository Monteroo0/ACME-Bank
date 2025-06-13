import { db } from './firebase-config.js';
import { ref, get, child } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

export async function obtenerUsuario(tipo, numero) {
  try {
    const snapshot = await get(child(ref(db), `usuarios/${tipo}_${numero}`));
    if (snapshot.exists()) {
      const data = snapshot.val();
      if (data.tipoId === tipo) {
        return data;
      }
    }
    return null;
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    return null;
  }
}
