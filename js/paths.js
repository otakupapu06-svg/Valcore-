function buildPaths() {
  const pathMat = new THREE.MeshStandardMaterial({ color: 0x3a352c, roughness: 1 });
  const edgeMat = new THREE.MeshStandardMaterial({ color: 0x272319, roughness: 1 });

  const spine = [
    { x: 1, z: -36 },
    { x: -2, z: -25 },
    { x: 1, z: -14 },
    { x: -1, z: -2 },
    { x: 2, z: 10 },
    { x: -1, z: 22 },
    { x: 1, z: 34 }
  ];
  buildPathRibbon(spine, 4.2, pathMat, edgeMat);

  const eastBranch = [
    { x: 1, z: -14 },
    { x: 8, z: -10 },
    { x: 14, z: -3 },
    { x: 18, z: 7 }
  ];
  buildPathRibbon(eastBranch, 2.6, pathMat, edgeMat);

  const westBranch = [
    { x: 0, z: -6 },
    { x: -7, z: -4 },
    { x: -13, z: 1 },
    { x: -17, z: 4 }
  ];
  buildPathRibbon(westBranch, 2.6, pathMat, edgeMat);
}

function buildPathRibbon(points, width, mat, edgeMat) {
  const curvePoints = points.map(p => new THREE.Vector3(p.x, 0, p.z));
  const curve = new THREE.CatmullRomCurve3(curvePoints, false, 'catmullrom', 0.4);
  const segments = Math.max(20, points.length * 12);
  const sampled = curve.getPoints(segments);

  const positions = [];
  const uvs = [];
  for (let i = 0; i < sampled.length; i++) {
    const p = sampled[i];
    const prev = sampled[Math.max(0, i - 1)];
    const next = sampled[Math.min(sampled.length - 1, i + 1)];
    const dir = new THREE.Vector3().subVectors(next, prev).normalize();
    const perp = new THREE.Vector3(-dir.z, 0, dir.x).multiplyScalar(width / 2);

    const left = new THREE.Vector3().addVectors(p, perp);
    const right = new THREE.Vector3().subVectors(p, perp);

    positions.push(left.x, 0.05, left.z);
    positions.push(right.x, 0.05, right.z);

    const v = i / (sampled.length - 1);
    uvs.push(0, v, 1, v);
  }

  const indices = [];
  for (let i = 0; i < sampled.length - 1; i++) {
    const a = i * 2, b = i * 2 + 1, c = i * 2 + 2, d = i * 2 + 3;
    indices.push(a, b, c, b, d, c);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();

  const mesh = new THREE.Mesh(geo, mat);
  mesh.receiveShadow = true;
  scene.add(mesh);

  buildPathEdges(sampled, width, edgeMat);
}

function buildPathEdges(sampled, width, edgeMat) {
  for (let i = 0; i < sampled.length; i += 3) {
    const p = sampled[i];
    const prev = sampled[Math.max(0, i - 1)];
    const next = sampled[Math.min(sampled.length - 1, i + 1)];
    const dir = new THREE.Vector3().subVectors(next, prev).normalize();
    const perp = new THREE.Vector3(-dir.z, 0, dir.x).multiplyScalar(width / 2 + 0.15);

    [1, -1].forEach(side => {
      if (Math.random() > 0.5) return;
      const ep = new THREE.Vector3().addVectors(p, perp.clone().multiplyScalar(side));
      const stone = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.08, 0.3), edgeMat);
      stone.position.set(ep.x, 0.04, ep.z);
      stone.rotation.y = Math.random() * Math.PI;
      scene.add(stone);
    });
  }
                 }
