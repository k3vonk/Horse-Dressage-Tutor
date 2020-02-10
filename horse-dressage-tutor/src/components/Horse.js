import React, {useEffect, useState, useRef} from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useFrame } from 'react-three-fiber';
import * as THREE from 'three';

const Horse = () => {
    const horseMesh = useRef();
    const [model, setModel] = useState();

    // Load the horse model after render and only load once
    useEffect(() => {
        new GLTFLoader().load('/assets/models/scene.gltf', setModel);
    }, []);

    // Create Spline points
    const points = [
        new THREE.Vector3( 15, 0, 0.5), //Start
        new THREE.Vector3( 15, -5, 0.5), //Bottom Right
        new THREE.Vector3( 13, -7, 0.5),
        new THREE.Vector3( -13, -7, 0.5), //Bottom Left
    ];

    // Create Spline
    const spline = new THREE.CatmullRomCurve3( points, false, "catmullrom");
    // Define the car position on the spline
    let horsePositionOnSpline = 0;
    useFrame(() => {
        if(model)
        {
            if(horsePositionOnSpline < 1){
                let newPosition = spline.getPointAt( horsePositionOnSpline );
                horseMesh.current.position.x = newPosition.x ;
                horseMesh.current.position.y = newPosition.y ;
                horsePositionOnSpline += 0.005;
            }else{
                horsePositionOnSpline = 0;
            }



        }
    });

    console.log(model);

    return (
       model ? <primitive ref={horseMesh} object={model.scene} rotation={[Math.PI/2,0,0]}/> : null
    )
};

export default Horse;
