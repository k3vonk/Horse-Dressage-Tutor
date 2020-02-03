import React from "react";
import HelperPlane from "../components/HelperPlane";
import Camera from "./Camera";
import FenceLeft from "../components/FenceLeft";
import Horse from "../components/Horse";

const Scene = () => {
    return (
        <scene>
            <Horse />
            <FenceLeft />
            <HelperPlane />
            <Camera />
            <axesHelper args={3} />
        </scene>
  )
};

export default Scene;
