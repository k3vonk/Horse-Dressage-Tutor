/**
 * Ground class : construct the ground (box shape) for the scene
 *
 * @Author: Ga Jun Young, 16440714
 */
import * as THREE from "three";
import {defaultColors, defaultGridOptions} from "../utils/defined/Constants";

class Ground {
    constructor(scene: THREE.Scene) {
        const geometry = new THREE.BoxGeometry(defaultGridOptions.height, defaultGridOptions.height, defaultGridOptions.height);
        const material = new THREE.MeshBasicMaterial({color: defaultColors.groundColor});
        const boxMesh = new THREE.Mesh(geometry, material);
        boxMesh.position.setZ(defaultGridOptions.zAxis);

        // display grid of the box
        const boxHelper = new THREE.BoxHelper( boxMesh, 0x000000 );

        scene.add(boxMesh);
        scene.add(boxHelper);
    }
}

export default Ground;
