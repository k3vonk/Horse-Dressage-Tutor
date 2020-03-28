import * as THREE from "three";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {Constants} from "../utils/Constants";

export default class Horse {
    private horseScene: THREE.Scene;
    private horse: THREE.Object3D;

    constructor(scene: THREE.Scene) {
        const gltfLoader = new GLTFLoader();

        gltfLoader.load('/assets/models/scene.gltf', (gltf) => {
            this.horseScene = gltf.scene;
            this.horse = this.horseScene.getObjectByName("horse");
            let pos = Constants.START.START_POSITION;
            this.horse.position.set(pos[0], pos[1], pos[2]);
            //this.horse.rotation.set(Math.PI / 2, Math.PI, 0);
            this.horse.up.set(0,0,1);
            this.horseScene.updateMatrixWorld();
            scene.add(this.horseScene);
            scene.add(this.horse);

            // later on may have to drag out the actual horse from the scene
            // Call my animation here
            console.log(this.dumpObject(this.horseScene).join('\n'));

        });
    }

    dumpObject(obj, lines = [], isLast = true, prefix = '') {
        const localPrefix = isLast ? '└─' : '├─';
        lines.push(`${prefix}${prefix ? localPrefix : ''}${obj.name || '*no-name*'} [${obj.type}]`);
        const newPrefix = prefix + (isLast ? '  ' : '│ ');
        const lastNdx = obj.children.length - 1;
        obj.children.forEach((child, ndx) => {
            const isLast = ndx === lastNdx;
            this.dumpObject(child, lines, isLast, newPrefix);
        });
        return lines;
    }

    getHorse(): THREE.Object3D {
        return this.horse;
    }


};
