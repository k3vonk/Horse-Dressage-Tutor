import React, {useEffect, useState} from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const Horse = () => {
    const [model, setModel] = useState();

    // Load the horse model after render and only load once
    useEffect(() => {
        new GLTFLoader().load('/assets/models/scene.gltf', setModel);
    }, []);

    console.log(model);

    return (
        model ? <primitive object={model.scene} rotation={[Math.PI/2,0,0]}/> : null
    )
};

export default Horse;
