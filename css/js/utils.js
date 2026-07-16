// ==========================================================
// LOX OS — MOTEUR DE RÉDUCTION PYTHAGORICIENNE RÉELLE
// ==========================================================

// Table de correspondance Lettres -> Chiffres (Alphabet de Pythagore)
const pythMap = {
    a:1, j:1, s:1,
    b:2, k:2, t:2,
    c:3, l:3, u:3,
    d:4, m:4, v:4,
    e:5, n:5, w:5,
    f:6, o:6, x:6,
    g:7, p:7, y:7,
    h:8, q:8, z:8,
    i:9, r:9
};

// Algorithme de réduction récursive (s'arrête aux chiffres 1-9 et maîtres-nombres)
function reduceToVibration(num) {
    while (num > 9 && num !== 11 && num !== 22 && num !== 33) {
        num = String(num).split('').reduce((sum, digit) => sum + parseInt(digit), 0);
    }
    return num;
}

// Lancement du calcul depuis l'interface
function runNumerology() {
    const nameInput = document.getElementById('num-name').value.trim().toLowerCase();
    const dateInput = document.getElementById('num-date').value;
    
    let nameResultHtml = "";
    let dateResultHtml = "";

    // 1. Analyse du nom complet
    if (nameInput) {
        let sum = 0;
        for (let i = 0; i < nameInput.length; i++) {
            const char = nameInput[i];
            if (pythMap[char]) {
                sum += pythMap[char];
            }
        }
        const finalExpression = reduceToVibration(sum);
        nameResultHtml = `<strong>EXPRESSION DU NOM :</strong><br>&gt; Somme brute des lettres : ${sum}<br>&gt; Réduction vibratoire : <strong>${finalExpression}</strong>`;
    } else {
        nameResultHtml = `<strong>EXPRESSION DU NOM :</strong><br>&gt; Aucun nom fourni pour l'analyse.`;
    }

    // 2. Analyse de la date de naissance
    if (dateInput) {
        const parts = dateInput.split('-'); // Format [AAAA, MM, JJ]
        const totalSum = parts.join('').split('').reduce((sum, digit) => sum + parseInt(digit), 0);
        const lifePath = reduceToVibration(totalSum);
        
        dateResultHtml = `<strong>CHEMIN DE VIE :</strong><br>&gt; Alignement temporel : ${parts[2]}/${parts[1]}/${parts[0]}<br>&gt; Somme brute : ${totalSum}<br>&gt; Vibration du Chemin de Vie : <strong>${lifePath}</strong>`;
    } else {
        dateResultHtml = `<strong>CHEMIN DE VIE :</strong><br>&gt; Aucune date sélectionnée.`;
    }

    // Affichage des résultats réels calculés
    document.getElementById('name-res-box').innerHTML = nameResultHtml;
    document.getElementById('date-res-box').innerHTML = dateResultHtml;
    document.getElementById('numerology-results').style.display = "block";
}
