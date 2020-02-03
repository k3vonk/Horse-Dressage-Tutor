import React from "react";

/**
 * A component that provides a plane and grid lines for reference
 * @returns {placeGeometry, gridHelper}
 */
const HelperPlane = () => {
    return(
        <mesh>
            <planeGeometry attach="geometry" args={[40, 40, 0]} />
            <meshBasicMaterial attach="material" color={0x335d30} />
            <gridHelper args={[40,40]} rotation={[Math.PI/2, 0, 0]}/>
        </mesh>
    )
};

export default HelperPlane;
