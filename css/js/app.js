// ==========================================================
// LOX OS — LOGIQUE APPLICATIVE SÉCURISÉE (ANTI-CRASH)
// ==========================================================

// 1. GESTION DES ONGLETS (SWITCH TABS)
// Placé tout en haut pour s'assurer que la navigation fonctionne TOUJOURS
function switchTab(tabId, button) {
    try {
        // Masquer toutes les sections
        const sections = document.querySelectorAll('.content-section');
        sections.forEach(sec => sec.style.display = 'none');

        // Afficher la section demandée
        const activeSection = document.getElementById(tabId + '-section');
        if (activeSection) {
            activeSection.style.display = 'block';
        }

        // Mettre à jour l'état visuel des boutons de navigation
        const buttons = document.querySelectorAll('.main-nav-btn');
        buttons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
    } catch (e) {
        console.error("Erreur switchTab:", e);
    }
}

// 2. VISION TACTIQUE CAMÉRA
let streamActive = false;
let videoElement = null;

async function toggleCamera() {
    videoElement = document.getElementById('webcam');
    const overlay = document.getElementById('cam-grid');
    const placeholder = document.getElementById('cam-placeholder');

    if (!videoElement) return;

    if (streamActive) {
        const stream = videoElement.srcObject;
        if (stream) {
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
        }
        videoElement.style.display = "none";
        overlay.style.display = "none";
        placeholder.style.display = "block";
        streamActive = false;
    } else {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment" },
                audio: false
            });
            videoElement.srcObject = stream;
            videoElement.style.display = "block";
            overlay.style.display = "block";
            placeholder.style.display = "none";
            streamActive = true;
        } catch (err) {
            alert("Accès caméra refusé ou non supporté.");
        }
    }
}

// 3. CAPTEURS (SONOMÈTRE)
let audioContext = null;
let analyser = null;
let microphone = null;
let javascriptNode = null;

function initAudioMeter() {
    const dbFill = document.getElementById('db-fill');
    const dbValue = document.getElementById('db-value');

    if (audioContext) {
        alert("Capteur audio déjà actif.");
        return;
    }

    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
        .then(function(stream) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            analyser = audioContext.createAnalyser();
            microphone = audioContext.createMediaStreamSource(stream);
            javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

            analyser.smoothingTimeConstant = 0.8;
            analyser.fftSize = 1024;

            microphone.connect(analyser);
            analyser.connect(javascriptNode);
            javascriptNode.connect(audioContext.destination);

            javascriptNode.onaudioprocess = function() {
                const array = new Uint8Array(analyser.frequencyBinCount);
                analyser.getByteFrequencyData(array);
                let values = 0;

                const length = array.length;
                for (let i = 0; i < length; i++) {
                    values += array[i];
                }

                const average = values / length;
                const volume = Math.round(average);
                
                if (dbFill) dbFill.style.width = Math.min(volume * 2, 100) + '%';
                if (dbValue) dbValue.innerText = "VOLUME AMBIANT : " + volume + " dB";
            };
            alert("Capteur audio initialisé.");
        })
        .catch(function(err) {
            alert("Impossible d'accéder au micro : " + err);
        });
}

// 4. BOUSSOLE (ORIENTATION)
function initCompass() {
    const needle = document.getElementById('needle');
    const compassData = document.getElementById('compass-data');

    if (!needle || !compassData) return;

    if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', function(event) {
            let alpha = event.alpha; // Rotation autour de l'axe Z (0 à 360 deg)
            if (alpha !== null) {
                needle.style.transform = `translate(-50%, -100%) rotate(${-alpha}deg)`;
                compassData.innerText = "AZIMUT : " + Math.round(alpha) + "°";
            } else {
                compassData.innerText = "AZIMUT : CAPTEUR INDISPONIBLE";
            }
        }, true);
        alert("Capteurs magnétiques calibrés.");
    } else {
        alert("Boussole non supportée sur ce navigateur.");
    }
}

// 5. SYNTHÉTISEUR TACTILE (AUDIO THEREMIN)
let synthContext = null;
let oscillator = null;
let gainNode = null;
let synthActive = false;

