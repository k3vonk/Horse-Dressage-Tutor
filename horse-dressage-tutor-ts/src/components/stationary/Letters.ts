import * as THREE from 'three';
import {Constants} from "../../utils/Constants";

export default class Letters {
    constructor(scene: THREE.Scene) {
        this.createEdgeLetters(scene);
        this.createCenterLetters(scene);
    }

    createEdgeLetters(scene: THREE.Scene) {
        for(let [key, value] of Object.entries(Constants.EDGE_LETTERS)) {
            let pos = value;

            switch(key) {
                case "A":
                    pos[0] += 4;
                    break;
                case "K":
                case "E":
                case "H":
                    pos[1] -= 3;
                    break;
                case "C":
                    pos[0] -= 4;
                    break;
                case "M":
                case "B":
                case "F":
                    pos[1] += 3;
                    break;
                default:
                    break;
            }

            this.createText(key, 1, 1, scene, pos);
        }
    }

    createCenterLetters(scene: THREE.Scene) {
        for(let [key, value] of Object.entries(Constants.CENTER_LETTERS)) {
            this.createText(key, 1, 0.1, scene, value);
        }
    }

    createText(letter: string, scaleSize: number, height: number, scene: THREE.Scene, pos: number[]) {
        const loader = new THREE.FontLoader();

        // Create font with text
        loader.load('bold.blob', function(response) {

            // Setup font geometry
            const textGeo = new THREE.TextGeometry( letter, {
                font: response,
                size: 15,
                height: 10,
            });

            const mesh = new THREE.Mesh(textGeo, new THREE.MeshNormalMaterial());

            // center letters based on their current geometry
            let size = new THREE.Vector3();
            mesh.geometry.computeBoundingBox();
            mesh.geometry.boundingBox.getSize(size);
            mesh.position.x = -size.x /2;
            mesh.position.y = -size.y/2;

            // reposition based on set lines
            const group = new THREE.Group();
            group.add(mesh);
            group.scale.set(0.1 * scaleSize, 0.1 * scaleSize, 0.1 * height);
            group.position.set(pos[0], pos[1], pos[2]);

            scene.add(group);
        });
    }
}
