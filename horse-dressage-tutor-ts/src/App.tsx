import React, {useEffect, useRef, useState} from 'react';
import SceneManager from "./SceneManager";
import LoadManager from "./model/LoadManager";
import {AnimationController} from "./components/page/AnimationController";
import "./css/app.css";
import HorseManager from "./components/scene/HorseManager";
import Letters from "./components/scene/Letters";
import DressageTimelineModel from "./model/DressageTimeline";
import {DressageStepMessage} from "./components/page/DressageStepMessage";

export default function App(): JSX.Element {
    let canvasRef = useRef<HTMLCanvasElement>();
    const mountRef = useRef<HTMLDivElement>();
    const sceneManagerRef = useRef<SceneManager>();
    const [dressageTimelineModel, setDressageTimelineModel] = useState<DressageTimelineModel>(null);
    const [dressageJsonSheet] = useState<string>("./sample/novice_dressage_110_2012.json");
    const [title, setTitle] = useState<string>(null);
    let loadManager = new LoadManager();

    // Loading of manager
    useEffect(() => {
        loadManager.manager.onLoad = () => {
            const mount = mountRef.current;
            const sceneManager = new SceneManager(canvasRef.current); // scene view

            // Add loaded components to scene
            const horseManager = new HorseManager(sceneManager.scene, loadManager.horseGLTF);
            new Letters(sceneManager.scene, loadManager.font);

            mount.appendChild(sceneManager.renderer.domElement);
            sceneManager.render();

            // fetch JSON sheet
            fetch(dressageJsonSheet)
                .then(res => {
                    return res.json();
                })
                .then(data => {
                    setDressageTimelineModel(new DressageTimelineModel(horseManager.horse, data)); // configure the horse for a specific dressage test
                    setTitle(data.name);
                });
            sceneManagerRef.current = sceneManager;


            // callback hook setups
            bindEventListeners();
        };

        // Loading data
        if(dressageTimelineModel === null){
            loadManager.loadFont();
            loadManager.loadHorse();
        }

    },[bindEventListeners, dressageJsonSheet, dressageTimelineModel, loadManager]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <>

            <div className="backdrop" ref={mountRef} style={{ height: '100%', width: '100%'}}>
                <canvas ref={thisInput  => (canvasRef.current = thisInput  as HTMLCanvasElement)} />
            </div>

            {dressageTimelineModel?
                <>

                    <DressageStepMessage message={dressageTimelineModel.getTimeline().currentLabel()}/>

                    <div className="container">
                        <AnimationController timeline={dressageTimelineModel.getTimeline()} title={title}/>
                    </div>
                    <div className="section"></div>
                </>: null
            }

        </>

    );
}
