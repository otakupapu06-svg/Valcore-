// La Capilla de San Roque — el edificio con más peso simbólico del pueblo.
// Su campanario tiene el reloj que quedó detenido en 3:33 tras el incendio
// de 1962. Se ve desde buena parte de la plaza; el jugador la va a mirar
// muchas veces sin saber todavía por qué le llama la atención.

const CAPILLA_X = 0;
const CAPILLA_Z = 20; // al norte de la plaza (que está en z = -15)

function buildCapilla() {
  const group = new THREE.Group();
  group.position.set(CAPILLA_X, 0, CAPILLA_Z);

  const stoneMat = new THREE.MeshStandardMaterial({ color: 0x6e6a60, roughness: 0.9 });
  const roofMat = new THREE.MeshStandardMaterial({ color: 0x342b26, roughness: 1 });

  // Nave principal — la fachada (puerta, reloj) mira hacia -Z, es decir,
  // hacia la plaza.
  const nave = new THREE.Mesh(new THREE.BoxGeometry(6, 5, 10), stoneMat);
  nave.position.y = 2.5;
  nave.castShadow = true;
  nave.receiveShadow = true;
  group.add(nave);

  const naveRoof = new THREE.Mesh(new THREE.ConeGeometry(5.2, 3, 4), roofMat);
  naveRoof.rotation.y = Math.PI / 4;
  naveRoof.position.set(0, 6.5, 0);
  naveRoof.castShadow = true;
  group.add(naveRoof);

  // Puerta principal, sobre la fachada sur
  const doorMat = new THREE.MeshStandardMaterial({ color: 0x241a14, roughness: 1 });
  const door = new THREE.Mesh(new THREE.BoxGeometry(1.4, 2.6, 0.2), doorMat);
  door.position.set(0, 1.3, -5.05);
  group.add(door);

  // Un par de ventanas altas y angostas a los lados de la nave
  const windowMat = new THREE.MeshStandardMaterial({
    color: 0xffdd88, emissive: 0xffcc55, emissiveIntensity: 0.4, transparent: true, opacity: 0.8
  });
  [-2.55, 2.55].forEach(wx => {
    const win = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.8, 0.7), windowMat);
    win.position.set(wx, 3, -1);
    group.add(win);
  });

  // Campanario — más alto, sobre la fachada sur (el frente que ve la plaza)
  const tower = new THREE.Mesh(new THREE.BoxGeometry(2.6, 8, 2.6), stoneMat);
  tower.position.set(0, 4, -6.5);
  tower.castShadow = true;
  group.add(tower);

  const towerRoof = new THREE.Mesh(new THREE.ConeGeometry(2.1, 2.5, 4), roofMat);
  towerRoof.rotation.y = Math.PI / 4;
  towerRoof.position.set(0, 9.25, -6.5);
  towerRoof.castShadow = true;
  group.add(towerRoof);

  // Cruz en la punta
  const crossMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.4, metalness: 0.5 });
  const crossV = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.9, 0.1), crossMat);
  crossV.position.set(0, 11, -6.5);
  group.add(crossV);
  const crossH = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.1, 0.1), crossMat);
  crossH.position.set(0, 11.2, -6.5);
  group.add(crossH);

  buildStoppedClock(group);

  scene.add(group);
  scene.userData.capilla = group;
}

function buildStoppedClock(parent) {
  // El reloj detenido — 3 y 33. No se mueve nunca; no hay lógica de
  // animación acá a propósito, es fijo desde 1962 en la ficción del juego.
  const clockGroup = new THREE.Group();
  clockGroup.position.set(0, 6.3, -7.82);
  clockGroup.rotation.y = Math.PI; // la cara mira hacia -Z, hacia la plaza

  const faceMat = new THREE.MeshStandardMaterial({
    color: 0xe8e2cf, emissive: 0x2a2418, emissiveIntensity: 0.3, roughness: 0.7
  });
  const face = new THREE.Mesh(new THREE.CircleGeometry(1.1, 20), faceMat);
  clockGroup.add(face);

  const rimMat = new THREE.MeshStandardMaterial({ color: 0x1c1a16, roughness: 0.6, metalness: 0.3 });
  const rim = new THREE.Mesh(new THREE.RingGeometry(1.05, 1.2, 20), rimMat);
  rim.position.z = 0.01;
  clockGroup.add(rim);

  const handMat = new THREE.MeshStandardMaterial({ color: 0x181614, roughness: 0.5 });

  // Manecilla de hora, apuntando entre el 3 y el 4 (son las 3:33)
  const hourGeo = new THREE.BoxGeometry(0.09, 0.55, 0.04);
  hourGeo.translate(0, 0.275, 0); // pivote en la base, no en el medio
  const hourHand = new THREE.Mesh(hourGeo, handMat);
  hourHand.position.z = 0.03;
  hourHand.rotation.z = -THREE.MathUtils.degToRad(106.5);
  clockGroup.add(hourHand);

  // Manecilla de minutos, apuntando al 33 (cerca del 7)
  const minGeo = new THREE.BoxGeometry(0.06, 0.85, 0.04);
  minGeo.translate(0, 0.425, 0);
  const minuteHand = new THREE.Mesh(minGeo, handMat);
  minuteHand.position.z = 0.035;
  minuteHand.rotation.z = -THREE.MathUtils.degToRad(198);
  clockGroup.add(minuteHand);

  parent.add(clockGroup);
    }
