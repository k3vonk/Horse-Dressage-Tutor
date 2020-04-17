/**
 * Lighting class: construct different light sources for the scene
 *
 * @author: Ga Jun Young, 16440714
 */
import * as THREE from 'three';

class Lighting {
    constructor(scene: THREE.Scene) {
        const ambientLight = new THREE.AmbientLight();
        ambientLight.intensity = 0.2;
        ambientLight.position.set(0,0,0);

        const spotLight = new THREE.SpotLight();
        spotLight.position.set(-15, -25, 30);
        spotLight.penumbra = 0.4;
        spotLight.rotation.set(Math.PI/2, 0, 0);
        spotLight.castShadow = true;

        scene.add(ambientLight);
        scene.add(spotLight);
    }
}

export default Lighting;
