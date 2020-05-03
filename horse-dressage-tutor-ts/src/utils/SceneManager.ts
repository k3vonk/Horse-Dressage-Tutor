/**
 * SceneManager class : manages all the scene components, camera, and renderer
 *
 * @author: Ga Jun Young, 16440714
 */
import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import Helper from "../components/Helper";
import Ground from "../components/Ground";
import {ADJUST_Z_DISTANCE, BIG_DEVICE_RATIO, defaultCameraOptions, SCREEN_DECREASE_RATIO} from "./defined/Constants";
import Fences from "../components/Fences";
import Lighting from "../components/Lighting";
import {Font} from "three";
import Letters from "../components/Letters";
import {GLTF} from "three/examples/jsm/loaders/GLTFLoader";
import HorseManager from "../components/HorseManager";

class SceneManager {
    private readonly canvas: HTMLCanvasElement;
    private readonly camera: THREE.PerspectiveCamera;
    private readonly orbitControls: OrbitControls;
    private animationSpeed = 0.005;
    private isViewingScene = true;
    private prevTime = Date.now();

    scene: THREE.Scene;
    renderer: THREE.Renderer;
    horseManager: HorseManager;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.scene = SceneManager.buildScene();
        this.renderer = this.buildRender();
        this.camera = this.buildCamera();
        this.orbitControls = this.buildOrbitControls();

        // Add Subjects to Scene
        this.scene.add(this.camera);
        this.createStaticSceneSubjects();

