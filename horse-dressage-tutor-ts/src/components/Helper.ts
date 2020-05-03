/**
 * Helper class : display grid cells and axis
 *
 * @author: Ga Jun Young, 16440714
 */
import * as THREE from 'three';
import {defaultGridOptions} from "../utils/defined/Constants";

class Helper{

    constructor(scene: THREE.Scene) {
        const gridHelper = new THREE.GridHelper(defaultGridOptions.size, defaultGridOptions.divisions);
        const axesHelper = new THREE.AxesHelper(defaultGridOptions.axes);

        gridHelper.rotation.x = Math.PI/2; // Grid on XY Axis
        gridHelper.position.setZ(0.02); // raise the mesh a bit higher to prevent overlapping of colors
        scene.add(gridHelper);
        scene.add(axesHelper);
    }
}

export default Helper;
