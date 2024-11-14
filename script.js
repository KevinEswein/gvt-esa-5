let scene, camera, renderer;
let recursionDepth = 0;
const recursionDepthSpan = document.getElementById('recursionDepth');

init();
animate();

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Grundkörper hinzufügen
  const geometry1 = new THREE.BoxGeometry();
  const material1 = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry1, material1);
  scene.add(cube);

  const geometry2 = new THREE.SphereGeometry();
  const material2 = new THREE.MeshBasicMaterial({ color: 0x0000ff });
  const sphere = new THREE.Mesh(geometry2, material2);
  sphere.position.set(2, 0, 0);
  scene.add(sphere);

  camera.position.z = 5;

  // Event-Listener für die Buttons
  document.getElementById('increaseRecursion').addEventListener('click', () => {
    recursionDepth++;
    recursionDepthSpan.textContent = recursionDepth;
    updateRecursiveModel();
  });

  document.getElementById('decreaseRecursion').addEventListener('click', () => {
    if (recursionDepth > 0) recursionDepth--;
    recursionDepthSpan.textContent = recursionDepth;
    updateRecursiveModel();
  });

  // Event-Listener für die Pfeiltasten
  document.addEventListener('keydown', onDocumentKeyDown, false);

  // Initiales rekursives Modell erstellen
  createRecursiveSphere(recursionDepth);
}

function onDocumentKeyDown(event) {
  switch (event.key) {
    case 'ArrowLeft':
      camera.position.x -= 0.1;
      break;
    case 'ArrowRight':
      camera.position.x += 0.1;
      break;
    case 'n':
      camera.position.z -= 0.1;
      break;
    case 'N':
      camera.position.z += 0.1;
      break;
  }
  camera.lookAt(scene.position);
}

function subdivideTriangle(v1, v2, v3, depth) {
  if (depth === 0) {
    const geometry = new THREE.BufferGeometry();
    geometry.setFromPoints([v1, v2, v3, v1]);
    const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
    const line = new THREE.Line(geometry, material);
    scene.add(line);
  } else {
    const v12 = v1.clone().lerp(v2, 0.5).normalize();
    const v23 = v2.clone().lerp(v3, 0.5).normalize();
    const v31 = v3.clone().lerp(v1, 0.5).normalize();

    subdivideTriangle(v1, v12, v31, depth - 1);
    subdivideTriangle(v2, v23, v12, depth - 1);
    subdivideTriangle(v3, v31, v23, depth - 1);
    subdivideTriangle(v12, v23, v31, depth - 1);
  }
}

function createRecursiveSphere(depth) {
  const vertices = [
    new THREE.Vector3(1, 0, 0),
    new THREE.Vector3(-1, 0, 0),
    new THREE.Vector3(0, 1, 0),
    new THREE.Vector3(0, -1, 0),
    new THREE.Vector3(0, 0, 1),
    new THREE.Vector3(0, 0, -1)
  ];

  subdivideTriangle(vertices[0], vertices[2], vertices[4], depth);
  subdivideTriangle(vertices[0], vertices[4], vertices[3], depth);
  subdivideTriangle(vertices[0], vertices[3], vertices[5], depth);
  subdivideTriangle(vertices[0], vertices[5], vertices[2], depth);
  subdivideTriangle(vertices[1], vertices[2], vertices[5], depth);
  subdivideTriangle(vertices[1], vertices[5], vertices[3], depth);
  subdivideTriangle(vertices[1], vertices[3], vertices[4], depth);
  subdivideTriangle(vertices[1], vertices[4], vertices[2], depth);
}

function updateRecursiveModel() {
  // Entfernen Sie das alte rekursive Modell
  for (let i = scene.children.length - 1; i >= 2; i--) {
    scene.remove(scene.children[i]);
  }
  createRecursiveSphere(recursionDepth);
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
