import React, {useEffect, useRef} from 'react';
import SceneManager from "./views/SceneManager";


export default function App(): JSX.Element {
    let canvasRef = useRef<HTMLCanvasElement>();
    const mountRef = useRef<HTMLDivElement>();
    const sceneManagerRef = useRef<SceneManager>();


    // Init
    useEffect(() => {
        const mount = mountRef.current;
        const sceneManagerInstance = new SceneManager(canvasRef.current);
        mount.appendChild(sceneManagerInstance.renderer.domElement);
        sceneManagerInstance.animate();

        sceneManagerRef.current = sceneManagerInstance;

    }, []);

    // Event Listener changes
    useEffect(() => {
        bindEventListeners();
    }, [bindEventListeners]);

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
      </div>
    );
}
