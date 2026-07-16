// ==========================================================
// LOX OS — FONCTIONNALITÉS IMMERSIVES ET CAPTEURS AVANCÉS
// ==========================================================

// 1. SYSTÈME DE NAVIGATION ENTRE LES ONGLETS (SPA)
function switchTab(tabId, btn) {
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'none';
    });
    document.querySelectorAll('.main-nav-btn').forEach(button => {
        button.classList.remove('active');
    });

    const targetSection = document.getElementById(`${tabId}-section`);
    if (targetSection) {
        targetSection.style.display = 'block';
    }
    btn.classList.add('active');
}

// 2. VISION TACTIQUE CAMÉRA (WEB-CAMERA STREAMING)
let streamActive = false;
let videoElement = null;

async function toggleCamera() {
    videoElement = document.getElementById('webcam');
    const placeholder = document.getElementById('cam-placeholder');

    if (streamActive) {
        // Arrêter la caméra
        const stream = videoElement.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        videoElement.style.display = "none";
        placeholder.style.display = "block";
        streamActive = false;
    } else {
        // Lancer la caméra mobile
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user" }, // Utilise "environment" pour la caméra arrière
                audio: false
            });
            videoElement.srcObject = stream;
            videoElement.style.display = "block";
            placeholder.style.display = "none";
            streamActive = true;
        } catch (err) {
            alert("Accès caméra refusé ou non disponible sur cet appareil.");
        }
    }
}

// 3. SYNTHÉTISEUR TACTILE (THEREMIN)
let audioCtx = null;
let synthOsc = null;
let synthGain = null;
let synthActive = false;

function toggleSynth() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    const pad = document.getElementById('synth-pad');

    if (synthActive) {
        synthOsc.stop();
        pad.innerText = "ZONE DE MODULATION TACTILE";
        synthActive = false;
    } else {
        // Création des oscillateurs et amplis pour contrôle direct
        synthOsc = audioCtx.createOscillator();
        synthGain = audioCtx.createGain();
        
        synthOsc.type = 'sawtooth'; // Onde en dents de scie pour un son de synthé rétro futuriste
        synthOsc.connect(synthGain);
        synthGain.connect(audioCtx.destination);
        
        synthOsc.start();
        pad.innerText = "GLISSE TON DOIGT ICI POUR MODULER";
        synthActive = true;

        // Configuration des écoutes tactiles sur le PAD
        pad.addEventListener('pointermove', handleSynthMove);
    }
}

function handleSynthMove(e) {
    if (!synthActive) return;
    
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left; // Position X
    const y = e.clientY - rect.top;  // Position Y
    
    // Pourcentage par rapport au cadre
    const pctX = Math.max(0, Math.min(1, x / rect.width));
    const pctY = Math.max(0, Math.min(1, y / rect.height));

    // Calcul de la fréquence de 200 Hz à 1200 Hz sur X
    const freq = 200 + (pctX * 1000);
    // Calcul du volume (gain) de 0 à 0.5 sur Y
    const gainVal = (1 - pctY) * 0.5;

    synthOsc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    synthGain.gain.setValueAtTime(gainVal, audioCtx.currentTime);

    document.getElementById('synth-pad').innerText = `FREQ : ${Math.round(freq)} Hz | AMP : ${Math.round(pctY * 100)}%`;
}

// 4. PROTOCOLE D'URGENCE (EFFET SPÉCIAL CHOC)
function triggerSelfDestruct() {
    let countdown = 5;
    const audioAlert = new (window.AudioContext || window.webkitAudioContext)();
    
    const interval = setInterval(() => {
        if (countdown > 0) {
            // Son de bip d'alerte
            const osc = audioAlert.createOscillator();
            osc.type = 'square';
            osc.frequency.setValueAtTime(880, audioAlert.currentTime);
            osc.connect(audioAlert.destination);
            osc.start();
            osc.stop(audioAlert.currentTime + 0.1);
            
            // Flash rouge à l'écran
            document.body.style.backgroundColor = "red";
            setTimeout(() => {
                document.body.style.backgroundColor = "#050811";
            }, 150);

            // Notification vibrations (Android uniquement)
            if (navigator.vibrate) {
                navigator.vibrate(200);
            }

            document.getElementById('global-status').innerText = `CRITICAL_WARN : ${countdown}s`;
            countdown--;
        } else {
            clearInterval(interval);
            // Explosion visuelle et sonore finale
            document.body.style.backgroundColor = "#fff";
            document.getElementById('global-status').innerText = "SYSTEM_OVERHEAT";
            
            if (navigator.vibrate) {
                navigator.vibrate([500, 200, 500]);
            }

            alert("AVERTISSEMENT : Charge thermique maximale atteinte. Relancement du protocole de sécurité.");
            document.body.style.backgroundColor = "#050811";
            document.getElementById('global-status').innerText = "LINK_SECURE";
        }
    }, 1000);
}
