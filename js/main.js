// Estado global compartido por todos los módulos (terrain.js, houses.js, etc.
// lo leen y modifican directamente, ya que todos los scripts comparten el
// mismo scope global cuando se cargan con <script src>).
let scene, camera, renderer;
let target, dummy;
let radius = 22, theta = Math.PI * 0.25, phi = Math.PI * 0.35;
let t = 0;
let animationStopped = false;

// Llamada por three-loader.js una vez que THREE ya está disponible.
function startGame() {
  target = new THREE.Vector3(0, 2, 0);
  dummy = new THREE.Object3D();
  try {
    init();
    animate();
  } catch (err) {
    const box = document.getElementById('error-box');
    box.style.display = 'block';
    box.textContent += 'ERROR AL INICIAR (init): ' + err.message + '\n' + (err.stack || '') + '\n\n';
  }
}

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1a1d24);
  scene.fog = new THREE.Fog(0x1a1d24, 15, 55);

  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  // Sombras "duras" (sin difuminado) en vez del PCF suave por defecto:
  // más baratas en GPUs de celular y, de paso, encajan mejor con la
  // estética PS1 — esos juegos nunca tuvieron sombras suaves.
  renderer.shadowMap.type = THREE.BasicShadowMap;
  document.body.appendChild(renderer.domElement);

  buildTerrain();
  buildLighting();
  buildStreet();
  buildPlaza();
  buildCapilla();

  // Casa del protagonista — tonos cálidos de madera, lado oeste
  buildHouse(-11, 3, {
    broken: false,
    wallColor: 0x8a7460, roofColor: 0x4a3226, trimColor: 0x3b2a1e, doorColor: 0x2f4a34
  });

  // Casa de Nii — tonos más fríos, lado este, a buena distancia de la del
  // protagonista (no vecinas pegadas, pero sí a un paseo corto una de la otra)
  buildHouse(10, 8, {
    broken: false,
    wallColor: 0x6f7a86, roofColor: 0x33393f, trimColor: 0x2a2e33, doorColor: 0x7a2e22
  });

  buildTrees();
  buildForestBoundary();
  buildLeafParticles();

  updateCamera();
  setupTouchControls();
  window.addEventListener('resize', onResize);
}

function animate() {
  if (animationStopped) return;
  try {
    requestAnimationFrame(animate);
    t += 0.05;

    const fl = scene.userData.flickerLight;
    if (fl) {
      // parpadeo irregular, no una onda senoidal prolija: se siente más "roto"
      fl.intensity = fl.userData.baseIntensity * (0.5 + Math.random() * 0.7) * (Math.sin(t) > -0.8 ? 1 : 0.1);
    }

    // brisa: cada árbol mece sus hojas con su propia fase, no todos igual
    (scene.userData.trees || []).forEach(tree => {
      const s = tree.userData.strength;
      const p = tree.userData.phase;
      tree.userData.leaves.rotation.z = Math.sin(t * 1.3 + p) * s;
      tree.userData.leaves.rotation.x = Math.sin(t * 0.9 + p * 1.7) * s * 0.6;
    });

    // hojas sueltas arrastradas por el viento, caen y se reciclan arriba
    const lp = scene.userData.leafParticles;
    if (lp) {
      lp.data.forEach((d, i) => {
        d.x += Math.sin(t * 0.4 + d.drift) * 0.01 + 0.02; // deriva lateral + viento constante
        d.y -= d.speed * 0.01;
        d.spin += 0.03;
        if (d.y < 0.1) { d.y = 4 + Math.random() * 1.5; d.x = (Math.random() - 0.5) * 40; }
        if (d.x > 20) d.x = -20;
        dummy.position.set(d.x, d.y, d.z);
        dummy.rotation.set(d.spin * 0.5, d.spin, d.spin * 0.3);
        dummy.updateMatrix();
        lp.mesh.setMatrixAt(i, dummy.matrix);
      });
      lp.mesh.instanceMatrix.needsUpdate = true;
    }

    renderer.render(scene, camera);
  } catch (err) {
    animationStopped = true;
    const box = document.getElementById('error-box');
    box.style.display = 'block';
    box.textContent += 'ERROR EN ANIMATE (una sola vez): ' + err.message + '\n' + (err.stack || '') + '\n\n';
  }
        }
