import * as THREE from 'three';
import Helper from "../components/stationary/Helper";
import Ground from "../components/stationary/Ground";

interface ScreenDimension {
    width: number,
    height: number
}

export default class SceneManager  {
    private canvas: HTMLCanvasElement;
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private screenDimension: ScreenDimension;
    private animationFrameId: number;
    renderer: THREE.Renderer;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.screenDimension = { width: canvas.width, height: canvas.height };
        this.scene = this.buildScene();
        this.renderer = this.buildRender(canvas);
        this.camera = this.buildCamera(this.screenDimension);
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
        camera.rotation.x = 30*Math.PI/180;
        camera.rotation.y = 0;
        camera.rotation.z = 0;

        const initialCameraPositionY = -Math.tan(camera.rotation.x)*zDistance;
        const initialCameraPositionX = Math.tan(camera.rotation.y)*Math.sqrt(zDistance**2 + initialCameraPositionY**2);

        // Camera position
        camera.position.y = initialCameraPositionY;
        camera.position.x = initialCameraPositionX;
        camera.position.z = zDistance;

        return camera;
    }

    createSceneSubjects(scene: THREE.Scene) {
        // array of sceneSubjects adding new subjects here
    }

    createStationarySceneSubjects(scene: THREE.Scene) {
        new Helper({size: 40, divisions: 40}, scene);
        new Ground( {width: 40, height: 40, segments: 0}, scene);
        const geometry: THREE.BoxGeometry = new THREE.BoxGeometry(1, 1, 1);
        const material: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00, wireframe: true });

        const cube: THREE.Mesh = new THREE.Mesh(geometry, material);

        this.scene.add(  cube );
    }

    animate(): void {
        this.render();
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
