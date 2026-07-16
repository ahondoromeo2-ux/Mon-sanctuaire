// ==========================================================
// LOX OS — LOGIQUE APPLICATIVE SÉCURISÉE AVEC SOURCE MÈRE
// ==========================================================

// 1. GESTION DES ONGLETS (SWITCH TABS)
function switchTab(tabId, button) {
    try {
        const sections = document.querySelectorAll('.content-section');
        sections.forEach(sec => sec.style.display = 'none');

        const activeSection = document.getElementById(tabId + '-section');
        if (activeSection) {
            activeSection.style.display = 'block';
        }

        const buttons = document.querySelectorAll('.main-nav-btn');
        buttons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
    } catch (e) {
        console.error("Erreur switchTab:", e);
    }
}

// 2. SAUVEGARDE ET SYNCHRONISATION DE LA SOURCE MÈRE (REALTIME FIREBASE)
function saveSynchronicite() {
    const input = document.getElementById('sync-input');
    if (!input) return;
    const text = input.value.trim();

    if (text === "") return;

    if (typeof db !== 'undefined') {
        db.ref("synchronicites").push({
            details: text,
            timestamp: Date.now()
        }).then(() => {
            input.value = "";
            alert("Synchronicité archivée dans la Source Mère.");
        }).catch(err => {
            alert("Erreur de synchronisation : " + err.message);
        });
    } else {
        alert("Erreur : Connexion au serveur indisponible.");
    }
}

function saveDiscipline() {
    const input = document.getElementById('discipline-input');
    if (!input) return;
    const text = input.value.trim();

    if (text === "") return;

    if (typeof db !== 'undefined') {
        db.ref("discipline").push({
            notes: text,
            timestamp: Date.now()
        }).then(() => {
            input.value = "";
            alert("Données d'objectifs mises à jour.");
        }).catch(err => {
            alert("Erreur de synchronisation : " + err.message);
        });
    } else {
        alert("Erreur : Connexion au serveur indisponible.");
    }
}

// Chargement en direct de l'historique des synchronicités
function initSourceSync() {
    if (typeof db !== 'undefined') {
        db.ref("synchronicites").limitToLast(5).on("value", function(snapshot) {
            const container = document.getElementById('sync-history');
            if (!container) return;
            container.innerHTML = "";
            
            snapshot.forEach(function(childSnapshot) {
                const data = childSnapshot.val();
                const div = document.createElement('div');
                div.style.borderBottom = '1px solid rgba(255,255,255,0.03)';
                div.style.padding = '4px 0';
                div.style.fontFamily = 'JetBrains Mono, monospace';
                const date = new Date(data.timestamp).toLocaleTimeString();
                div.innerHTML = `<span style="color: var(--tech-cyan);">[${date}]</span> ${data.details}`;
                container.prepend(div);
            });
        });
    }
}

// 3. VISION TACTIQUE CAMÉRA
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
            alert("Accès caméra refusé.");
        }
    }
}

// 4. CAPTEURS (SONOMÈTRE)
let audioContext = null;
let analyser = null;
let microphone = null;
let javascriptNode = null;

function initAudioMeter() {
    const dbFill = document.getElementById('db-fill');
    const dbValue = document.getElementById('db-value');

    if (audioContext) return;

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
            alert("Microphone calibré.");
        })
        .catch(function(err) {
            alert("Erreur micro : " + err);
        });
}

// 5. BOUSSOLE (ORIENTATION)
function initCompass() {
    const needle = document.getElementById('needle');
    const compassData = document.getElementById('compass-data');

    if (!needle || !compassData) return;

    if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', function(event) {
            let alpha = event.alpha;
            if (alpha !== null) {
                needle.style.transform = `translate(-50%, -100%) rotate(${-alpha}deg)`;
                compassData.innerText = "AZIMUT : " + Math.round(alpha) + "°";
            }
        }, true);
        alert("Boussole synchronisée.");
    } else {
        alert("Boussole non supportée.");
    }
}

// 6. SYNTHÉTISEUR TACTILE (AUDIO THEREMIN)
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
            pad.addEventListener('touchmove', handleTouch);
            pad.addEventListener('touchend', stopTone);
            synthActive = true;
            alert("Synthétiseur actif.");
        } catch(e) {
            alert("Audio non supporté.");
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

    const frequency = 150 + (x * 1000);
    const volume = 1 - y;

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
    gainNode.gain.setValueAtTime(vol * 0.1, synthContext.currentTime);
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

// 7. PROTOCOLE DE SECURITE (ALERTE ROUGE)
function triggerSelfDestruct() {
    document.body.classList.add('system-alarm-active');
    alert("ATTENTION : PROTOCOLE DE SURCHAUFFE ACTIVÉ !");
    setTimeout(() => {
        document.body.classList.remove('system-alarm-active');
    }, 5000);
}

// 8. CHAT SÉCURISÉ
function sendMessage() {
    const input = document.getElementById('chat-input');
    if (!input) return;
    const text = input.value.trim();

    if (text === "") return;

    if (typeof db !== 'undefined') {
        db.ref("messages").push({
            user: "Roméo",
            message: text,
            timestamp: Date.now()
        }).then(() => {
            input.value = "";
        }).catch(err => {
            alert("Erreur d'envoi : " + err.message);
        });
    } else {
        alert("Base de données déconnectée.");
    }
}

// Écoute de la base de données
document.addEventListener("DOMContentLoaded", function() {
    setTimeout(() => {
        if (typeof db !== 'undefined') {
            initSourceSync(); // Initialise la synchro de l'onglet Source Mère
            
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
                    msgDiv.style.borderRadius = '8px';
                    msgDiv.innerHTML = `<strong style="color: var(--tech-cyan);">${data.user}:</strong> <span style="color: #fff;">${data.message}</span>`;
                    chatBox.appendChild(msgDiv);
                });
                chatBox.scrollTop = chatBox.scrollHeight;
            });
        }
    }, 1000);
});
