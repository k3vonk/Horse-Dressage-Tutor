import React, { Suspense } from 'react'

import Text from "./Text";
import {centerlineLetters, edgeLetters} from "../Constants";

function EdgeLetters() {
    return ( Object.entries(edgeLetters).map(([key, value]) =>
    {
        let pos = value.map((x) => x); // Makes a copy
        switch(key) {
            case "A":
                pos[0] += 4;
                break;
            case "K":
            case "E":
            case "H":
                pos[1] -= 3;
                break;
            case "C":
                pos[0] -= 4;
                break;
            case "M":
            case "B":
            case "F":
                pos[1] += 3;
                break;
            default:
                break;
        }

        return <Text position={pos} children={key} />
    }))
}

function CenterlineLetter() {
    return ( Object.entries(centerlineLetters).map(([key, value]) => {
        let copiedValue = value.map((x) => x);
        return <Text position={copiedValue} children={key} height={0.1}/>
    }))
}

export default function Letters() {

    return (
        <Suspense fallback={null}>
            <group>
                <EdgeLetters />
                <CenterlineLetter />
            </group>
        </Suspense>
    )
}
