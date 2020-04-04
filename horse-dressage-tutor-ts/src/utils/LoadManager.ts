import * as THREE from 'three';
import {Font} from "three";
import {GLTF, GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

class LoadManager {
    manager = new THREE.LoadingManager();
    font: Font = null;
    horseGLTF: GLTF = null;

    constructor() {
        // Setup manager
        this.manager.onStart = function(url, itemsLoaded, itemsTotal) {
            console.log('Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' +
            itemsTotal + ' files.');
        };

        this.manager.onProgress = function(url, itemsLoaded, itemsTotal) {
            console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
        };

        this.manager.onError = function ( url ) {
            console.log( 'There was an error loading ' + url );
        };

    }

    loadFont() {
        const loader = new THREE.FontLoader(this.manager);

        loader.load('/assets/bold.blob', (response) => {
            this.font = response;
        }, LoadManager.onProgress);
    }

    loadHorse() {
        const loader = new GLTFLoader(this.manager);
        loader.load('/assets/models/scene.gltf', (gltf) => {
            this.horseGLTF = gltf;
            console.log(this.dumpObject(gltf.scene).join('\n'));
        },  LoadManager.onProgress);
    }

    private static onProgress(xhr ) {
        if (xhr.lengthComputable ) {
            let percentComplete = xhr.loaded / xhr.total * 100;
            console.log( Math.round(percentComplete) + '% downloaded');
        }
    }

    // Read what is in the gltf file obtained from: https://threejsfundamentals.org/threejs/lessons/threejs-load-gltf.html
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
}

export default LoadManager;
