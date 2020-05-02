import React, {createRef} from "react";
import {DressageTest} from "../utils/types";
import {GLTF} from "three/examples/jsm/loaders/GLTFLoader";
import {Font} from "three";
import SceneManager from "../utils/SceneManager";
import * as _ from 'underscore';
import DressageTimeline from "../utils/DressageTimeline";
import AnimationController from "./AnimationController";
import HorseManager from "../components/HorseManager";
import NavBar from "./NavBar";

interface ContainerProp {
    dressageSheets: DressageTest[],
    horseGLTF: GLTF,
    font: Font,
}

interface ContainerState {
    dressageTimeline: DressageTimeline,
    currentSheet: DressageTest,
    horseManager: HorseManager,
    timelineProgress: number,
    seconds: number,
}

export class Container extends React.PureComponent<ContainerProp, ContainerState> {

    private mountRef = createRef<HTMLDivElement>();
    private canvasRef = createRef<HTMLCanvasElement>();
    private sceneManagerRef = createRef<SceneManager>();
    resizeCanvasThrottled;

    constructor(props: ContainerProp) {
        super(props);
        this.state = {
            dressageTimeline: null,
            horseManager: null,
            currentSheet: null,
            timelineProgress: 0,
            seconds: 0,
        };

        // bind methods to use 'this'
        this.resizeCanvas = this.resizeCanvas.bind(this);
        this.resetOrientation = this.resetOrientation.bind(this);
        this.setNewDressageTest = this.setNewDressageTest.bind(this);
        this.toggleView = this.toggleView.bind(this);
        this.resizeCanvasThrottled = _.throttle(this.resizeCanvas, 500); //500ms per throttle
    }

    componentDidMount(): void {
        const mount = this.mountRef.current;
        const sceneManagerInstance = new SceneManager(this.canvasRef.current);
        mount.appendChild(sceneManagerInstance.renderer.domElement);

        // Add additional components to scene
        sceneManagerInstance.addLetters(this.props.font);
        const horseManager = sceneManagerInstance.addHorse(this.props.horseGLTF);

        // setup dressage timeline
        const dressageTimeline = new DressageTimeline(horseManager, this.props.dressageSheets[0]);

        // setup state
        this.setState({
            horseManager: horseManager,
            currentSheet: this.props.dressageSheets[0],
            dressageTimeline: dressageTimeline
        });

        // animate the scene
        sceneManagerInstance.animate();
        // @ts-ignore
        this.sceneManagerRef.current! = sceneManagerInstance;

        // resize canvas on init
        this.resizeCanvas();
        window.addEventListener("resize", this.resizeCanvasThrottled);
    }

    componentWillUnmount(): void {
        window.removeEventListener('resize', this.resizeCanvasThrottled);
    }

    resizeCanvas() {
         this.canvasRef.current.style.width = '100%';
         this.canvasRef.current.style.height= '100%';

         this.canvasRef.current.width  = this.canvasRef.current.offsetWidth;
         this.canvasRef.current.height = this.canvasRef.current.offsetHeight;

         this.sceneManagerRef.current.onWindowResize();
    };

    resetOrientation() {
        this.sceneManagerRef.current.resetCameraOrientation();
    };

    toggleView() {
        this.sceneManagerRef.current.toggleIsViewingScene();
    };


    setNewDressageTest(index: number) {
        this.state.dressageTimeline.getTimeline().clear();
        this.state.horseManager.resetHorsePosition();
        const dressageTimeline = new DressageTimeline(this.state.horseManager, this.props.dressageSheets[index]);

        this.setState({
            dressageTimeline: dressageTimeline,
            horseManager: this.state.horseManager,
            currentSheet: this.props.dressageSheets[index],
            timelineProgress: 0,
            seconds: 0,
        });
        this.sceneManagerRef.current.resetCameraOrientation();
        dressageTimeline.getTimeline().play();

    }

    render() {
       return (
       <React.Fragment>
           <div className="threeContainer" ref={this.mountRef} >
               <canvas ref={this.canvasRef} />
           </div>

           {this.state.dressageTimeline &&
                <>
                    <NavBar dressageSheets={this.props.dressageSheets}
                            currentSheet={this.state.currentSheet.name}
                            timeline={this.state.dressageTimeline.getTimeline()}
                            horseManager={this.state.horseManager}
                            changeDressageFunction={this.setNewDressageTest}
                            handleResetView={this.resetOrientation}
                    />

                    <AnimationController timeline={this.state.dressageTimeline.getTimeline()}
                                         horseManager={this.state.horseManager}
                                         title={this.state.currentSheet.name}
                                         resetOrientation={this.toggleView}
                    />
                </>
           }
        </React.Fragment>
       )
    }
}
