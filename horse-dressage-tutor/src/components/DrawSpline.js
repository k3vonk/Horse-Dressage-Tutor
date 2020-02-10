import * as THREE from "three";
import React from "react";

export default function drawSpline() {
    // Create Spline points
    const points = [
        new THREE.Vector3( 15, 0, 0.5), //Start
        new THREE.Vector3( 15, -5, 0.5), //Bottom Right
        new THREE.Vector3( 13, -7, 0.5),
        new THREE.Vector3( -13, -7, 0.5), //Bottom Left
    ];

    // Create Spline
    const spline = new THREE.CatmullRomCurve3( points, true, "catmullrom");


    return (
        <line>
            <geometry attach="geometry" vertices={spline.getSpacedPoints(100)} />
            <lineBasicMaterial attach="material" color={0xff0000} />
        </line>
    );
}
