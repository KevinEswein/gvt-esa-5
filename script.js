let scene, camera, renderer, controls;
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

  // Add base body
  // Box
  const geometry1 = new THREE.BoxGeometry();
  const material1 = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry1, material1);
  scene.add(cube);
  // Sphere
  const geometry2 = new THREE.SphereGeometry();
  const material2 = new THREE.MeshBasicMaterial({ color: 0x0000ff });
  const sphere = new THREE.Mesh(geometry2, material2);
  sphere.position.set(2, 0, 0);
  scene.add(sphere);

  camera.position.z = 5;

  // Event-Listener (buttons)
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

  // Event-Listener (arrow keys)
  document.addEventListener('keydown', onDocumentKeyDown, false);
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

function updateRecursiveModel() {
  // TODO add logic for updating recursive sphere model
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
