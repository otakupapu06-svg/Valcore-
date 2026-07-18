function buildHouse(x, z, opts) {
  const group = new THREE.Group();
  group.position.set(x, 0, z);

  const wallColor = opts.broken ? 0x5c4a44 : 0x8a7460;
  const wallMat = new THREE.MeshStandardMaterial({ color: wallColor, roughness: 0.9 });
  const walls = new THREE.Mesh(new THREE.BoxGeometry(6, 4, 5), wallMat);
  walls.position.y = 2;
  walls.castShadow = true;
  walls.receiveShadow = true;
  group.add(walls);

  const roofColor = opts.broken ? 0x2b2320 : 0x4a3226;
  const roofMat = new THREE.MeshStandardMaterial({ color: roofColor, roughness: 1 });
  const roof = new THREE.Mesh(new THREE.ConeGeometry(4.5, 2.2, 4), roofMat);
  roof.rotation.y = Math.PI / 4;
  roof.position.y = 5.1;
  roof.castShadow = true;
  group.add(roof);

  // puerta
  const doorMat = new THREE.MeshStandardMaterial({ color: opts.broken ? 0x1c1614 : 0x3b2a1e, roughness: 1 });
  const door = new THREE.Mesh(new THREE.BoxGeometry(1, 2.2, 0.15), doorMat);
  door.position.set(0, 1.1, 2.53);
  group.add(door);

  // ventanas
  const windowPositions = [
    [-1.8, 2.4, 2.53],
    [1.8, 2.4, 2.53],
    [2.53, 2.4, -1.5],
    [-2.53, 2.4, -1.5]
  ];
  windowPositions.forEach(([wx, wy, wz], i) => {
    const win = opts.broken ? buildBrokenWindow() : buildWindow();
    win.position.set(wx, wy, wz);
    if (Math.abs(wz) < Math.abs(wx) && i >= 2) win.rotation.y = Math.PI / 2;
    group.add(win);
  });

  scene.add(group);
  return group;
}

function buildWindow() {
  const g = new THREE.Group();
  const frame = new THREE.Mesh(
    new THREE.BoxGeometry(1.1, 1.1, 0.1),
    new THREE.MeshStandardMaterial({ color: 0x2e2117 })
  );
  g.add(frame);
  const glass = new THREE.Mesh(
    new THREE.BoxGeometry(0.9, 0.9, 0.05),
    new THREE.MeshStandardMaterial({ color: 0xffdd88, emissive: 0xffcc55, emissiveIntensity: 0.5, transparent: true, opacity: 0.85 })
  );
  glass.position.z = 0.06;
  g.add(glass);
  return g;
}

function buildBrokenWindow() {
  const g = new THREE.Group();
  const frame = new THREE.Mesh(
    new THREE.BoxGeometry(1.1, 1.1, 0.1),
    new THREE.MeshStandardMaterial({ color: 0x1a1310 })
  );
  g.add(frame);

  // vidrio roto: varios triángulos irregulares en vez de un panel entero,
  // con huecos oscuros que dejan ver "adentro"
  const shardMat = new THREE.MeshStandardMaterial({
    color: 0x33251f, roughness: 0.3, metalness: 0.1,
    emissive: 0x220a05, emissiveIntensity: 0.3, side: THREE.DoubleSide
  });
  const shardCount = 5;
  for (let i = 0; i < shardCount; i++) {
    const shape = new THREE.Shape();
    const cx = (Math.random() - 0.5) * 0.7;
    const cy = (Math.random() - 0.5) * 0.7;
    shape.moveTo(cx, cy);
    shape.lineTo(cx + (Math.random() - 0.5) * 0.5, cy + (Math.random() - 0.5) * 0.5);
    shape.lineTo(cx + (Math.random() - 0.5) * 0.5, cy + (Math.random() - 0.5) * 0.5);
    shape.closePath();
    const geo = new THREE.ShapeGeometry(shape);
    const shard = new THREE.Mesh(geo, shardMat);
    shard.position.z = 0.05 + Math.random() * 0.02;
    shard.rotation.z = Math.random() * Math.PI;
    g.add(shard);
  }

  // una luz débil y roja "detrás" de la ventana rota, como si algo hubiera adentro
  const innerGlow = new THREE.PointLight(0xff2200, 0.4, 2);
  innerGlow.position.z = -0.3;
  g.add(innerGlow);

  return g;
      }
