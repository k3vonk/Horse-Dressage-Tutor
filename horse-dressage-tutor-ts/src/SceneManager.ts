import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import Helper from "./components/stationary/Helper";
import Ground from "./components/stationary/Ground";
import {defaultCameraOptions} from "./utils/Constants";
import {GLTF} from "three/examples/jsm/loaders/GLTFLoader";
import {Font} from "three";
import Letters from "./components/stationary/Letters";
import Fences from "./components/stationary/Fences";
import Lighting from "./components/stationary/Lighting";
import Horse from "./components/Horse";
import DressageTimeline from "./utils/DressageTimeline";

class SceneManager {
    private readonly canvas: HTMLCanvasElement;
    private readonly scene: THREE.Scene;
    private readonly camera: THREE.PerspectiveCamera;
    private readonly horse: Horse;
    private animationFrameID?: number;
    renderer: THREE.Renderer;

    constructor(canvas: HTMLCanvasElement, horseGTLF: GLTF, font: Font) {
        this.canvas = canvas;
        this.scene = this.buildScene();
        this.renderer = this.buildRender();
        this.camera = this.buildCamera();
        this.buildOrbitControls();
        this.animationFrameID = undefined;

        // Add Subjects to Scene
        this.horse = new Horse(this.scene, horseGTLF);
        this.scene.add(this.camera);
        this.createStaticSceneSubjects(font);
        new DressageTimeline(this.horse.getHorse());
    }

    buildScene(): THREE.Scene {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color("#FFF");
        return scene;
    }

    private buildRender(): THREE.Renderer {
        const renderer = new THREE.WebGLRenderer({canvas: this.canvas, antialias: true, alpha: true});
        const DPR = window.devicePixelRatio ? window.devicePixelRatio: 1;
        renderer.setSize(this.canvas.width, this.canvas.height);
        renderer.setPixelRatio(DPR);
        return renderer;
    }

    private buildCamera(): THREE.PerspectiveCamera {
        const aspectRatio = this.canvas.width / this.canvas.height;
        const fieldOfView = defaultCameraOptions.fieldOfView;
        const nearPlane = defaultCameraOptions.nearPlane;
        const farPlane = defaultCameraOptions.farPlane;
        const zDistance = defaultCameraOptions.zDistance;
        const camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);

        // Starting rotation at 30 degrees
        camera.rotation.set(30 * Math.PI/180, 0, 0 );

        // camera starting position
        const initialCameraPositionY = -Math.tan(camera.rotation.x)*zDistance;
        const initialCameraPositionX = Math.tan(camera.rotation.y)*Math.sqrt(zDistance**2 + initialCameraPositionY**2);
        camera.position.set(initialCameraPositionX, initialCameraPositionY, zDistance);

        return camera;
    }

    private buildOrbitControls() {
        const orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
        orbitControls.update();
    }

    private createStaticSceneSubjects(font: Font) {
        new Helper(this.scene);
        new Ground(this.scene);
        new Lighting(this.scene);
        new Letters(this.scene, font);
        new Fences(this.scene);
    }

    render(): void {
        // Update subjects if necessary
        this.renderer.render(this.scene, this.camera);
        this.animationFrameID = requestAnimationFrame(this.render.bind(this)); // call back to get ID
        //console.log(this.animationFrameID);
    }

    onWindowResize(): void {
        const {width, height} = this.canvas;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(width, height); // adjust size of rendering screen
    }

}

export default SceneManager;
