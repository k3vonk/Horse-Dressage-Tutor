import React from "react";
import HelperPlane from "../components/HelperPlane";
import Camera from "./Camera";
import FenceLeft from "../components/FenceLeft";
import Horse from "../components/Horse";
import DrawSpline from "../components/DrawSpline";
import Letters from "../components/Letters";



const Scene = () => {


    return (
        <scene>
            <DrawSpline />
            <Horse />
            <Letters/>
            <FenceLeft />
            <HelperPlane />
            <Camera />
            <axesHelper args={3} />
        </scene>
  )
};


export default Scene;
