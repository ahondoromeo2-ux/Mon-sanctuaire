let attempts = 0;

function checkCode() {
    // Récupération directe de la valeur saisie
    const inputVal = document.getElementById('code-input').value.trim();
    
    // Vérification stricte
    if (inputVal === "1701") {
        console.log("Accès autorisé");
        document.getElementById('lock-screen').style.display = 'none';
        document.getElementById('main-app').style.display = 'flex';
    } else {
        attempts++;
        console.log("Tentative échouée : " + attempts);
        
        if (attempts >= 3) {
            alert("SYSTÈME BLOQUÉ : 60 secondes");
            attempts = 0; // Reset du compteur après blocage
        } else {
            alert("CODE INCORRECT. Tentative " + attempts + "/3");
        }
    }
}
