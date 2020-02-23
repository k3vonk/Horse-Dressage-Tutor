import * as THREE from "three";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {Constants} from "../utils/Constants";


export let horse: THREE.Scene;

export default class Horse {
    private horseScene: THREE.Scene;

    constructor(scene: THREE.Scene) {
        const gltfLoader = new GLTFLoader();

        gltfLoader.load('/assets/models/scene.gltf', (gltf) => {
            horse = gltf.scene;

            horse.position.set(Constants.START_POSITION[0], Constants.START_POSITION[1], Constants.START_POSITION[2]);
            horse.rotation.set(Math.PI / 2, 0, 0);

            scene.add(horse);
            // later on may have to drag out the actual horse from the scene
            // Call my animation here

        });
    }


};
