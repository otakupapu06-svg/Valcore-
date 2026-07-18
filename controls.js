function setupTouchControls() {
  let dragging = false, lastX = 0, lastY = 0;
  let pinchDist = null;

  renderer.domElement.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      dragging = true;
      lastX = e.touches[0].clientX;
      lastY = e.touches[0].clientY;
    } else if (e.touches.length === 2) {
      dragging = false;
      pinchDist = getPinchDist(e);
    }
  }, { passive: true });

  renderer.domElement.addEventListener('touchmove', (e) => {
    if (e.touches.length === 1 && dragging) {
      const dx = e.touches[0].clientX - lastX;
      const dy = e.touches[0].clientY - lastY;
      theta -= dx * 0.005;
      phi = Math.max(0.15, Math.min(1.4, phi - dy * 0.005));
      lastX = e.touches[0].clientX;
      lastY = e.touches[0].clientY;
      updateCamera();
    } else if (e.touches.length === 2) {
      const newDist = getPinchDist(e);
      if (pinchDist) {
        radius = Math.max(6, Math.min(45, radius - (newDist - pinchDist) * 0.03));
        updateCamera();
      }
      pinchDist = newDist;
    }
  }, { passive: true });

  renderer.domElement.addEventListener('touchend', () => { dragging = false; pinchDist = null; }, { passive: true });

  // fallback mouse (para probar en PC también)
  let mouseDown = false;
  renderer.domElement.addEventListener('mousedown', (e) => { mouseDown = true; lastX = e.clientX; lastY = e.clientY; });
  window.addEventListener('mouseup', () => mouseDown = false);
  window.addEventListener('mousemove', (e) => {
    if (!mouseDown) return;
    theta -= (e.clientX - lastX) * 0.005;
    phi = Math.max(0.15, Math.min(1.4, phi - (e.clientY - lastY) * 0.005));
    lastX = e.clientX; lastY = e.clientY;
    updateCamera();
  });
  renderer.domElement.addEventListener('wheel', (e) => {
    radius = Math.max(6, Math.min(45, radius + e.deltaY * 0.02));
    updateCamera();
  });
}

function getPinchDist(e) {
  const dx = e.touches[0].clientX - e.touches[1].clientX;
  const dy = e.touches[0].clientY - e.touches[1].clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

function updateCamera() {
  camera.position.x = target.x + radius * Math.sin(phi) * Math.sin(theta);
  camera.position.y = target.y + radius * Math.cos(phi);
  camera.position.z = target.z + radius * Math.sin(phi) * Math.cos(theta);
  camera.lookAt(target);
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
    }
