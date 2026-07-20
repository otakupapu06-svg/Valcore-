function buildLighting() {
  const ambient = new THREE.AmbientLight(0x556070, 0.95);
  scene.add(ambient);

  const moon = new THREE.DirectionalLight(0x8fa5c0, 1.05);
  moon.position.set(-10, 20, 10);
  moon.castShadow = true;
  moon.shadow.mapSize.set(512, 512);
  scene.add(moon);
}
