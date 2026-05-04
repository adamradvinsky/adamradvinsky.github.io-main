// import threejs
import * as THREE from 'three';

// importer for 3d models
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

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
window.addEventListener('mousemove', (event) => {
    // Convert mouse position to normalized device coordinates (-1 to +1)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

document.addEventListener('mouseup', () => isDragging = false);

function onDrag(event) {
    if (isDragging) {
        velocityX = event.movementX * 0.005;
        velocityY = event.movementY * 0.005;
    }
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

    // wireframe
    // roomModel.traverse((node) => {
    //     if (node.isMesh) {
    //         // Toggle the wireframe property on the existing material
    //         node.material.wireframe = true;
    //     }
    // });
    scene.add(roomModel);

});

//const cube = new THREE.CubeGeom
const cubeMesh = new THREE.BoxGeometry(3, 3, 3);
const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });

const cube = new THREE.Mesh(cubeMesh, cubeMaterial);
scene.add(cube);

// 3d pop up
const popupGeometry = new THREE.PlaneGeometry(2, 1);
const popupMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 1
});
let popupVisible = false;

const popup = new THREE.Mesh(popupGeometry, popupMaterial);
popup.position.set(3, 3, 3);
let popupProgress = 0;
scene.add(popup);



const spotLight = new THREE.SpotLight(0xffffff, 500, 1000, 1.5, 1);
spotLight.position.set(0, 10, 0);
spotLight.rotation.set(100, 20, 20);
spotLight.target.position.set(0, -10, -10);
scene.add(spotLight);
scene.add(spotLight.target);

// const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.0);
// scene.add(hemiLight);


let hoveredObject = null;
let speed = 0.1;

function animate(time) {
    controls.update();
    popup.lookAt(camera.position);

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects([cube], true);

    if (intersects.length > 0) {
        const object = intersects[0].object;
        if (hoveredObject != object) {
            if (hoveredObject) {
                hoveredObject.material.emissive.set(0x000000);
                closePopup();
            }

            hoveredObject = object;
            hoveredObject.material.emissive.set(0x333333);
            openPopup();
        }
    } else {
        // If nothing is intersected, reset the previous hovered object
        if (hoveredObject) {
            hoveredObject.material.emissive.set(0x000000);
            closePopup();
            hoveredObject = null;
        }
    }


    if (popupVisible) {
        // if (popupProgress < 0.8) {

        //     popup.position.x += (Math.random() - 0.5);

        //     popup.position.y += (Math.random() - 0.5);

        //     popup.material.opacity = popupProgress * (Math.random() + 0.5);
        // }
        popupProgress += speed
    } else {
        popupProgress -= speed;
    }

    popup.position.y = 1.5 + (1 - popupProgress) * 0.5;
    popupProgress = Math.max(0, Math.min(1, popupProgress));
    popup.scale.set = (popupProgress, popupProgress, popupProgress);
    popup.material.opacity = popupProgress;

    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);


function openPopup() {
    popupVisible = true;
}

function closePopup() {
    popupVisible = false;
}