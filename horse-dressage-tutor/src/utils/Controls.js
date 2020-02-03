import React, { useRef } from "react";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { extend, useThree, useFrame } from "react-three-fiber";

extend({ OrbitControls });

const Controls = () => {
    const { camera, gl } = useThree();
    const orbitRef = useRef();

    useFrame(() => {
        orbitRef.current.update()
    });

    return (
      <orbitControls
            autoRotate
            args={[camera, gl.domElement]}
            ref={orbitRef}
            maxPolarAngle={Math.PI / 3}
            minPolarAngle={Math.PI / 3}
      />
    );
};

export default Controls;
