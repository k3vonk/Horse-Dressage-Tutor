import {
    CameraOptions,
    CenterLetters,
    ColorOptions,
    EdgeLetters,
    FenceOptions,
    GridOptions,
    LetterStyle
} from "./types";
import * as THREE from 'three';
import {Vector3} from "three";

export const defaultGridOptions: GridOptions = {
    width: 40,
    height: 40,
    axes: 3,
    segments: 0
};

export const defaultColors: ColorOptions = {
    groundColor: new THREE.Color(0xc2b280)
};

export const defaultCameraOptions: CameraOptions = {
    nearPlane: 0.1,
    farPlane: 1000,
    fieldOfView: 75,
    zDistance: 15
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

export const UP = new Vector3(0, 1, 0);
export const DOWN = new Vector3(0, -1, 0);
export const LEFT = new Vector3(-1, 0, 0);
export const RIGHT = new Vector3(1, 0, 0);

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
