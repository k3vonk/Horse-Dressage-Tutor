import * as THREE from 'three';

interface Dimension {
    size: number,
    divisions: number
}

export default class Helper {
    private dimension: Dimension;

    constructor(dimension: Dimension, scene: THREE.Scene) {
        this.dimension = dimension;

        const gridHelper = new THREE.GridHelper( this.dimension.size, this.dimension.divisions );
        gridHelper.rotation.x = Math.PI/2; // Correct helper grid rotation
        const axesHelper = new THREE.AxesHelper( 3 );
        scene.add( gridHelper );
        scene.add( axesHelper );
    }

}
