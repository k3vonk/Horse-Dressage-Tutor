import * as THREE from 'three';
import {CENTER_LETTERS, defaultLetterStyles, EDGE_LETTERS} from "../../utils/Constants";
import {Font, Vector3} from "three";

class Letters {
    private readonly font: Font;

    constructor(scene: THREE.Scene, font: Font) {
        this.font = font;
        this.createEdgeLetters(scene);
        this.createCenterLetters(scene);
    }

    private createEdgeLetters(scene: THREE.Scene) {
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

            this.createText(key, defaultLetterStyles.edgeLetterHeight, position, scene);
        }
    }

    private createCenterLetters(scene: THREE.Scene) {
        for (let [key, value] of Object.entries(CENTER_LETTERS)) {
            this.createText(key, defaultLetterStyles.centerLetterHeight, value, scene);
        }
    }

    private createText(letter: string, height: number, position: Vector3, scene: THREE.Scene) {
        // Setup font geometry
        const textGeo = new THREE.TextGeometry( letter, {
            font: this.font,
            size: defaultLetterStyles.geometrySize,
            height: defaultLetterStyles.geometryHeight,
        });

        const mesh = new THREE.Mesh(textGeo, new THREE.MeshNormalMaterial());

        // center letters based on their current geometry
        let size = new THREE.Vector3();
        mesh.geometry.computeBoundingBox();
        mesh.geometry.boundingBox.getSize(size);
        mesh.position.x = -size.x / 2;
        mesh.position.y = -size.y / 2;

        // reposition based on position
        const group = new THREE.Group();
        group.add(mesh);
        group.scale.set(defaultLetterStyles.meshScale, defaultLetterStyles.meshScale, height );
        group.position.set(position.x, position.y, position.z);

        scene.add(group);
    }
}

export default Letters;
