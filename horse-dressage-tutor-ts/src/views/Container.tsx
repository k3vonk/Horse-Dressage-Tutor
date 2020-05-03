/**
 * The container component : displays the UI
 *
 * @author: Ga Jun Young, 16440714
 */

import React, {createRef} from "react";
import SceneManager from "../utils/SceneManager";
import * as _ from 'underscore';
import DressageTimeline from "../utils/DressageTimeline";
import AnimationPlayer from "./AnimationPlayer";
import NavBar from "./NavBar";
import {ContainerProp} from "../utils/defined/PropInterfaces";
import {ContainerState} from "../utils/defined/StateInterfaces";

export class Container extends React.PureComponent<ContainerProp, ContainerState> {

    private mountRef = createRef<HTMLDivElement>();
    private canvasRef = createRef<HTMLCanvasElement>();
    private sceneManagerRef = createRef<SceneManager>();

    private readonly resizeCanvasThrottled: { (this: Window, ev: UIEvent): any; (this: Window, ev: UIEvent): any; };
    private interval: NodeJS.Timeout;

    constructor(props: ContainerProp) {
        super(props);
        this.state = {
            dressageTimeline: null,
            horseManager: null,
            currentSheet: null,
            time: Date.now()
        };

        // bind methods to use 'this'
        this.tick = this.tick.bind(this);
        this.handleResizeCanvasCB = this.handleResizeCanvasCB.bind(this);
        this.handleResetOrientationCB = this.handleResetOrientationCB.bind(this);
        this.handleChangeDressageTestCB = this.handleChangeDressageTestCB.bind(this);
        this.handleToggleViewCB = this.handleToggleViewCB.bind(this);

        this.resizeCanvasThrottled = _.throttle(this.handleResizeCanvasCB, 500); //500ms per throttle
    }

    componentDidMount(): void {
        const mount = this.mountRef.current;
        const sceneManagerInstance = new SceneManager(this.canvasRef.current);
        mount.appendChild(sceneManagerInstance.renderer.domElement);

        // Add additional components to scene
        sceneManagerInstance.addLetters(this.props.fontFile);
        const horseManager = sceneManagerInstance.addHorse(this.props.horseFile);

        // setup dressage timeline
        const dressageTimeline = new DressageTimeline(horseManager, this.props.dressageJsonSheets[0]);

        // setup state
        this.setState({
            horseManager: horseManager,
            currentSheet: this.props.dressageJsonSheets[0],
            dressageTimeline: dressageTimeline
        });

        // animate the scene
        sceneManagerInstance.animate();
        // @ts-ignore
        this.sceneManagerRef.current! = sceneManagerInstance;

        // resize canvas on init
        this.handleResizeCanvasCB();
        window.addEventListener("resize", this.resizeCanvasThrottled);

        this.interval = setInterval(() => this.tick(), 500); // tick every 0.5 seconds
    }

    componentWillUnmount(): void {
        window.removeEventListener('resize', this.resizeCanvasThrottled);
        clearInterval(this.interval);
    }

    /**
     * ticker to update the progress of the timeline
     */
    private tick() {
        this.setState({ time: Date.now() });
    };

    // ============================ CALLBACK HANDLERS ======================================== //

    /**
     * Adjust the canvas to appropriate width and height of the screen
     */
    private handleResizeCanvasCB() {
         this.canvasRef.current.style.width = '100%';
         this.canvasRef.current.style.height= '100%';

         this.canvasRef.current.width  = this.canvasRef.current.offsetWidth;
         this.canvasRef.current.height = this.canvasRef.current.offsetHeight;

         this.sceneManagerRef.current.onWindowResize();
    };

    private handleResetOrientationCB() {
        this.sceneManagerRef.current.resetCameraOrientation();
        this.setState({time: -1})
    };

    private handleToggleViewCB() {
        this.sceneManagerRef.current.togglePerspective();
    };

    /**
     * Clear old dressage timeline and assign new dressage timeline
     * @param index
     */
    private handleChangeDressageTestCB(index: number) {
        this.state.dressageTimeline.clear();
        const dressageTimeline = new DressageTimeline(this.state.horseManager, this.props.dressageJsonSheets[index]);

        // assign new dressageTimeline
        this.setState({
            dressageTimeline: dressageTimeline,
            currentSheet: this.props.dressageJsonSheets[index],
            time: 0
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
                    <NavBar dressageJsonSheets={this.props.dressageJsonSheets}
                            currentSheetName={this.state.currentSheet.name}
                            timeline={this.state.dressageTimeline.getTimeline()}
                            time={this.state.time}
                            horseManager={this.state.horseManager}
                            onChangeDressageSheet={this.handleChangeDressageTestCB}
                            onResetView={this.handleResetOrientationCB}
                    />

                    <AnimationPlayer horseManager={this.state.horseManager}
                                     dressageTitle={this.state.currentSheet.name}
                                     timeline={this.state.dressageTimeline.getTimeline()}
                                     tick={this.state.time}
                                     onToggleView={this.handleToggleViewCB}
                    />
                </>
           }
        </React.Fragment>
       )
    }
}
