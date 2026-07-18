function buildLighting() {
  const ambient = new THREE.AmbientLight(0x556070, 0.7);
  scene.add(ambient);

  const moon = new THREE.DirectionalLight(0x8fa5c0, 0.8);
  moon.position.set(-10, 20, 10);
  moon.castShadow = true;
  moon.shadow.mapSize.set(512, 512);
  scene.add(moon);

  // Nota: la luz roja parpadeante de la casa rota se agrega en houses.js
  // cuando esa casa se construya (Capítulo 2) — así no gastamos una luz
  // dinámica en algo que todavía no existe en el mundo.
}
