import * as THREE from 'three';
import Helper from "../components/stationary/Helper";
import Ground from "../components/stationary/Ground";
import Fences from "../components/stationary/Fences";
import Letters from "../components/stationary/Letters";
import Horse from "../components/Horse";
import Lighting from "../components/stationary/Lighting";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import DressageTimeline from "../utils/DressageTimeline";

interface ScreenDimension {
    width: number,
    height: number
}

export default class SceneManager  {
    private canvas: HTMLCanvasElement;
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private orbitControls: OrbitControls;
    private screenDimension: ScreenDimension;
    private animationFrameId: number;
    private horseScene: Horse;
    renderer: THREE.Renderer;

    private hasTimeline = false;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.screenDimension = { width: canvas.width, height: canvas.height };
        this.scene = this.buildScene();
        this.renderer = this.buildRender(canvas);
        this.camera = this.buildCamera(this.screenDimension);
        this.orbitControls = this.buildOrbitControls(this.camera, this.renderer);
        this.scene.add(this.camera);
        this.animationFrameId = undefined;

        this.createStationarySceneSubjects(this.scene);
    }

    buildScene(): THREE.Scene {
        const scene: THREE.Scene = new THREE.Scene();

        // May change scene attributes
        return scene;
    }

    buildRender(canvas: HTMLCanvasElement): THREE.Renderer {
        const renderer: THREE.Renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true, alpha: true });
        renderer.setSize(canvas.width, canvas.height);
        return renderer;
    }

    buildCamera(screenDimension: ScreenDimension): THREE.PerspectiveCamera {
        const aspectRatio = screenDimension.width / screenDimension.height;
        const fieldOfView = 75;
        const nearPlane = 0.1;
        const farPlane = 1000;
        const zDistance = 15;
        const camera = new THREE.PerspectiveCamera( fieldOfView, aspectRatio, nearPlane, farPlane);

        // Rotation at which we stare at (in degrees)
        camera.rotation.set(30*Math.PI/180, 0, 0);

        const initialCameraPositionY = -Math.tan(camera.rotation.x)*zDistance;
        const initialCameraPositionX = Math.tan(camera.rotation.y)*Math.sqrt(zDistance**2 + initialCameraPositionY**2);

        // Camera position
        camera.position.set(initialCameraPositionX, initialCameraPositionY, zDistance);

        return camera;
    }

    buildOrbitControls(camera: THREE.Camera, render: THREE.Renderer): OrbitControls{
        const orbitControls = new OrbitControls(camera, render.domElement);
        // TODO: restrain angle movements
        orbitControls.update();
        return orbitControls;
    }

    createSceneSubjects(scene: THREE.Scene) {
        // array of sceneSubjects adding new subjects here
    }

    createStationarySceneSubjects(scene: THREE.Scene) {
        new Helper({size: 40, divisions: 40}, scene);
        new Lighting(scene);
        new Ground( {width: 40, height: 40, segments: 0}, scene);
        new Fences(scene);
        new Letters(scene);
        this.horseScene = new Horse(scene);
    }

    animate(): void {
        this.render();

        if(this.horseScene.getHorse() && !this.hasTimeline) {
           let dressageTimeline = new DressageTimeline(this.horseScene.getHorse());
           this.hasTimeline = true;
        }
        this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
    }

    render(): void {
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize(): void {
        this.screenDimension.width = this.canvas.width;
        this.screenDimension.height = this.canvas.height;

        this.camera.aspect = this.screenDimension.width / this.screenDimension.height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(this.screenDimension.width, this.screenDimension.height);
    }

}
