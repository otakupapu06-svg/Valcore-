// La plaza central de Valcorvo — el corazón "presentable" del pueblo.
// Lleva la estatua de Anselmo Corvo, el fundador, con pátina de bronce
// envejecido: nadie la ha limpiado en años, pero nadie lo admite tampoco.
// Se ubica al sur de las casas, ensanchando la calle en ese punto.

const PLAZA_Z = -15;
const PLAZA_RADIUS = 9;

function buildPlaza() {
  buildPlazaGround();
  buildFountainWithStatue();
  buildPlazaBenches();
  buildPlazaLamps();
}

function buildPlazaGround() {
  // Piso de piedra, más claro y "cuidado" que la acera normal — es la cara
  // que el pueblo quiere mostrar.
  const stoneMat = new THREE.MeshStandardMaterial({ color: 0x6b6560, roughness: 0.85 });
  const plaza = new THREE.Mesh(new THREE.CircleGeometry(PLAZA_RADIUS, 24), stoneMat);
  plaza.rotation.x = -Math.PI / 2;
  plaza.position.set(0, 0.035, PLAZA_Z);
  plaza.receiveShadow = true;
  scene.add(plaza);

  // Anillo decorativo de losas más oscuras marcando el borde
  const ringMat = new THREE.MeshStandardMaterial({ color: 0x4a463f, roughness: 0.9 });
  const ring = new THREE.Mesh(new THREE.RingGeometry(PLAZA_RADIUS - 0.4, PLAZA_RADIUS, 24), ringMat);
  ring.rotation.x = -Math.PI / 2;
  ring.position.set(0, 0.04, PLAZA_Z);
  scene.add(ring);
}

function buildFountainWithStatue() {
  const group = new THREE.Group();
  group.position.set(0, 0, PLAZA_Z);

  // Base de la fuente
  const basinMat = new THREE.MeshStandardMaterial({ color: 0x59554e, roughness: 0.8 });
  const basin = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.6, 0.5, 16), basinMat);
  basin.position.y = 0.25;
  basin.castShadow = true;
  basin.receiveShadow = true;
  group.add(basin);

  // Agua estancada — quieta, sin brillo alegre. Un verde apagado, no azul limpio.
  const waterMat = new THREE.MeshStandardMaterial({
    color: 0x394a42, roughness: 0.3, metalness: 0.1,
    emissive: 0x0d1a15, emissiveIntensity: 0.2
  });
  const water = new THREE.Mesh(new THREE.CylinderGeometry(2.15, 2.15, 0.08, 16), waterMat);
  water.position.y = 0.52;
  group.add(water);

  // Pedestal central
  const pedestalMat = new THREE.MeshStandardMaterial({ color: 0x55504a, roughness: 0.9 });
  const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.65, 1.1, 8), pedestalMat);
  pedestal.position.y = 1.1;
  pedestal.castShadow = true;
  group.add(pedestal);

  // Estatua de Anselmo Corvo — bronce con pátina verdosa, low-poly, silueta
  // simple: capa, postura rígida, mirando hacia la calle principal.
  const bronzeMat = new THREE.MeshStandardMaterial({ color: 0x3d4a3d, roughness: 0.55, metalness: 0.35 });

  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.42, 1.4, 8), bronzeMat);
  body.position.y = 1.1 + 0.7;
  body.castShadow = true;
  group.add(body);

  const cape = new THREE.Mesh(new THREE.ConeGeometry(0.55, 1.5, 6, 1, true), bronzeMat);
  cape.position.y = 1.1 + 0.65;
  cape.rotation.x = Math.PI;
  cape.castShadow = true;
  group.add(cape);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.24, 8, 8), bronzeMat);
  head.position.y = 1.1 + 1.55;
  head.castShadow = true;
  group.add(head);

  // Un brazo extendido señalando hacia el camino de entrada del pueblo —
  // gesto fundacional clásico de estatua de plaza.
  const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.75, 6), bronzeMat);
  arm.position.set(0.3, 1.1 + 1.05, 0.15);
  arm.rotation.z = -Math.PI / 3;
  arm.rotation.x = -Math.PI / 8;
  arm.castShadow = true;
  group.add(arm);

  scene.add(group);
  scene.userData.founderStatue = group;
}

function buildPlazaBenches() {
  const woodMat = new THREE.MeshStandardMaterial({ color: 0x3b2a1e, roughness: 1 });
  const benchCount = 4;
  for (let i = 0; i < benchCount; i++) {
    const angle = (i / benchCount) * Math.PI * 2 + Math.PI / 4;
    const bx = Math.cos(angle) * (PLAZA_RADIUS - 2);
    const bz = PLAZA_Z + Math.sin(angle) * (PLAZA_RADIUS - 2);

    const bench = new THREE.Group();
    const seat = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.1, 0.5), woodMat);
    seat.position.y = 0.45;
    seat.castShadow = true;
    seat.receiveShadow = true;
    bench.add(seat);

    const back = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.5, 0.08), woodMat);
    back.position.set(0, 0.7, -0.21);
    back.castShadow = true;
    bench.add(back);

    [-0.6, 0.6].forEach(lx => {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.45, 0.45), woodMat);
      leg.position.set(lx, 0.225, 0);
      bench.add(leg);
    });

    bench.position.set(bx, 0, bz);
    bench.rotation.y = -angle + Math.PI / 2;
    scene.add(bench);
  }
}

function buildPlazaLamps() {
  // Solo 2 faroles (esquinas opuestas) en vez de 4 — cada PointLight dinámico
  // tiene un costo real en GPUs de celular. Con la niebla y el farol de calle
  // más cercano, la plaza igual se siente iluminada sin duplicar luces.
  scene.userData.plazaLights = scene.userData.plazaLights || [];
  const poleMat = new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.6, metalness: 0.4 });
  const positions = [
    [PLAZA_RADIUS - 1, PLAZA_Z + PLAZA_RADIUS - 1],
    [-(PLAZA_RADIUS - 1), PLAZA_Z - (PLAZA_RADIUS - 1)]
  ];

  positions.forEach(([x, z]) => {
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 2.8, 6), poleMat);
    pole.position.set(x, 1.4, z);
    pole.castShadow = true;
    scene.add(pole);

    const headMat = new THREE.MeshStandardMaterial({
      color: 0xfff2c0, emissive: 0xffdd88, emissiveIntensity: 0.7
    });
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 8), headMat);
    head.position.set(x, 2.8, z);
    scene.add(head);

    const lamp = new THREE.PointLight(0xffcc77, 0.55, 8, 2);
    lamp.position.set(x, 2.7, z);
    scene.add(lamp);
    scene.userData.plazaLights.push(lamp);
  });
                             }
