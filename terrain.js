function buildTerrain() {
  const groundGeo = new THREE.PlaneGeometry(80, 80, 40, 40);
  groundGeo.rotateX(-Math.PI / 2);
  // pequeñas irregularidades para que no sea un plano perfecto, excepto justo
  // debajo de la calle/veredas (|x| < 5.5), que debe quedar plano para que el
  // asfalto no quede "peleando" con el relieve del terreno (z-fighting)
  const pos = groundGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = Math.abs(x) < 5.5 ? 0 : (Math.random() - 0.5) * 0.15;
    pos.setY(i, y);
  }
  groundGeo.computeVertexNormals();
  const groundMat = new THREE.MeshStandardMaterial({ color: 0x3a3f33, roughness: 1 });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.receiveShadow = true;
  scene.add(ground);
}
