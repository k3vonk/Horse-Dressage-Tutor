import React, {useEffect, useRef, useState} from "react";
import {DressageTest} from "../utils/types";
import {GLTF} from "three/examples/jsm/loaders/GLTFLoader";
import {Font} from "three";
import SceneManager from "../utils/SceneManager";
import DressageTimeline from "../utils/DressageTimeline";
import {AnimationController} from "./AnimationController";
import HorseManager from "../components/HorseManager";

interface LoadProps {
    dressageSheet: DressageTest,
    horseGLTF: GLTF,
    font: Font,
}

const Container: React.FC<LoadProps> = (props) => {
    const canvasRef = useRef<HTMLCanvasElement>();
    const mountRef = useRef<HTMLDivElement>();
    const sceneManagerRef = useRef<SceneManager>();
    const [dressageTimeline, setDressageTimeline] = useState<DressageTimeline>(null);
    const [horseManager, setHorseManager] = useState<HorseManager>(null);

    // init
    useEffect(() => {
        const mount = mountRef.current;
        const sceneManagerInstance = new SceneManager(canvasRef.current);
        mount.appendChild(sceneManagerInstance.renderer.domElement);

        // Add additional components to scene
        sceneManagerInstance.addLetters(props.font);
        const horseManager = sceneManagerInstance.addHorse(props.horseGLTF);
        setHorseManager(horseManager);

        // setup dressage timeline
        const dressageTimeline = new DressageTimeline(horseManager, props.dressageSheet);
        setDressageTimeline(dressageTimeline);

        sceneManagerInstance.render();
        sceneManagerRef.current = sceneManagerInstance;
    }, [props.dressageSheet, props.font, props.horseGLTF]);

    useEffect(() => {
        bindEventListeners();
    });


    function bindEventListeners() {
        window.onresize = resizeCanvas;
        resizeCanvas();
    }

    function resizeCanvas(): void {
        canvasRef.current.style.width = '100%';
        canvasRef.current.style.height= '100%';

        canvasRef.current.width  = canvasRef.current.offsetWidth;
        canvasRef.current.height = canvasRef.current.offsetHeight;

        sceneManagerRef.current.onWindowResize();
    }

    return (
        <React.Fragment>
            <div className="threeContainer" ref={mountRef} >
                <canvas ref={canvasRef} />
            </div>

            {dressageTimeline?
                <AnimationController dressageTimeline={dressageTimeline} horseManager={horseManager} title={props.dressageSheet.name}/>
                : null
            }

        </React.Fragment>
    );
};

export default Container;
