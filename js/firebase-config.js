import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyC7YlEw4KFTQGuBX8Ia5i2vpIzmrkkZA8s",
  authDomain: "bancoacmebank.firebaseapp.com",
  databaseURL: "https://bancoacmebank-default-rtdb.firebaseio.com",
  projectId: "bancoacmebank",
  storageBucket: "bancoacmebank.appspot.com",
  messagingSenderId: "220309357870",
  appId: "1:220309357870:web:9cc3e1d75c46b44afee6bf"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };
