function buildHouse(x, z, opts) {
  opts = opts || {};
  const group = new THREE.Group();
  group.position.set(x, 0, z);
  if (opts.rotationY) group.rotation.y = opts.rotationY;

  const WIDTH = 6, DEPTH = 5, WALL_H = 4;
  const PITCH = 1.8;      // altura del techo desde el borde de la pared hasta la cumbrera
  const OVERHANG = 0.45;  // cuánto sobresale el techo de las paredes

  const wallColor = opts.broken ? 0x5c4a44 : (opts.wallColor ?? 0x8a7460);
  const roofColor = opts.broken ? 0x2b2320 : (opts.roofColor ?? 0x4a3226);
  const trimColor = opts.broken ? 0x1c1614 : (opts.trimColor ?? 0x3b2a1e);
  const doorColor = opts.broken ? 0x1c1614 : (opts.doorColor ?? trimColor);

  const wallMat = new THREE.MeshStandardMaterial({ color: wallColor, roughness: 0.9 });
  const roofMat = new THREE.MeshStandardMaterial({ color: roofColor, roughness: 1 });
  const trimMat = new THREE.MeshStandardMaterial({ color: trimColor, roughness: 0.85 });

  // Paredes
  const walls = new THREE.Mesh(new THREE.BoxGeometry(WIDTH, WALL_H, DEPTH), wallMat);
  walls.position.y = WALL_H / 2;
  walls.castShadow = true;
  walls.receiveShadow = true;
  group.add(walls);

  // Zócalo — una franja más oscura en la base, como piedra o madera húmeda,
  // rompe la monotonía de tener toda la pared del mismo color.
  const plinth = new THREE.Mesh(new THREE.BoxGeometry(WIDTH + 0.06, 0.35, DEPTH + 0.06), trimMat);
  plinth.position.y = 0.18;
  plinth.receiveShadow = true;
  group.add(plinth);

  buildGableRoof(group, WIDTH, DEPTH, WALL_H, PITCH, OVERHANG, roofMat, wallMat);
  buildChimney(group, WIDTH, WALL_H, PITCH, roofColor);

  // Puerta con marco
  const doorFrame = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.4, 0.08), trimMat);
  doorFrame.position.set(0, 1.2, 2.54);
  group.add(doorFrame);
  const door = new THREE.Mesh(new THREE.BoxGeometry(1, 2.2, 0.12), new THREE.MeshStandardMaterial({ color: doorColor, roughness: 0.7 }));
  door.position.set(0, 1.1, 2.58);
  group.add(door);
  // perilla
  const knob = new THREE.Mesh(new THREE.SphereGeometry(0.05, 6, 6), new THREE.MeshStandardMaterial({ color: 0xd4b483, metalness: 0.6, roughness: 0.3 }));
  knob.position.set(0.35, 1.1, 2.65);
  group.add(knob);

  // Escalones de entrada
  const stepMat = new THREE.MeshStandardMaterial({ color: 0x6b655c, roughness: 1 });
  for (let i = 0; i < 2; i++) {
    const step = new THREE.Mesh(new THREE.BoxGeometry(1.6 - i * 0.3, 0.15, 0.4), stepMat);
    step.position.set(0, 0.08 + i * 0.15, 2.9 + i * 0.35);
    step.receiveShadow = true;
    group.add(step);
  }

  // Ventanas
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

function buildGableRoof(group, width, depth, wallH, pitch, overhang, roofMat, wallMat) {
  // Dos paños inclinados que se encuentran en la cumbrera (eje Z) — un techo
  // a dos aguas de verdad, en vez del cono genérico de antes.
  const runX = width / 2 + overhang;
  const slopeLen = Math.sqrt(runX * runX + pitch * pitch);
  const angle = Math.atan2(pitch, runX);
  const roofDepth = depth + overhang * 2;
  const thickness = 0.12;

  [-1, 1].forEach(side => {
    const panel = new THREE.Mesh(new THREE.BoxGeometry(slopeLen, thickness, roofDepth), roofMat);
    panel.position.set(side * runX / 2, wallH + pitch / 2, 0);
    panel.rotation.z = side * -angle;
    panel.castShadow = true;
    panel.receiveShadow = true;
    group.add(panel);
  });

  // Remates triangulares al frente y atrás (cierran el hueco bajo el techo,
  // como la parte de arriba de una fachada con ático)
  const gableShape = new THREE.Shape();
  gableShape.moveTo(-width / 2, 0);
  gableShape.lineTo(width / 2, 0);
  gableShape.lineTo(0, pitch);
  gableShape.closePath();
  const gableGeo = new THREE.ShapeGeometry(gableShape);

  [depth / 2 + 0.01, -depth / 2 - 0.01].forEach(gz => {
    const gable = new THREE.Mesh(gableGeo, wallMat);
    gable.position.set(0, wallH, gz);
    group.add(gable);
  });
}

function buildChimney(group, width, wallH, pitch, roofColor) {
  const mat = new THREE.MeshStandardMaterial({ color: 0x5a4a42, roughness: 1 });
  const chimney = new THREE.Mesh(new THREE.BoxGeometry(0.55, 1.6, 0.55), mat);
  // descentrada, no clavada justo en la cumbrera — se ve menos artificial
  chimney.position.set(width / 2 - 1.4, wallH + pitch * 0.55 + 0.6, -0.8);
  chimney.castShadow = true;
  group.add(chimney);

  const cap = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.12, 0.75), mat);
  cap.position.set(chimney.position.x, chimney.position.y + 0.86, chimney.position.z);
  group.add(cap);
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

  // cruceta de la ventana — dos listones finos, le da aspecto más de casa
  // real que un panel de vidrio liso
  const crossMat = new THREE.MeshStandardMaterial({ color: 0x2e2117 });
  const vBar = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.9, 0.08), crossMat);
  vBar.position.z = 0.07;
  g.add(vBar);
  const hBar = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.06, 0.08), crossMat);
  hBar.position.z = 0.07;
  g.add(hBar);

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
