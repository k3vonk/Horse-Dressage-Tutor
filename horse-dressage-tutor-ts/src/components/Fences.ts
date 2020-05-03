/**
 * Fence class : for the construction of fences on the scene
 *
 * @author: Ga Jun Young, 16440714
 */
import * as THREE from 'three';
import {BoxBufferGeometry, Vector3} from "three";
import {defaultFenceOptions} from "../utils/defined/Constants";

class Fences {
    private readonly fenceGroup: THREE.Group;

    constructor(scene: THREE.Scene) {
        // Create a group of fences
        this.fenceGroup = new THREE.Group();
        this.buildRowFence(defaultFenceOptions.topRow);
        this.buildRowFence(defaultFenceOptions.bottomRow);
        this.buildColumnFence(defaultFenceOptions.leftColumn, false);
        this.buildColumnFence(defaultFenceOptions.rightColumn, true);
        scene.add(this.fenceGroup);
    }

    /**
     * Create a specific fence mesh at a given position
     * @param position : location of where the fence should be placed
     * @param fenceGeometry : type of fence geometry
     */
    buildFence(position: Vector3, fenceGeometry: BoxBufferGeometry): THREE.Mesh {
        const meshLambertMaterial = new THREE.MeshLambertMaterial({color: "white"});
        const fence = new THREE.Mesh(fenceGeometry, meshLambertMaterial);
        fence.position.set(position.x, position.y, position.z);

        return fence;
    }

    /**
     * Given the index, decide on the fence geometry for a row of fences
     * @param index
     */
    rowFenceGeometry(index: number) {
        let fenceGeometry: BoxBufferGeometry;
        if (index === 7 || index === 11 || index === 20 || index === 24) {
            fenceGeometry = new THREE.BoxBufferGeometry(defaultFenceOptions.wedgeStand.width, defaultFenceOptions.wedgeStand.height, defaultFenceOptions.wedgeStand.depth);

        } else if ((index < 7 || index > 11) && (index < 20 || index > 24)) {
            fenceGeometry = new THREE.BoxBufferGeometry(defaultFenceOptions.wedge.width, defaultFenceOptions.wedge.height, defaultFenceOptions.wedge.depth);
        }
        return fenceGeometry;
    }

    /**
     * Given the index, decide on the fence geometry for a column of fences
     * @param index
     * @param hasGate
     */
    columnFenceGeometry(index: number, hasGate: boolean) {
        let fenceGeometry: BoxBufferGeometry;
        if (index === 0 || index === defaultFenceOptions.column - 1) {
            fenceGeometry = new THREE.BoxBufferGeometry(defaultFenceOptions.box.width, defaultFenceOptions.box.height, defaultFenceOptions.box.depth);
        } else if (((index === 5 || index === 12) && !hasGate) || (hasGate && (index === 7 || index === 10))) {
            fenceGeometry = new THREE.BoxBufferGeometry(defaultFenceOptions.wedgeStand.height, defaultFenceOptions.wedgeStand.width, defaultFenceOptions.wedgeStand.depth);
        } else {
            fenceGeometry = new THREE.BoxBufferGeometry(defaultFenceOptions.wedge.height, defaultFenceOptions.wedge.width, defaultFenceOptions.wedge.depth);
        }
        return fenceGeometry;
    }

    /**
     * Given a start position, build a row of fences of various geometry
     * @param startPosition
     */
    private buildRowFence(startPosition: Vector3) {
        for (let i = 0; i < defaultFenceOptions.row; i++) {
            // Calculation of centering and positioning
            let currPosition: Vector3 = new Vector3();
            currPosition.x = -(0.5 + startPosition.x) + (i - 1);
            currPosition.y = startPosition.y >= 0? 0.5 + startPosition.y : -(0.5 + -startPosition.y);
            currPosition.z = startPosition.z;

            // Box type condition
            let fenceGeometry = this.rowFenceGeometry(i);
            this.fenceGroup.add(this.buildFence(currPosition, fenceGeometry));
        }
    }

    /**
     * Given a start position, build a column of fences of various geometry
     * @param startPosition
     * @param hasGate : create a gate entrance if true
     */
    private buildColumnFence(startPosition: Vector3, hasGate: boolean) {
        for (let i = 0; i < defaultFenceOptions.column; i++) {
            // Calculation of centering and positioning
            let currPosition: Vector3 = new Vector3();
            currPosition.x = startPosition.x >= 0? 0.5 + startPosition.x : -(0.5 + -startPosition.x);
            currPosition.y = (0.5 + (i - 1) + startPosition.y);
            currPosition.z = startPosition.z;

            // Box type condition
            let fenceGeometry = this.columnFenceGeometry(i, hasGate);

            // Dont add a wedge if gate is present
            if (!(hasGate && (i === defaultFenceOptions.column/2 || i === defaultFenceOptions.column/2 - 1))) {
                this.fenceGroup.add(this.buildFence(currPosition, fenceGeometry));
            }
        }
    }
}

export default Fences;
