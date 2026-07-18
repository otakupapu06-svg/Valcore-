function buildTrees() {
  scene.userData.trees = [];
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x3d2a1e, roughness: 1 });
  const leafMatCalm = new THREE.MeshStandardMaterial({ color: 0x4d6b3a, roughness: 0.9 });
  const leafMatHostile = new THREE.MeshStandardMaterial({ color: 0x38402c, roughness: 1 });

  const spots = [
    [-12, -4, false], [-3, 5, false], [-13, 6, false],
    [11, -5, true], [4, 6, true], [13, 5, true]
  ];

  spots.forEach(([x, z, hostile]) => {
    addTree(x, z, hostile, trunkMat, leafMatCalm, leafMatHostile, 1);
  });
}

// Anillo de bosque alrededor de todo el terreno — Valcorvo está rodeado de
// bosque por todos lados (según el lore), así que el límite del mapa nunca
// se ve como un borde vacío, siempre hay árboles cerrando el horizonte.
function buildForestBoundary() {
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x342217, roughness: 1 });
  const leafMat = new THREE.MeshStandardMaterial({ color: 0x2f3d26, roughness: 1 });
  const edge = 36; // borde del terreno de 80x80, dejando margen

  for (let i = 0; i < 90; i++) {
    // reparte árboles en un anillo grueso, no en una línea perfecta,
    // para que se vea como bosque natural y no como una cerca
    const angle = Math.random() * Math.PI * 2;
    const dist = edge - Math.random() * 10;
    const x = Math.cos(angle) * dist;
    const z = Math.sin(angle) * dist;
    // dejamos libre la franja de la calle para que no se tape la entrada
    if (Math.abs(x) < 6 && Math.abs(z) > 30) continue;
    addTree(x, z, false, trunkMat, leafMat, leafMat, 0.7 + Math.random() * 0.8);
  }
}

function addTree(x, z, hostile, trunkMat, leafMatCalm, leafMatHostile, scale) {
  const tree = new THREE.Group();
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.22, 2.2, 6), trunkMat);
  trunk.position.y = 1.1;
  trunk.castShadow = true;
  tree.add(trunk);

  const leaves = new THREE.Group();
  const leafMat = hostile ? leafMatHostile : leafMatCalm;
  for (let i = 0; i < 3; i++) {
    const blob = new THREE.Mesh(new THREE.IcosahedronGeometry(0.9 - i * 0.15, 0), leafMat);
    blob.position.set((Math.random() - 0.5) * 0.6, 2.3 + i * 0.6, (Math.random() - 0.5) * 0.6);
    blob.castShadow = true;
    leaves.add(blob);
  }
  tree.add(leaves);
  tree.position.set(x, 0, z);
  tree.scale.setScalar(scale);
  tree.userData.leaves = leaves;
  tree.userData.phase = Math.random() * Math.PI * 2;
  tree.userData.strength = hostile ? 0.09 : 0.05;
  scene.add(tree);
  scene.userData.trees.push(tree);
}

function buildLeafParticles() {
  const count = 60;
  const geo = new THREE.PlaneGeometry(0.12, 0.12);
  const mat = new THREE.MeshStandardMaterial({ color: 0x6b7a45, side: THREE.DoubleSide, roughness: 1 });
  const leaves = new THREE.InstancedMesh(geo, mat, count);
  const data = [];
  for (let i = 0; i < count; i++) {
    data.push({
      x: (Math.random() - 0.5) * 40,
      y: Math.random() * 4 + 0.3,
      z: (Math.random() - 0.5) * 40,
      speed: 0.6 + Math.random() * 0.8,
      drift: Math.random() * Math.PI * 2,
      spin: Math.random() * Math.PI * 2
    });
  }
  scene.add(leaves);
  scene.userData.leafParticles = { mesh: leaves, data };
      }
