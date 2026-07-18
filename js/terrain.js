function buildTerrain() {
  const groundGeo = new THREE.PlaneGeometry(90, 90, 45, 45);
  groundGeo.rotateX(-Math.PI / 2);
  const pos = groundGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    pos.setY(i, (Math.random() - 0.5) * 0.06);
  }
  groundGeo.computeVertexNormals();

  const groundMat = new THREE.MeshStandardMaterial({ color: 0x333a34, roughness: 1 });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.receiveShadow = true;
  scene.add(ground);
}
