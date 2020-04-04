import * as THREE from 'three';
import {BoxBufferGeometry, Vector3} from "three";
import {defaultFenceOptions} from "../../utils/Constants";

class Fences {
    group: THREE.Group;

    constructor(scene: THREE.Scene) {
        // Create a group of fences
        this.group = new THREE.Group();
        this.buildRowFence(defaultFenceOptions.topRow);
        this.buildRowFence(defaultFenceOptions.bottomRow);
        this.buildColumnFence(defaultFenceOptions.leftColumn, false);
        this.buildColumnFence(defaultFenceOptions.rightColumn, true);
        scene.add(this.group);
    }

    buildFence(position: Vector3, boxBufferGeometry: BoxBufferGeometry): THREE.Mesh {
        const meshLambertMaterial = new THREE.MeshLambertMaterial({color: "white"});
        const fence = new THREE.Mesh(boxBufferGeometry, meshLambertMaterial);
        fence.position.set(position.x, position.y, position.z);

        return fence;
    }

    private buildRowFence(position: Vector3) {
        for (let i = 0; i < defaultFenceOptions.row; i++) {

            // Calculation of centering and positioning
            let curr: Vector3 = new Vector3();
            curr.x = -(0.5 + position.x) + (i - 1);
            curr.y = position.y >= 0? 0.5 + position.y : -(0.5 + -position.y);
            curr.z = position.z;

            // Box type condition
            let boxBufferGeometry: BoxBufferGeometry;
            if (i === 7 || i === 11 || i === 20 || i === 24) {
                boxBufferGeometry = new THREE.BoxBufferGeometry(defaultFenceOptions.wedgeStand.width, defaultFenceOptions.wedgeStand.height, defaultFenceOptions.wedgeStand.depth);

            } else if ((i < 7 || i > 11) && (i < 20 || i > 24)){
                boxBufferGeometry = new THREE.BoxBufferGeometry(defaultFenceOptions.wedge.width, defaultFenceOptions.wedge.height, defaultFenceOptions.wedge.depth);
            }

            this.group.add(this.buildFence(curr, boxBufferGeometry));
        }
    }

    private buildColumnFence(position: Vector3, hasGate: boolean) {
        for (let i = 0; i < defaultFenceOptions.column; i++) {
            // Calculation of centering and positioning
            let curr: Vector3 = new Vector3();
            curr.x = position.x >= 0? 0.5 + position.x : -(0.5 + -position.x);
            curr.y = (0.5 + (i - 1) + position.y);
            curr.z = position.z;

            // Box type condition
            let boxBufferGeometry: BoxBufferGeometry;
            if (i === 0 || i === defaultFenceOptions.column - 1) {
                boxBufferGeometry = new THREE.BoxBufferGeometry(defaultFenceOptions.box.width, defaultFenceOptions.box.height, defaultFenceOptions.box.depth);
            } else if(((i === 5  || i === 12) && !hasGate) || (hasGate && (i===7 || i===10))){
                boxBufferGeometry = new THREE.BoxBufferGeometry(defaultFenceOptions.wedgeStand.height, defaultFenceOptions.wedgeStand.width, defaultFenceOptions.wedgeStand.depth);
            } else {
                boxBufferGeometry = new THREE.BoxBufferGeometry(defaultFenceOptions.wedge.height, defaultFenceOptions.wedge.width, defaultFenceOptions.wedge.depth);
            }

            // Dont add a wedge if gate is present
            if (!(hasGate && (i === defaultFenceOptions.column/2 || i === defaultFenceOptions.column/2 - 1))) {
                this.group.add(this.buildFence(curr, boxBufferGeometry));
            }
        }
    }
}

export default Fences;
