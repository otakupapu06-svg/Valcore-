function buildStreet() {
  // La calle va de norte a sur (eje Z), pero se corta antes de llegar a la
  // plaza — la plaza misma cubre ese tramo con su propio piso de piedra,
  // así no quedan dos superficies distintas superpuestas ahí.
  const roadMat = new THREE.MeshStandardMaterial({ color: 0x232323, roughness: 0.95 });
  const sidewalkMat = new THREE.MeshStandardMaterial({ color: 0x555550, roughness: 1 });
  const lineMat = new THREE.MeshStandardMaterial({ color: 0xdddd88, emissive: 0x555522, emissiveIntensity: 0.3 });

  // Tramos de calle: uno al norte de la plaza, otro al sur
  const plazaStart = PLAZA_Z - PLAZA_RADIUS; // borde sur de la plaza
  const plazaEnd = PLAZA_Z + PLAZA_RADIUS;   // borde norte de la plaza

  const segments = [
    { from: plazaEnd, to: 34 },     // tramo norte (hacia la capilla/casas)
    { from: -34, to: plazaStart }   // tramo sur (hacia el puente, más adelante)
  ];

  segments.forEach(seg => {
    const len = seg.to - seg.from;
    if (len <= 0) return;
    const midZ = (seg.from + seg.to) / 2;

    const road = new THREE.Mesh(new THREE.PlaneGeometry(5, len), roadMat);
    road.rotation.x = -Math.PI / 2;
    road.position.set(0, 0.03, midZ);
    road.receiveShadow = true;
    scene.add(road);

    [-1, 1].forEach(side => {
      const sidewalk = new THREE.Mesh(new THREE.PlaneGeometry(2, len), sidewalkMat);
      sidewalk.rotation.x = -Math.PI / 2;
      sidewalk.position.set(side * 3.5, 0.02, midZ);
      sidewalk.receiveShadow = true;
      scene.add(sidewalk);
    });

    for (let z = seg.from + 1.5; z <= seg.to - 1.5; z += 3) {
      const dash = new THREE.Mesh(new THREE.PlaneGeometry(0.15, 1.2), lineMat);
      dash.rotation.x = -Math.PI / 2;
      dash.position.set(0, 0.04, z);
      scene.add(dash);
    }
  });

  buildLampPosts(segments);
}

function buildLampPosts(segments) {
  // Faroles: bombillas "falsas" — material que brilla (emissive) pero sin
  // una luz real (PointLight) detrás. Mucho más barato en un celular que
  // usar una luz dinámica por cada uno.
  const poleMat = new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.6, metalness: 0.4 });
  const headMat = new THREE.MeshStandardMaterial({
    color: 0xfff2c0, emissive: 0xffdd88, emissiveIntensity: 1.4
  });

  const positions = [];
  segments.forEach(seg => {
    for (let z = seg.from + 4; z <= seg.to - 4; z += 14) {
      positions.push([-5, z]);
      positions.push([5, z]);
    }
  });

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
