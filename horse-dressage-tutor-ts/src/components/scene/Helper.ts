import * as THREE from 'three';
import {defaultGridOptions} from "../../utils/Constants";

class Helper{

    constructor(scene: THREE.Scene) {
        const gridHelper = new THREE.GridHelper(defaultGridOptions.width, defaultGridOptions.height);
        const axesHelper = new THREE.AxesHelper(defaultGridOptions.axes);

        gridHelper.rotation.x = Math.PI/2; // Grid on XY Axis
        scene.add(gridHelper);
        scene.add(axesHelper);
    }
}

export default Helper;