        // bind this
        this.animate = this.animate.bind(this);
    }

    /**
     * Build scene, the container for other 3D objects
     */
    private static buildScene(): THREE.Scene {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color("#323232");
        return scene;
    }

    /**
     * Build renderer to render the scene components
     */
    private buildRender(): THREE.Renderer {
        const renderer = new THREE.WebGLRenderer({canvas: this.canvas, antialias: true, alpha: true});
        const DPR = window.devicePixelRatio ? window.devicePixelRatio: 1;
        renderer.setSize(this.canvas.width, this.canvas.height);
        renderer.setPixelRatio(DPR);
        return renderer;
    }

    /**
     * Build camera, the perspective that users see from
     */
    private buildCamera(): THREE.PerspectiveCamera {
        const aspectRatio = this.canvas.width / this.canvas.height;
        const fieldOfView = defaultCameraOptions.fieldOfView;
        const nearPlane = defaultCameraOptions.nearPlane;
        const farPlane = defaultCameraOptions.farPlane;
        let zDistance = defaultCameraOptions.zDistance;
        zDistance = SceneManager.zDistanceIncrease(zDistance);

        const camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);

        // Starting rotation at 30 degrees
        camera.rotation.set(20 * Math.PI/180, 0, 0 );

        // camera starting position
        const initialCameraPositionY = -Math.tan(camera.rotation.x)*zDistance;
        const initialCameraPositionX = Math.tan(camera.rotation.y)*Math.sqrt(zDistance**2 + initialCameraPositionY**2);
        camera.position.set(initialCameraPositionX, initialCameraPositionY, zDistance);
        camera.up.set( 0, 0, 1 );
        camera.lookAt(this.scene.position);
        return camera;
    }

    /**
     * Adjust the starting zDistance based on the screen ratio size at the start
     * @param zDistance
     */
    private static zDistanceIncrease(zDistance: number) {
        let screenDecreaseRatio = 1 - (window.innerWidth * window.innerHeight) / (1536 * 754);

        if (window.devicePixelRatio < BIG_DEVICE_RATIO) { // bigger devices
            if (screenDecreaseRatio > SCREEN_DECREASE_RATIO.LARGE) {
                zDistance += (screenDecreaseRatio * ADJUST_Z_DISTANCE.MEDIUM);
            } else if (screenDecreaseRatio > SCREEN_DECREASE_RATIO.MEDIUM) {
                zDistance += (screenDecreaseRatio * ADJUST_Z_DISTANCE.SMALL);
            } else if (screenDecreaseRatio > SCREEN_DECREASE_RATIO.SMALL) {
                zDistance += (screenDecreaseRatio * ADJUST_Z_DISTANCE.MEDIUM);
            } else if (screenDecreaseRatio < SCREEN_DECREASE_RATIO.SMALL) {
                zDistance += -(screenDecreaseRatio * ADJUST_Z_DISTANCE.LARGE);
            }
        } else { // smaller devices
            zDistance += (screenDecreaseRatio * ADJUST_Z_DISTANCE.LARGE);
        }

        return zDistance;
    }

    /**
     * Build the scene controller.
     * Capable of : Rotation, Zooming
     */
    private buildOrbitControls(): OrbitControls {
        const orbitControls = new OrbitControls(this.camera, this.renderer.domElement);

        // rotation min - max
        orbitControls.maxPolarAngle = Math.PI/180 * 85; // max 85 degree
        orbitControls.minPolarAngle = Math.PI/180; // min 20 degree

        // zoom min - max
        orbitControls.minDistance = 10;
        orbitControls.maxDistance = 52;

        return orbitControls;
    }

    /**
     * Scene subjects that does not need to be updated besides being visible on the view
     */
    private createStaticSceneSubjects() {
        new Helper(this.scene);
        new Ground(this.scene);
        new Lighting(this.scene);
        new Fences(this.scene);
    }

    /**
     * camera view is adjusted to view the horse or the scene's origin
     */
    private cameraView() {

        if(this.isViewingScene) {
            this.orbitControls.enabled = true;
            this.camera.lookAt(this.scene.position);
        } else {
            this.orbitControls.enabled = false; // disable controls because camera is constantly being adjusted therefore, conflicts occur

            // get the horse view and set its matrix position
            const horseView = this.horseManager.horseView;
            const relativeCameraOffset = new THREE.Vector3();
            relativeCameraOffset.setFromMatrixPosition(horseView.matrixWorld);

            // lerp to the camera offset while looking at the horse
            this.camera.position.lerp(relativeCameraOffset, 0.2);
            this.camera.lookAt(this.horseManager.horse.position);
        }
    }

    /**
     * render the canvas with its scenery
     */
    private render() {

        this.orbitControls.update();
        this.cameraView();

        if(this.horseManager) {
            const time = Date.now();
            this.horseManager.mixer.update(( time - this.prevTime ) * this.animationSpeed);
            this.prevTime = time;
        }

        this.renderer.render(this.scene, this.camera);
    }

    /**
     * Animation frame
     */
    animate(): void {
        // Render & Update subjects if necessary
        requestAnimationFrame( this.animate ); // call back to get ID
        this.render();
    }


    /**
     * Callback event that changes the camera view and the size of the renderer
     * when the canvas changes
     */
    onWindowResize(): void {
        const {width, height} = this.canvas;
        this.resetCameraOrientation();
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height); // adjust size of rendering screen
    }

    /**
     * Add letters relevant to a novice horse dressage arena
     * @param font
     */
    addLetters(font: Font) {
        new Letters(this.scene, font);
    }

    /**
     * Instantiate the horse manager class and add the horse component to the scene
     * @param horseGLTF
     */
    addHorse(horseGLTF: GLTF): HorseManager {
        this.horseManager = new HorseManager(this.scene, horseGLTF);
        return this.horseManager;
    }

    /**
     * reset the perspective to the scene's origin
     * also reset the orbit controls.
     */
    resetCameraOrientation() {
        this.isViewingScene = true;
        this.orbitControls.reset();
    }

    /**
     * toggle between perspectives
     */
    togglePerspective() {
        this.isViewingScene = !this.isViewingScene;

        if(this.isViewingScene)
            this.resetCameraOrientation();
    }
    
}

export default SceneManager;
