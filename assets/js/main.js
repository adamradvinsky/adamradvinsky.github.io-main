// import threejs
import * as THREE from 'three';

// importer for 3d models
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import CameraController from './threeD/CameraController.js';
import SpotLightController from './threeD/SpotLightController.js';



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


let bruh = new THREE.Vector3(-22.243537735881734, 5.039747360887239, -21.77799380868578);
let testmovecamera = false;
document.addEventListener("keydown", (event) => {
    if (event.key === "a") {
        camController.MoveCamera(bruh, testpopup.position);
    }
})




function onDrag(event) {
    if (isDragging) {
        velocityX = event.movementX * 0.005;
        velocityY = event.movementY * 0.005;
    }
}



// set up camera
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight, // aspect ratio
    0.1, // near clipping
    1000, // far clipping
);
const camController = new CameraController(camera);


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

    // // wireframe
    // roomModel.traverse((node) => {
    //     if (node.isMesh) {
    //         // Toggle the wireframe property on the existing material    
    //         node.material = sphereMaterial;
    //     }
    // });
    scene.add(roomModel);
});




// set up spotlight
const spotLight = new THREE.SpotLight(0xffffff, 500, 1000, 1.5, 1);
const spotLightController = new SpotLightController(spotLight);
scene.add(spotLight);
scene.add(spotLight.target);



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



// 3d pop up
const testpopmesh = new THREE.PlaneGeometry(20, 10);
const testpopmaterial = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    transparent: true,
    opacity: 1,
    side: THREE.DoubleSide
});

const testpopup = new THREE.Mesh(testpopmesh, testpopmaterial);
testpopup.position.set(-15, 6, -12);
testpopup.rotation.y = 0.7999999999999999;
scene.add(testpopup);




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
        popupProgress += speed
    } else {
        popupProgress -= speed;
    }


    camController.update(time);
    spotLightController.update(time);

    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);


function openPopup() {
    popupVisible = true;
}

function closePopup() {
    popupVisible = false;
}