// ==========================================================
// CONFIGURATION DU BACK-END FIREBASE
// ==========================================================

// Configuration de ton projet Firebase (à remplacer par tes propres clés)
const firebaseConfig = {
    apiKey: "TON_API_KEY",
    authDomain: "TON_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://TON_PROJECT_ID-default-rtdb.firebaseio.com",
    projectId: "TON_PROJECT_ID",
    storageBucket: "TON_PROJECT_ID.appspot.com",
    messagingSenderId: "TON_SENDER_ID",
    appId: "TON_APP_ID"
};

// Initialisation de Firebase dans ton cockpit
if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    // On expose la base de données en temps réel pour app.js
    var db = firebase.database();
    console.log("Connecté au serveur Firebase avec succès.");
} else {
    console.warn("Firebase n'est pas encore chargé dans l'index HTML.");
}
