import React from 'react';
import Box from "./Box";

/**
 *
 * @param startFrom
 * @param size
 * @returns {unknown[]}
 * @constructor
 */
function LeftFences({ startFrom = 16, size = 18}) {
        return new Array(size).fill().map((_, i) => {
                let x = -(0.5 + startFrom);
                let y = 0.5 + i;
                const z = 0.5;

                if (i >= size / 2) {
                       y = -y + i;
                }
                return <Box position={[x, y, z]} />
        })
}

const FenceLeft = (amount) => {

    return (
        <group>
            {/*Left - Top*/}
            <Box position={[-(0.5 + (16)), 0.5 + (0),0.5]} />
            <Box position={[-(0.5 + (16)), 0.5 + (1),0.5]} />
            <Box position={[-(0.5 + (16)), 0.5 + (2),0.5]} />
            <Box position={[-(0.5 + (16)), 0.5 + (3),0.5]} />
            <Box position={[-(0.5 + (16)), 0.5 + (4),0.5]} />
            <Box position={[-(0.5 + (16)), 0.5 + (5),0.5]} />
            <Box position={[-(0.5 + (16)), 0.5 + (6),0.5]} />
            <Box position={[-(0.5 + (16)), 0.5 + (7),0.5]} />
            <Box position={[-(0.5 + (16)), 0.5 + (8),0.5]} /> {/*Corner top left*/}

            {/*Left - Bottom*/}
            <Box position={[-(0.5 + (16)), -(0.5 + (0)),0.5]} />
            <Box position={[-(0.5 + (16)), -(0.5 + (1)),0.5]} />
            <Box position={[-(0.5 + (16)), -(0.5 + (2)),0.5]} />
            <Box position={[-(0.5 + (16)), -(0.5 + (3)),0.5]} />
            <Box position={[-(0.5 + (16)), -(0.5 + (4)),0.5]} />
            <Box position={[-(0.5 + (16)), -(0.5 + (5)),0.5]} />
            <Box position={[-(0.5 + (16)), -(0.5 + (6)),0.5]} />
            <Box position={[-(0.5 + (16)), -(0.5 + (7)),0.5]} />
            <Box position={[-(0.5 + (16)), -(0.5 + (8)),0.5]} /> {/*Corner bottom left}

            {/* Up - Left */}
            <Box position={[-(0.5 + (0)), 0.5 + (8),0.5]} />
            <Box position={[-(0.5 + (1)), 0.5 + (8),0.5]} />
            <Box position={[-(0.5 + (2)), 0.5 + (8),0.5]} />
            <Box position={[-(0.5 + (3)), 0.5 + (8),0.5]} />
            <Box position={[-(0.5 + (4)), 0.5 + (8),0.5]} />
            <Box position={[-(0.5 + (5)), 0.5 + (8),0.5]} />
            <Box position={[-(0.5 + (6)), 0.5 + (8),0.5]} />
            <Box position={[-(0.5 + (7)), 0.5 + (8),0.5]} />
            <Box position={[-(0.5 + (8)), 0.5 + (8),0.5]} />
            <Box position={[-(0.5 + (9)), 0.5 + (8),0.5]} />
            <Box position={[-(0.5 + (10)), 0.5 + (8),0.5]} />
            <Box position={[-(0.5 + (11)), 0.5 + (8),0.5]} />
            <Box position={[-(0.5 + (12)), 0.5 + (8),0.5]} />
            <Box position={[-(0.5 + (13)), 0.5 + (8),0.5]} />
            <Box position={[-(0.5 + (14)), 0.5 + (8),0.5]} />
            <Box position={[-(0.5 + (15)), 0.5 + (8),0.5]} />

            {/* Up - right */ }
            <Box position={[(0.5 + (0)), 0.5 + (8),0.5]} />
            <Box position={[(0.5 + (1)), 0.5 + (8),0.5]} />
            <Box position={[(0.5 + (2)), 0.5 + (8),0.5]} />
            <Box position={[(0.5 + (3)), 0.5 + (8),0.5]} />
            <Box position={[(0.5 + (4)), 0.5 + (8),0.5]} />
            <Box position={[(0.5 + (5)), 0.5 + (8),0.5]} />
            <Box position={[(0.5 + (6)), 0.5 + (8),0.5]} />
            <Box position={[(0.5 + (7)), 0.5 + (8),0.5]} />
            <Box position={[(0.5 + (8)), 0.5 + (8),0.5]} />
            <Box position={[(0.5 + (9)), 0.5 + (8),0.5]} />
            <Box position={[(0.5 + (10)), 0.5 + (8),0.5]} />
            <Box position={[(0.5 + (11)), 0.5 + (8),0.5]} />
            <Box position={[(0.5 + (12)), 0.5 + (8),0.5]} />
            <Box position={[(0.5 + (13)), 0.5 + (8),0.5]} />
            <Box position={[(0.5 + (14)), 0.5 + (8),0.5]} />
            <Box position={[(0.5 + (15)), 0.5 + (8),0.5]} />

            {/* Down - Left */}
            <Box position={[-(0.5 + (0)), -(0.5 + (8)),0.5]} />
            <Box position={[-(0.5 + (1)), -(0.5 + (8)),0.5]} />
            <Box position={[-(0.5 + (2)), -(0.5 + (8)),0.5]} />
            <Box position={[-(0.5 + (3)), -(0.5 + (8)),0.5]} />
            <Box position={[-(0.5 + (4)), -(0.5 + (8)),0.5]} />
            <Box position={[-(0.5 + (5)), -(0.5 + (8)),0.5]} />
            <Box position={[-(0.5 + (6)), -(0.5 + (8)),0.5]} />
            <Box position={[-(0.5 + (7)), -(0.5 + (8)),0.5]} />
            <Box position={[-(0.5 + (8)), -(0.5 + (8)),0.5]} />
            <Box position={[-(0.5 + (9)), -(0.5 + (8)),0.5]} />
            <Box position={[-(0.5 + (10)), -(0.5 + (8)),0.5]} />
            <Box position={[-(0.5 + (11)), -(0.5 + (8)),0.5]} />
            <Box position={[-(0.5 + (12)), -(0.5 + (8)),0.5]} />
            <Box position={[-(0.5 + (13)), -(0.5 + (8)),0.5]} />
            <Box position={[-(0.5 + (14)), -(0.5 + (8)),0.5]} />
            <Box position={[-(0.5 + (15)), -(0.5 + (8)),0.5]} />

            {/*Down - Right */}
            <Box position={[(0.5 + (0)), -(0.5 + (8)),0.5]} />
            <Box position={[(0.5 + (1)), -(0.5 + (8)),0.5]} />
            <Box position={[(0.5 + (2)), -(0.5 + (8)),0.5]} />
            <Box position={[(0.5 + (3)), -(0.5 + (8)),0.5]} />
            <Box position={[(0.5 + (4)), -(0.5 + (8)),0.5]} />
            <Box position={[(0.5 + (5)), -(0.5 + (8)),0.5]} />
            <Box position={[(0.5 + (6)), -(0.5 + (8)),0.5]} />
            <Box position={[(0.5 + (7)), -(0.5 + (8)),0.5]} />
            <Box position={[(0.5 + (8)), -(0.5 + (8)),0.5]} />
            <Box position={[(0.5 + (9)), -(0.5 + (8)),0.5]} />
            <Box position={[(0.5 + (10)), -(0.5 + (8)),0.5]} />
            <Box position={[(0.5 + (11)), -(0.5 + (8)),0.5]} />
            <Box position={[(0.5 + (12)), -(0.5 + (8)),0.5]} />
            <Box position={[(0.5 + (13)), -(0.5 + (8)),0.5]} />
            <Box position={[(0.5 + (14)), -(0.5 + (8)),0.5]} />
            <Box position={[(0.5 + (15)), -(0.5 + (8)),0.5]} />

            {/*Right - Top */}
            {/*Reserved for entrance*/}
            <Box position={[(0.5 + (16)), 0.5 + (1),0.5]} />
            <Box position={[(0.5 + (16)), 0.5 + (2),0.5]} />
            <Box position={[(0.5 + (16)), 0.5 + (3),0.5]} />
            <Box position={[(0.5 + (16)), 0.5 + (4),0.5]} />
            <Box position={[(0.5 + (16)), 0.5 + (5),0.5]} />
            <Box position={[(0.5 + (16)), 0.5 + (6),0.5]} />
            <Box position={[(0.5 + (16)), 0.5 + (7),0.5]} />
            <Box position={[(0.5 + (16)), 0.5 + (8),0.5]} /> {/*Corner top right*/}

            {/*Left - Bottom*/}
            {/*Reserved for enterance*/}
            <Box position={[(0.5 + (16)), -(0.5 + (1)),0.5]} />
            <Box position={[(0.5 + (16)), -(0.5 + (2)),0.5]} />
            <Box position={[(0.5 + (16)), -(0.5 + (3)),0.5]} />
            <Box position={[(0.5 + (16)), -(0.5 + (4)),0.5]} />
            <Box position={[(0.5 + (16)), -(0.5 + (5)),0.5]} />
            <Box position={[(0.5 + (16)), -(0.5 + (6)),0.5]} />
            <Box position={[(0.5 + (16)), -(0.5 + (7)),0.5]} />
            <Box position={[(0.5 + (16)), -(0.5 + (8)),0.5]} /> {/*Corner bottom right*/}


        </group>
    );
};

export default FenceLeft;
