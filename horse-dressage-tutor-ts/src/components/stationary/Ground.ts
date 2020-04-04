import * as THREE from "three";
import {defaultColors, defaultGridOptions} from "../../utils/Constants";

class Ground {
    constructor(scene: THREE.Scene) {
        const geometry = new THREE.PlaneGeometry(defaultGridOptions.width, defaultGridOptions.height, defaultGridOptions.segments);
        const material = new THREE.MeshBasicMaterial({color: defaultColors.groundColor, side: THREE.DoubleSide});
        const plane = new THREE.Mesh(geometry, material);

        scene.add(plane);
    }
}

export default Ground;
