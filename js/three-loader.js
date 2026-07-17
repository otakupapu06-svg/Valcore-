// Intenta cargar Three.js desde varios servidores distintos, uno tras otro,
// hasta que alguno funcione. Cuando lo logra, arranca el juego (startGame,
// definido en main.js).
const threeSources = [
  'https://unpkg.com/three@0.128.0/build/three.min.js',
  'https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'
];

function loadScript(index) {
  if (index >= threeSources.length) {
    const box = document.getElementById('error-box');
    box.style.display = 'block';
    box.textContent += 'ERROR: No se pudo cargar Three.js desde ningún servidor probado. Tu conexión podría estar bloqueando estos dominios.\n\n';
    return;
  }
  const script = document.createElement('script');
  script.src = threeSources[index];
  script.onload = function () {
    const box = document.getElementById('error-box');
    box.textContent += 'Three.js cargado correctamente desde: ' + threeSources[index] + '\n\n';
    startGame();
  };
  script.onerror = function () {
    const box = document.getElementById('error-box');
    box.style.display = 'block';
    box.textContent += 'Falló: ' + threeSources[index] + ' — probando siguiente...\n\n';
    loadScript(index + 1);
  };
  document.head.appendChild(script);
}

loadScript(0);
