import * as THREE from 'three';

export default class cameraController {


    ogCameraPos = new THREE.Vector3(0, 9, 20);
    newCameraPos = new THREE.Vector3(-22.243537735881734, 5.039747360887239, -21.77799380868578);
    isMoving = false;
    lookAtTarget = null;
    
    constructor(camera) {
        this.camera = camera;
        this.camera.position.set(0, 9, 20);
        this.isMoving = false;

    }


    update(time) {

        if (this.isMoving) {    
            this.camera.position.lerp(this.newCameraPos, 0.05);
            this.camera.lookAt(this.lookAtTarget);

            if (this.camera.position.distanceTo(this.newCameraPos) < 0.05) {
                this.isMoving = false;
                console.log("bruh");
            }
        }
    }

    MoveCamera(position, lookAt) {
        this.isMoving = true;
        this.newCameraPos.copy(position);
        this.lookAtTarget = lookAt;
    }

    ResetCamera() {
        this.camera.position.set(0, 9, 20);
    }
}
