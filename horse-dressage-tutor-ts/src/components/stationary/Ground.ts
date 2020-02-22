import * as THREE from 'three';

interface Dimensions {
    width: number,
    height: number,
    segments: number
}

export default class Ground  {

    constructor(dimensions: Dimensions, scene: THREE.Scene) {
        const geometry = new THREE.PlaneGeometry( dimensions.width, dimensions.height, dimensions.segments );
        const material = new THREE.MeshBasicMaterial( {color: 0xc2b280 , side: THREE.DoubleSide} );
        const plane = new THREE.Mesh( geometry, material );

        scene.add( plane );
    }
}
