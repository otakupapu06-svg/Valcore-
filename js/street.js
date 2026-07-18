function buildStreet() {
  // Calle asfaltada que corre de norte a sur (eje Z), en el centro del terreno
  const roadMat = new THREE.MeshStandardMaterial({ color: 0x232323, roughness: 0.95 });
  const road = new THREE.Mesh(new THREE.PlaneGeometry(5, 70), roadMat);
  road.rotation.x = -Math.PI / 2;
  road.position.y = 0.03;
  road.receiveShadow = true;
  scene.add(road);

  // línea central discontinua
  const lineMat = new THREE.MeshStandardMaterial({ color: 0xdddd88, emissive: 0x555522, emissiveIntensity: 0.3 });
  for (let z = -32; z <= 32; z += 3) {
    const dash = new THREE.Mesh(new THREE.PlaneGeometry(0.15, 1.2), lineMat);
    dash.rotation.x = -Math.PI / 2;
    dash.position.set(0, 0.04, z);
    scene.add(dash);
  }

  // veredas a los dos lados
  const sidewalkMat = new THREE.MeshStandardMaterial({ color: 0x555550, roughness: 1 });
  [-1, 1].forEach(side => {
    const sidewalk = new THREE.Mesh(new THREE.PlaneGeometry(2, 70), sidewalkMat);
    sidewalk.rotation.x = -Math.PI / 2;
    sidewalk.position.set(side * 3.5, 0.02, 0);
    sidewalk.receiveShadow = true;
    scene.add(sidewalk);
  });

  buildLampPosts();
}

function buildLampPosts() {
  // Faroles: bombillas "falsas" — material que brilla (emissive) pero sin
  // una luz real (PointLight) detrás. Con 10 faroles en el mapa, usar una
  // luz dinámica por cada uno sería muy pesado para un celular; así se ven
  // igual de encendidos sin costar nada de rendimiento.
  const poleMat = new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.6, metalness: 0.4 });
  const headMat = new THREE.MeshStandardMaterial({
    color: 0xfff2c0, emissive: 0xffdd88, emissiveIntensity: 1.4
  });

  const positions = [];
  for (let z = -28; z <= 28; z += 14) {
    positions.push([-5, z]);
    positions.push([5, z]);
  }

  positions.forEach(([x, z]) => {
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 3.2, 6), poleMat);
    pole.position.set(x, 1.6, z);
    pole.castShadow = true;
    scene.add(pole);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), headMat);
    head.position.set(x, 3.2, z);
    scene.add(head);
  });
}