function toggleSynth() {
    const pad = document.getElementById('synth-pad');
    if (!pad) return;

    if (synthActive) {
        stopSynth();
    } else {
        try {
            synthContext = new (window.AudioContext || window.webkitAudioContext)();
            pad.innerText = "GLISSE TON DOIGT ICI";
            
            // Événements tactiles mobiles
            pad.addEventListener('touchmove', handleTouch);
            pad.addEventListener('touchend', stopTone);
            
            synthActive = true;
            alert("Synthétiseur activé ! Glisse ton doigt pour jouer.");
        } catch(e) {
            alert("L'audio Web n'est pas supporté.");
        }
    }
}

function handleTouch(e) {
    if (!synthContext) return;
    e.preventDefault();
    
    const pad = document.getElementById('synth-pad');
    const rect = pad.getBoundingClientRect();
    const touch = e.touches[0];
    
    const x = (touch.clientX - rect.left) / rect.width;
    const y = (touch.clientY - rect.top) / rect.height;

    // Calcul de la fréquence (X) et du volume (Y)
    const frequency = 150 + (x * 1000); // 150Hz à 1150Hz
    const volume = 1 - y; // Plus haut = plus fort

    playTone(frequency, volume);
}

function playTone(freq, vol) {
    if (!oscillator) {
        oscillator = synthContext.createOscillator();
        gainNode = synthContext.createGain();
        oscillator.type = 'sine';
        oscillator.connect(gainNode);
        gainNode.connect(synthContext.destination);
        oscillator.start();
    }
    oscillator.frequency.setValueAtTime(freq, synthContext.currentTime);
    gainNode.gain.setValueAtTime(vol * 0.1, synthContext.currentTime); // Limiter à 10% max volume
}

function stopTone() {
    if (oscillator) {
        oscillator.stop();
        oscillator.disconnect();
        oscillator = null;
    }
}

function stopSynth() {
    const pad = document.getElementById('synth-pad');
    stopTone();
    if (pad) {
        pad.innerText = "ZONE DE MODULATION TACTILE";
        pad.removeEventListener('touchmove', handleTouch);
        pad.removeEventListener('touchend', stopTone);
    }
    synthActive = false;
}

// 6. PROTOCOLE DE SECURITE (ALERTE ROUGE)
function triggerSelfDestruct() {
    document.body.classList.add('system-alarm-active');
    alert("ATTENTION : PROTOCOLE DE SURCHAUFFE ACTIVÉ ! Redémarrage système requis.");
    setTimeout(() => {
        document.body.classList.remove('system-alarm-active');
    }, 5000);
}

// 7. GESTION DU CHAT AVEC FIREBASE (SÉCURISÉE CONTRE LES CRASHS)
function sendMessage() {
    const input = document.getElementById('chat-input');
    if (!input) return;
    const text = input.value.trim();

    if (text === "") return;

    // Sécurité : On vérifie si la base de données Firebase est bien connectée
    if (typeof db !== 'undefined') {
        db.ref("messages").push({
            user: "Roméo",
            message: text,
            timestamp: Date.now()
        }).then(() => {
            input.value = "";
        }).catch(err => {
            alert("Erreur Firebase d'envoi : " + err.message);
        });
    } else {
        alert("Erreur : Le back-end Firebase n'est pas initialisé. Vérifie tes clés dans config.js.");
    }
}

// Écoute des messages en temps réel (si Firebase est actif)
document.addEventListener("DOMContentLoaded", function() {
    setTimeout(() => {
        if (typeof db !== 'undefined') {
            db.ref("messages").limitToLast(20).on("value", function(snapshot) {
                const chatBox = document.getElementById('chat-box');
                if (!chatBox) return;
                chatBox.innerHTML = "";
                
                snapshot.forEach(function(childSnapshot) {
                    const data = childSnapshot.val();
                    const msgDiv = document.createElement('div');
                    msgDiv.className = 'message-body';
                    msgDiv.style.padding = '8px 12px';
                    msgDiv.style.margin = '5px 0';
                    msgDiv.style.borderRadius = '4px';
                    msgDiv.innerHTML = `<strong style="color: var(--tech-cyan);">${data.user}:</strong> <span style="color: #fff;">${data.message}</span>`;
                    chatBox.appendChild(msgDiv);
                });
                chatBox.scrollTop = chatBox.scrollHeight;
            });
        }
    }, 1000); // Laisse 1 seconde à Firebase pour s'initialiser au démarrage
});
