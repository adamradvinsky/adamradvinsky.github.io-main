// import threejs
import * as THREE from 'three';

// importer for 3d models
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.160/examples/jsm/controls/OrbitControls.js';

// my rooms model
let roomModel;

const scene = new THREE.Scene();
const loader = new GLTFLoader().setPath('models/');

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

let velocityX = 0;
let velocityY = 0;


// on drag
let isDragging = false;
document.addEventListener('mousedown', () => isDragging = true);
document.addEventListener('mousemove', onDrag);
document.addEventListener('mouseup', () => isDragging = false);

function onDrag(event) {
    if (isDragging) {
        velocityX = event.movementX * 0.005;
        velocityY = event.movementY * 0.005;
    }
}

const intersects = raycaster.intersectObjects(scene.children, true);
console.log("adams the goat");

if (intersects.length > 0) {
    const clickedObjects = intersects[0].object;
    console.log(clickedObjects.name);

}



const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight, // aspect ratio
    0.1, // near clipping
    1000, // far clipping
);

// // set camera position
camera.position.set(0, 9, 20);


// sets up renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


// allows for moving around scene and orbiting
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.minDistance = 4;
controls.maxDistance = 50;


// room
loader.load('scene.gltf', (gltf) => {
    roomModel = gltf.scene;
    roomModel.position.set(25, -3, -0);
    roomModel.rotation.set(0, Math.PI - 0.8, 0);
    scene.add(roomModel);

});


const spotLight = new THREE.SpotLight(0xffffff, 500, 1000, 1.5, 1);
spotLight.position.set(0, 10, 0);
spotLight.rotation.set(100, 20, 20);
spotLight.target.position.set(0, -10, -10);
scene.add(spotLight);
scene.add(spotLight.target);

// const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.0);
// scene.add(hemiLight);




function animate(time) {
    controls.update();

    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);