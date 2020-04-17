import {
    CameraOptions,
    CenterLetters,
    ColorOptions,
    EdgeLetters,
    FenceOptions,
    GridOptions,
    LetterStyle, Step
} from "./types";
import * as THREE from 'three';
import {Vector3} from "three";

export const defaultGridOptions: GridOptions = {
    size: 40,
    divisions: 40,
    height: 40,
    zAxis: -20,
    axes: 3,
};

export const defaultColors: ColorOptions = {
    groundColor: new THREE.Color(0xc2b280)
};

export const defaultCameraOptions: CameraOptions = {
    nearPlane: 0.1,
    farPlane: 1000,
    fieldOfView: 75,
    zDistance: 20
};

export const defaultLetterStyles: LetterStyle = {
    xMargin: 4,
    yMargin: 2.5,
    geometrySize: 15,
    geometryHeight: 10,
    meshScale: 0.1,
    edgeLetterHeight: 0.07,
    centerLetterHeight: 0.001
};

export const defaultFenceOptions: FenceOptions = {
    row: 32,
    column: 18,
    topRow: new THREE.Vector3(14, 8, 0.3),
    bottomRow: new THREE.Vector3(14, -8, 0.3),
    leftColumn: new THREE.Vector3(-16, -8, 0.3),
    rightColumn: new THREE.Vector3(16, -8, 0.3),
    wedge: {
        width: 1,
        height:0.1,
        depth: 0.4
    },
    wedgeStand: {
        width: 1,
        height:0.5,
        depth: 1
    },
    box: {
        width: 1,
        height: 1,
        depth: 1
    }
};

export const MAX_Y_AXIS: number = 7;
export const MIN_Y_AXIS: number = -7;

export const START = new Vector3(17, 0, 0);
export const EDGE_LETTERS: EdgeLetters = {
    A: new Vector3(15, 0, 0),
    K: new Vector3(11.2, -7, 0),
    E: new Vector3(0, -7, 0),
    H: new Vector3(-11.2, -7, 0),
    C: new Vector3(-15, 0, 0),
    M: new Vector3(-11.2, 7, 0),
    B: new Vector3(0, 7, 0),
    F: new Vector3(11.2, 7, 0)
};

export const CENTER_LETTERS: CenterLetters = {
    D: new Vector3(11.2, 0, 0),
    X: new Vector3(0, 0, 0),
    G: new Vector3(-11.2, 0, 0)
};

export const LETTERS = {START, ...CENTER_LETTERS, ...EDGE_LETTERS};

export const FINAL_STEP: Step = {
    position:["START"],
    action: "Halt",
    gait: "",
    type: ""
};

export const ANIMATION = {
    "": 0,
    "Walk": 1,
    "Trot": 2,
    "Canter Right Lead": 3,
    "Canter Left Lead": 4
};

export const DURATIONS = {
    "change": 0.01,
    "": 0.5,
    "Walk": 4,
    "Trot": 5,
    "Canter Right Lead": 6,
    "Canter Left Lead": 6
};

export const TYPE = {
    "Free": 1.2,
    "Working": 1.2,
    "": 1,
    "Medium": 1,
    "Medium Strides": 0.8,
    "Extended": 0.8
};
