import * as THREE from 'three';
import {GLTF} from "three/examples/jsm/loaders/GLTFLoader";
import {AnimationMixer, Object3D} from "three";
import {START} from "../utils/Constants";

class Horse {
    horse: Object3D;
    mixer: AnimationMixer;

    constructor(scene: THREE.Scene, horseGLTF: GLTF) {
        this.horse = horseGLTF.scene.getObjectByName("horse");
        this.horse.position.set(START.x, START.y, START.z);
        this.horse.up.set(0,0,1);

        scene.add(this.horse);

        // animation mixer
        this.mixer = new THREE.AnimationMixer(this.horse);
    }

    getHorse(): Object3D {
        return this.horse;
    }
}

export default Horse;
