// import threejs
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160/build/three.module.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight, // aspect ratio
    0.1, // near clipping
    1000, // far clipping
);


// // set camera position
// camera.position.set(0,2,5);


const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

function animate(time) {
    cube.rotation.x = time / 2000;
    cube.rotation.y = time / 1000;
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);