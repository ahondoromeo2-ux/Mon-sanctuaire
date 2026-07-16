let attempts = 0;
function checkCode() {
    if(document.getElementById('code-input').value === "1701") {
        document.getElementById('lock-screen').style.display = 'none';
        document.getElementById('main-app').style.display = 'flex';
    } else {
        attempts++;
        if(attempts >= 3) alert("SYSTÈME BLOQUÉ : 60s");
    }
}
function show(id) {
    document.querySelectorAll('main section').forEach(s => s.style.display = 'none');
    document.getElementById(id).style.display = 'block';
}
function crypt() {
    let text = document.getElementById('j-input').value;
    alert("Entrée cryptée : " + btoa(text)); // Base64 simple
}
