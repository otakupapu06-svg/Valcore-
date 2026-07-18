// Muestra errores en pantalla (en vez de la consola, que en Android no se ve)
window.addEventListener('error', function (e) {
  const box = document.getElementById('error-box');
  box.style.display = 'block';
  box.textContent += 'ERROR: ' + e.message + '\n(línea ' + e.lineno + ')\n\n';
});

window.addEventListener('unhandledrejection', function (e) {
  const box = document.getElementById('error-box');
  box.style.display = 'block';
  box.textContent += 'PROMISE ERROR: ' + e.reason + '\n\n';
});
