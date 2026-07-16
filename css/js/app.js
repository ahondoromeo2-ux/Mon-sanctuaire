// ==========================================================
// LOX OS — NAVIGATION & GÉNÉRATEUR D'ONDES PHYSIQUES
// ==========================================================

// 1. SYSTÈME DE NAVIGATION ENTRE LES ONGLETS (SPA)
function switchTab(tabId, btn) {
    // Masquer toutes les sections de contenu
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Désactiver l'état actif sur tous les boutons de navigation
    document.querySelectorAll('.main-nav-btn').forEach(button => {
        button.classList.remove('active');
    });

    // Afficher la section demandée et activer le bouton correspondant
    const targetSection = document.getElementById(`${tabId}-section`);
    if (targetSection) {
        targetSection.style.display = 'block';
    }
    btn.classList.add('active');
}

// 2. GÉNÉRATEUR AUDIO PHYSIQUE (Onde pure de 432 Hz)
let audioCtx;
let mainOsc;
let isTonePlaying = false;

function toggleTone() {
    // Initialiser l'AudioContext au premier clic de l'utilisateur (sécurité navigateur)
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (isTonePlaying) {
        // Couper l'onde
        mainOsc.stop();
        isTonePlaying = false;
        document.getElementById('global-status').innerText = "LINK_SECURE";
    } else {
        // Démarrer l'onde sinusoïdale pure à 432 Hz
        mainOsc = audioCtx.createOscillator();
        mainOsc.type = 'sine';
        mainOsc.frequency.setValueAtTime(432, audioCtx.currentTime);
        mainOsc.connect(audioCtx.destination);
        mainOsc.start();
        isTonePlaying = true;
        document.getElementById('global-status').innerText = "FREQ_432HZ_ACTIVE";
    }
}
