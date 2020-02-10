import React from 'react';
import Box from "./Box";

/**
 *
 * @param startFrom
 * @param size
 * @returns {unknown[]}
 * @constructor
 */
function ColumnFence({ position = {x: 16, y: 8, z: 0}, size = 18, hasGate = false}) {
        return new Array(size).fill().map((_, i) => {
                let x = position.x >= 0? 0.5 + position.x : -(0.5 + -position.x);
                let y = (0.5 + (i - 1) + position.y);
                let z = 0.5 + position.z;

                return hasGate && (i === size/2 || i === size/2 - 1)? null : <Box position={[x, y, z]} />;
        })
}

function RowFence({ position = {x: 1, y: 1, z: 0}, size = 32 }) {
        return new Array(size).fill().map((_, i) => {
                let x = -(0.5 + position.x) + (i - 1);
                let y = position.y >= 0? 0.5 + position.y : -(0.5 + -position.y);
                let z = 0.5 + position.z;

                return <Box position={[x, y, z]} />;
        })
}

const FenceLeft = (amount) => {

    return (
        <group>
                <ColumnFence position={{x: -16, y: -8, z:0}} /> {/*Left Fence*/}
                <ColumnFence position={{x: 16, y: -8, z:0}} hasGate={true} /> {/*Right Fence*/}
                <RowFence position={{x: 14, y: 8, z: 0}} /> {/* Top Fence */}
                <RowFence position={{x: 14, y: -8, z: 0}} /> {/* Bottom Fence */}
        </group>
    );
};

export default FenceLeft;
