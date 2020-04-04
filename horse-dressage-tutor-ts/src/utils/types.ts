import * as THREE from 'three';

export interface GridOptions {
    width: number,
    height: number,
    axes: number,
    segments: number
}

export interface SceneSubject {
    update: (number) => void;
}

export interface ColorOptions {
    groundColor: THREE.Color
}

export interface CameraOptions {
    nearPlane: number,
    farPlane: number,
    fieldOfView: number,
    zDistance: number
}

export interface Start {
    startPosition: THREE.Vector3
}
export interface EdgeLetters {
    A: THREE.Vector3,
    K: THREE.Vector3,
    E: THREE.Vector3,
    H: THREE.Vector3,
    C: THREE.Vector3,
    M: THREE.Vector3,
    B: THREE.Vector3,
    F: THREE.Vector3
}

export interface CenterLetters {
    D: THREE.Vector3,
    X: THREE.Vector3,
    G: THREE.Vector3
}

export interface LetterStyle {
    xMargin: number,
    yMargin: number,
    geometrySize: number,
    geometryHeight: number,
    meshScale: number,
    edgeLetterHeight: number,
    centerLetterHeight: number
}

export interface FenceOptions {
    row: number,
    column: number,
    topRow: THREE.Vector3,
    bottomRow: THREE.Vector3,
    leftColumn: THREE.Vector3,
    rightColumn: THREE.Vector3,
    box: FenceStyle,
    wedgeStand: FenceStyle,
    wedge: FenceStyle
}

export interface FenceStyle {
    width: number,
    height: number,
    depth: number
}

// Model dressage test
export interface Step {
    position: string[],
    action: string,
    gait: string,
    type: string
}

export interface Steps extends Array<Step> {}

export interface SubTest {
    name: string,
    steps: Steps
}

export interface SubTests extends Array<SubTest> {}

export interface Test {
    index: number,
    subTests: SubTests
}

export interface Tests extends Array<Test> {}

export interface DressageTest {
    name: string,
    tests: Tests
}

export interface Point {
    x: number,
    y: number
}



