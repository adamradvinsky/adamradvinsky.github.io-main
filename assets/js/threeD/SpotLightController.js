export default class SpotLightController {
    constructor(spotl) {
        this.spotlight = spotl;

        this.spotlight.position.set(0, 10, 0);
        this.spotlight.rotation.set(100, 20, 20);
        this.spotlight.target.position.set(0, -10, -10);

    }

    update(time) {

        // update spotlight

        // update spotlight target
    }
}