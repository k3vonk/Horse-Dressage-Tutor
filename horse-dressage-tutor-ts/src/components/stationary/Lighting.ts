import * as THREE from 'three';

export default class Lighting {
    constructor(scene: THREE.Scene) {
        const ambientLight = new THREE.AmbientLight();
        ambientLight.intensity = 0.25;

        const spotLight = new THREE.SpotLight();
        spotLight.position.set(-15, -20, 30);
        spotLight.penumbra = 1;
        spotLight.rotation.set(Math.PI/2, 0, 0);
        spotLight.castShadow = true;

        scene.add(ambientLight);
        scene.add(spotLight);
    }
}
