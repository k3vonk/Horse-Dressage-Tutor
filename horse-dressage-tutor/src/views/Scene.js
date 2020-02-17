import React, {useRef, useEffect} from "react";
import HelperPlane from "../components/HelperPlane";
import Camera from "./Camera";
import FenceLeft from "../components/FenceLeft";
import Horse from "../components/Horse";
import Letters from "../components/Letters";
import DressageTimeline from "../components/DressageTimeline";


// Parent should have reference to the meshes
// TODO: figure out where to put the animation sequence

const Scene = () => {
    const horseMesh = useRef(null);

    useEffect(() => {

        function handleFunc() {
            new DressageTimeline(horseMesh);
        }

        window.addEventListener('mousedown', handleFunc);
    });
    return (
        <scene>
            <Horse reference={horseMesh}/>
            <Letters/>
            <FenceLeft />
            <HelperPlane />
            <Camera />
            <axesHelper args={3} />
        </scene>
  )
};


export default Scene;
