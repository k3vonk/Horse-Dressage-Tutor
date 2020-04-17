/**
 * Letters class : construct letters present on the arena for reference
 *
 * @author: Ga Jun Young, 16440714
 */

import * as THREE from 'three';
import {CENTER_LETTERS, defaultLetterStyles, EDGE_LETTERS} from "../utils/Constants";
import {Font, Vector3} from "three";

class Letters {
    private readonly font: Font;
    private readonly scene: THREE.Scene;

    constructor(scene: THREE.Scene, font: Font) {
        this.font = font;
        this.scene = scene;
        this.createEdgeLetters();
        this.createCenterLetters();
    }

    /**
     * Create the edge letters by reconfiguring their physical position on the scene
     */
    private createEdgeLetters() {
        for(let [key, value] of Object.entries(EDGE_LETTERS)) {
            let position = new THREE.Vector3(value.x, value.y, value.z);

            switch(key) {
                case "A":
                    position.x += defaultLetterStyles.xMargin;
                    break;
                case "K":
                case "E":
                case "H":
                    position.y -= defaultLetterStyles.yMargin;
                    break;
                case "C":
                    position.x -= defaultLetterStyles.xMargin;
                    break;
                case "M":
                case "B":
                case "F":
                    position.y += defaultLetterStyles.yMargin;
                    break;
                default:
                    break;
            }

            this.createText(key, defaultLetterStyles.edgeLetterHeight, position);
        }
    }

    /**
     * Create the center letters on the scene
     */
    private createCenterLetters() {
        for (let [key, value] of Object.entries(CENTER_LETTERS)) {
            this.createText(key, defaultLetterStyles.centerLetterHeight, value);
        }
    }

    /**
     * Given the font style, construct the text letter given position and height
     * @param letter
     * @param height : height of the letter being added to the scene
     * @param position : location of the letter on the scene
     */
    private createText(letter: string, height: number, position: Vector3) {
        // Setup font geometry
        const textGeo = new THREE.TextGeometry( letter, {
            font: this.font,
            size: defaultLetterStyles.geometrySize,
            height: defaultLetterStyles.geometryHeight,
        });

        let meshMaterial;
        if (letter === 'G' || letter === 'X' || letter === 'D') {
            meshMaterial = new THREE.MeshToonMaterial({color: 0x000000});
        } else {
            meshMaterial = new THREE.MeshNormalMaterial();
        }

        const textMesh = new THREE.Mesh(textGeo, meshMaterial);

        // center letters based on their current geometry
        let size = new THREE.Vector3();
        textMesh.geometry.computeBoundingBox();
        textMesh.geometry.boundingBox.getSize(size);
        textMesh.position.x = -size.x / 2;
        textMesh.position.y = -size.y / 2;

        // reposition based on position
        const centeringGroup = new THREE.Group();
        centeringGroup.add(textMesh);
        centeringGroup.scale.set(defaultLetterStyles.meshScale, defaultLetterStyles.meshScale, height );
        centeringGroup.position.set(position.x, position.y, position.z);

        this.scene.add(centeringGroup);
    }
}

export default Letters;
