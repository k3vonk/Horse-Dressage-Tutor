import React from "react";
import {useThree} from "react-three-fiber";

/*
 * A component that creates a camera with a top-down view angle
 */
const Camera = () => {
    // Configure for an isometric view
    const { camera } = useThree();
    const zDistance = 15; //was 10

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

    return (
        <>
            <orthographicCamera />
            <ambientLight intensity={0.25}/>
            <spotLight position={[-15, -20, 30]} penumbra={1} rotation={[Math.PI/2, 0, 0]} castShadow/>
        </>
    );
};

export default Camera;
