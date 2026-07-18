function buildLighting() {
  const ambient = new THREE.AmbientLight(0x556070, 0.6);
  scene.add(ambient);

  const moon = new THREE.DirectionalLight(0x8fa5c0, 0.8);
  moon.position.set(-10, 20, 10);
  moon.castShadow = true;
  moon.shadow.mapSize.set(1024, 1024);
  scene.add(moon);

  // luz inestable/hostil cerca de la casa 2
  const flicker = new THREE.PointLight(0xff3b1f, 1.2, 12, 2);
  flicker.position.set(7, 3, 3);
  scene.add(flicker);
  flicker.userData.baseIntensity = 1.2;
  flicker.userData.isFlicker = true;
  scene.userData.flickerLight = flicker;
}
