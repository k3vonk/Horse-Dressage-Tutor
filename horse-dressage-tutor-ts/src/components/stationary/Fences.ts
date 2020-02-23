import * as THREE from 'three';
import {Vector3} from "three";


export default class Fences {
    private group: THREE.Group;
    private row: number;
    private column: number;

    constructor(scene: THREE.Scene) {
        this.row = 32;
        this.column = 18;

        // Create a group of fences
        this.group = new THREE.Group();
        this.buildRowFence(new Vector3(14, 8, 0), this.group, this.row);
        this.buildRowFence(new Vector3(14, -8, 0), this.group, this.row);
        this.buildColumnFence(new Vector3(-16, -8, 0), this.group, this.column, false);
        this.buildColumnFence(new Vector3(16, -8, 0), this.group, this.column, true);

        scene.add( this.group );
    }

    buildFence(position: Vector3): THREE.Mesh {
        const boxBufferGeometry = new THREE.BoxBufferGeometry(1, 1, 1);
        const meshLambertMaterial = new THREE.MeshLambertMaterial({color: "brown"});
        const fence = new THREE.Mesh(boxBufferGeometry, meshLambertMaterial);
        fence.position.set(position.x, position.y, position.z);

        return fence;
    }

    buildRowFence(position: Vector3, group: THREE.Group, size: number) {
        for (let i = 0; i < size; i++) {
            let curr: Vector3 = new Vector3();
            curr.x = -(0.5 + position.x) + (i - 1);
            curr.y = position.y >= 0? 0.5 + position.y : -(0.5 + -position.y);
            curr.z = 0.5 + position.z;

            group.add(this.buildFence(curr));
        }
    }

    buildColumnFence(position: Vector3, group: THREE.Group, size: number, hasGate: boolean) {
        for (let i = 0; i < size; i++) {
            let curr: Vector3 = new Vector3();
            curr.x = position.x >= 0? 0.5 + position.x : -(0.5 + -position.x);
            curr.y = (0.5 + (i - 1) + position.y);
            curr.z = 0.5 + position.z;

            if (!(hasGate && (i === size/2 || i === size/2 - 1))) {
                group.add(this.buildFence(curr));
            }
        }
    }

}
