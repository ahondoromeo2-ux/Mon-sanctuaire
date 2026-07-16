// ==========================================================
// CONFIGURATION DU BACK-END FIREBASE — LOX OS
// ==========================================================

// Clés d'accès officielles fournies par Roméo
const firebaseConfig = {
    apiKey: "AIzaSyDcc2nCUSyQIHSDgxLbIu3J0GoBJ_ZgSMw",
    authDomain: "lox-os-619ab.firebaseapp.com",
    databaseURL: "https://lox-os-619ab-default-rtdb.firebaseio.com",
    projectId: "lox-os-619ab",
    storageBucket: "lox-os-619ab.firebasestorage.app",
    messagingSenderId: "26902819186",
    appId: "1:26902819186:web:ea04b1ba3022e20480adeb",
    measurementId: "G-48CGKK3GH1"
};

// Initialisation automatique du moteur de données
if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    var db = firebase.database();
    console.log("Connexion établie avec les serveurs de LOX OS.");
} else {
    console.warn("En attente du chargement de la base de données...");
}
