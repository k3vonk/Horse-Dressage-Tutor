import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import Helper from "./components/scene/Helper";
import Ground from "./components/scene/Ground";
import {defaultCameraOptions} from "./utils/Constants";
import Fences from "./components/scene/Fences";
import Lighting from "./components/scene/Lighting";


class SceneManager {
    private readonly canvas: HTMLCanvasElement;
    private readonly camera: THREE.PerspectiveCamera;
    private animationFrameID?: number;
    scene: THREE.Scene;
    renderer: THREE.Renderer;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.scene = this.buildScene();
        this.renderer = this.buildRender();
        this.camera = this.buildCamera();
        this.buildOrbitControls();
        this.animationFrameID = undefined;

        // Add Subjects to Scene
        this.scene.add(this.camera);
        this.createStaticSceneSubjects();

        // setup timeline
        //const animation = new DressageTimeline(this.horse.getHorse());
        //this.dressageTimeline = animation.getTimeline();
    }

    private buildScene(): THREE.Scene {
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

    private createStaticSceneSubjects() {
        new Helper(this.scene);
        new Ground(this.scene);
        new Lighting(this.scene);
        new Fences(this.scene);
    }

    render(): void {
        // Update subjects if necessary
        this.renderer.render(this.scene, this.camera);
        this.animationFrameID = requestAnimationFrame(this.render.bind(this)); // call back to get ID
    }

    onWindowResize(): void {
        const {width, height} = this.canvas;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(width, height); // adjust size of rendering screen
    }

}

export default SceneManager;
