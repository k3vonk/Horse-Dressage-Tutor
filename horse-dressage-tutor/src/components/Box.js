import React from "react";

const Box = ({setRef, position}) => {
    return (
        <mesh ref={setRef} position={position}>
            <boxBufferGeometry attach="geometry" args={[1, 1, 1]}/>
            <meshLambertMaterial attach="material" color="brown" castShadow/>
        </mesh>
    )
};

export default Box;
