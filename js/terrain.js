function buildTerrain() {
  const groundGeo = new THREE.PlaneGeometry(80, 80, 40, 40);
  groundGeo.rotateX(-Math.PI / 2);
  // pequeñas irregularidades para que no sea un plano perfecto
  const pos = groundGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const y = (Math.random() - 0.5) * 0.15;
    pos.setY(i, y);
  }
  groundGeo.computeVertexNormals();
  const groundMat = new THREE.MeshStandardMaterial({ color: 0x3a3f33, roughness: 1 });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.receiveShadow = true;
  scene.add(ground);

  const grid = new THREE.GridHelper(80, 40, 0x555555, 0x2a2a2a);
  grid.position.y = 0.02;
  scene.add(grid);
}
