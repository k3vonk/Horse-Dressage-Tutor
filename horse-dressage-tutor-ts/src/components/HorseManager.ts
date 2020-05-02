/**
 * HorseManager class : grab the horse from the scene file and add it to ThreeJS scene and extract its animations
 *
 * @author: Ga Jun Young, 16440714
 */
import * as THREE from 'three';
import {GLTF} from "three/examples/jsm/loaders/GLTFLoader";
import {AnimationAction, AnimationMixer, Object3D} from "three";
import {ANIMATION, START, TYPE} from "../utils/Constants";
import {CubicBezierCurve3} from "three";

class HorseManager {

    horse: Object3D;
    mixer: AnimationMixer;
    horseView: Object3D;
    private horseGLTF: GLTF;

    private idleAction: AnimationAction;
    private walkAction: AnimationAction;
    private trotAction: AnimationAction;
    private leftLeadAction: AnimationAction;
    private rightLeadAction: AnimationAction;
    private actions: AnimationAction[];

    constructor(scene: THREE.Scene, horseGLTF: GLTF) {
        this.horseGLTF = horseGLTF;

        // Adjust imported horses position, rotation, scale, and orientation rule
        const horse = horseGLTF.scene;
        horse.position.set(0,0,0);
        horse.scale.set(80, 80, 80);
        horse.rotation.set(Math.PI/2 , Math.PI, 0);
        horse.up.set(0, 0, 0);

        // Adjust the emissive intensity of all child meshes such that it is visible on ThreeJS
        horse.traverse((child) => {
            if( child instanceof THREE.Mesh) {
                child.material['emissiveIntensity'] = 0;
            }
        });

        // Maya/Blender has a coordinate system where Y is Up, ThreeJS Z is Up
        // Therefore, we place the gltf object into a group and use the group for the tweening
        const group = new THREE.Group();
        group.add(horse);
        group.position.set(START.x, START.y, START.z);

        // set up the position at where the camera would stare at the horse
        this.horseView = new THREE.Object3D();
        this.horseView.position.set(0, 15, 15);
        group.add(this.horseView);

        // add to the scene
        this.horse = group;
        scene.add(group);

        // extract the animation clips from the horse
        this.mixer = new THREE.AnimationMixer(horse);
        this.setupActions();
        this.activateAllActions();
    }

    private setupActions() {
        this.idleAction = this.mixer.clipAction(this.horseGLTF.animations[ANIMATION[""]]);
        this.walkAction = this.mixer.clipAction(this.horseGLTF.animations[ANIMATION['Walk']]);
        this.trotAction = this.mixer.clipAction(this.horseGLTF.animations[ANIMATION['Trot']]);
        this.rightLeadAction = this.mixer.clipAction(this.horseGLTF.animations[ANIMATION['Canter Right Lead']]);
        this.leftLeadAction = this.mixer.clipAction(this.horseGLTF.animations[ANIMATION['Canter Left Lead']]);

        this.actions = [this.idleAction, this.walkAction, this.trotAction, this.rightLeadAction, this.leftLeadAction];
    }

    /**
     * Update action's weight corresponding to the index
     * @param actionIndex
     */
    private updateWeights(actionIndex: number) {
        this.actions.forEach(  ( action, index) => {
            if(actionIndex === index) {
                this.setWeight(action,  1);
            } else {
                this.setWeight(action, 0);
            }

        } );
    }

    /**
     * Set the weight of an action.
     * @param action
     * @param weight : 1 == active, 0 == deactivate
     */
    private setWeight( action, weight ) {
        action.enabled = true;
        action.setEffectiveTimeScale( 1 );
        action.setEffectiveWeight( weight );
    }

    /**
     * Setup the starting action
     */
    private activateAllActions() {

        this.setWeight( this.idleAction, 1 );
        this.setWeight( this.walkAction, 0 );
        this.setWeight( this.trotAction, 0 );
        this.setWeight( this.rightLeadAction, 0 );
        this.setWeight( this.leftLeadAction, 0 );

        this.actions.forEach( function ( action ) {

            action.play();

        } );
    }

    /**
     * Update the horse's Z-axis rotation based on the current time on the bezier curve
     * @param cubicBezierCurve : curve that the horse moves along
     * @param tick : horse's current position (in ticks) on the curve
     * @param directionAngle : direction the horse faces if above or below curve
     */
    updateZRotation(cubicBezierCurve: CubicBezierCurve3, tick: number, directionAngle: number) {
        let tangent = cubicBezierCurve.getTangent(tick).normalize();
        let angle = -Math.atan(tangent.x / tangent.y);
        this.horse.rotation.z = angle + directionAngle;
    }

    /**
     * Set the animation of the horse
     * @param animation
     * @param type : style of the gait e.g. Medium, Working, Free
     */
    setAnimationClip(animation: string, type: string) {
        this.mixer.timeScale = TYPE[type];
        this.updateWeights(ANIMATION[animation]);
    }

    /**
     * Pauses the mixer
     */
    pauseMixer() {
        this.mixer.timeScale = 0;
    }

    resetHorsePosition() {
        this.activateAllActions();
        this.horse.position.set(START.x, START.y, START.z);
    }

}

export default HorseManager;
