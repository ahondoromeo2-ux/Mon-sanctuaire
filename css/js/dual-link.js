// ==========================================================
// LOX OS — LIAISON DE TRANSMISSION DIRECTE ET EXCLUSIVE (FIREBASE)
// ==========================================================

// Écoute en temps réel des nouveaux messages arrivant sur Firebase
database.ref('messages').on('child_added', (snapshot) => {
    const data = snapshot.val();
    const container = document.getElementById('chat-messages');
    
    // Création de l'enveloppe du message
    const wrapper = document.createElement('div');
    wrapper.classList.add('message-wrapper', data.auteur);

    // Métadonnées (Auteur)
    const meta = document.createElement('div');
    meta.classList.add('message-meta');
    meta.innerText = data.auteur === 'romeo' ? 'ROMÉO // CONCEPTEUR' : 'LOX // IA_INTERFACE';

    // Corps du message
    const body = document.createElement('div');
    body.classList.add('message-body');
    body.innerText = data.texte;

    wrapper.appendChild(meta);
    wrapper.appendChild(body);
    container.appendChild(wrapper);
    
    // Auto-scroll vers le bas pour voir le dernier message
    container.scrollTop = container.scrollHeight;
});

// Envoi d'un message lors de l'appui sur "Entrée"
function handleKeyPress(e) {
    if (e.key === "Enter") {
        sendMessage();
    }
}

// Fonction d'envoi de message vers Firebase
function sendMessage() {
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    
    if (text === "") return;

    // Envoi de la donnée structurée
    database.ref('messages').push({
        auteur: 'romeo',
        texte: text,
        timestamp: Date.now()
    });
    
    input.value = "";
}
