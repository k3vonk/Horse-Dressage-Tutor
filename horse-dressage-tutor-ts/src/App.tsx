import React, {useEffect, useRef, useState} from 'react';
import SceneManager from "./SceneManager";
import LoadManager from "./utils/LoadManager";
import {Animation} from "./components/Animation";


export default function App(): JSX.Element {
    let canvasRef = useRef<HTMLCanvasElement>();
    const mountRef = useRef<HTMLDivElement>();
    const sceneManagerRef = useRef<SceneManager>();
    const loadManager = new LoadManager();
    const [timeline, setTimeline] = useState<GSAPTimeline>(null);

    // Init
    useEffect(() => {

        loadManager.manager.onLoad = () => {
            console.log("All items are loaded...");

            const mount = mountRef.current;
            const sceneManagerInstance = new SceneManager(canvasRef.current, loadManager);
            mount.appendChild(sceneManagerInstance.renderer.domElement);

            sceneManagerRef.current = sceneManagerInstance;
            sceneManagerInstance.render();

            setTimeline(sceneManagerInstance.getTimeline());

            // Event Listeners
            bindEventListeners();
        };

        // Loading data
        if (timeline === null) {
            loadManager.loadFont();
            loadManager.loadHorse();
        }

    },[loadManager, bindEventListeners, timeline]);

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
        <div ref={mountRef} style={{ height: '100%', width: '100%'}}>
            <canvas ref={thisInput  => (canvasRef.current = thisInput  as HTMLCanvasElement)} />
            {timeline? <Animation timeline={timeline}/> : null}
        </div>

    );
}

// <AnimationController ref={sliderRef}/>
