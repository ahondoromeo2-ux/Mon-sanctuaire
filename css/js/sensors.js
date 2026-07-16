// ==========================================================
// LOX OS — CONTRÔLE DES CAPTEURS MATÉRIELS DU TÉLÉPHONE
// ==========================================================

// 1. CAPTEUR MICROPHONE (SONOMÈTRE RÉEL)
let audioAnalyzer;
let dataArray;

async function startAudioMonitor() {
    try {
        // Demande l'accès au microphone réel de ton appareil
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContext.createMediaStreamSource(stream);
        
        audioAnalyzer = audioContext.createAnalyser();
        audioAnalyzer.fftSize = 256;
        source.connect(audioAnalyzer);
        
        dataArray = new Uint8Array(audioAnalyzer.frequencyBinCount);
        updateSoundLevel();
    } catch (err) {
        alert("Permission d'accès au microphone refusée ou non supportée.");
    }
}

function updateSoundLevel() {
    if (!audioAnalyzer) return;
    requestAnimationFrame(updateSoundLevel);
    
    // Analyser le volume en temps réel
    audioAnalyzer.getByteFrequencyData(dataArray);
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
    }
    
    const average = sum / dataArray.length;
    const dbVal = Math.round((average / 255) * 100); // Conversion approximative en dB
    
    // Mettre à jour l'interface
    document.getElementById('db-display').innerText = `${dbVal} dB`;
    document.getElementById('db-bar').style.width = `${dbVal}%`;
}

// 2. CAPTEUR DE BOUSSOLE MAGNETIQUE
function requestOrientationPermission() {
    // Gestion spécifique pour iOS / Safari qui demande une autorisation explicite
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission()
            .then(state => {
                if (state === 'granted') {
                    window.addEventListener('deviceorientationabsolute', handleOrientation, true);
                }
            }).catch(console.error);
    } else {
        // Pour Android / Chrome classique
        window.addEventListener('deviceorientation', handleOrientation, true);
    }
}

function handleOrientation(event) {
    let heading = event.alpha; // Angle sur l'axe Z (Nord)
    
    if (event.webkitCompassHeading) {
        heading = event.webkitCompassHeading; // Support pour appareils iOS
    }
    
    if (heading !== null) {
        const rounded = Math.round(heading);
        // Rotation de l'aiguille de notre boussole
        document.getElementById('needle').style.transform = `rotate(${-rounded}deg)`;
        document.getElementById('compass-direction').innerText = `${rounded}°`;
    }
}
