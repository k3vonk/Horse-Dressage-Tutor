import React from 'react';
import {Icon, Mark, withStyles, WithStyles} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import ReplayIcon from "@material-ui/icons/Replay";
import PauseIcon from "@material-ui/icons/Pause";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import SkipPreviousIcon from "@material-ui/icons/SkipPrevious";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import CustomSlider from "../css/MakeStyles/CustomSlider";
import AnimationControllerStyles from "../css/MakeStyles/AnimationControllerStyle";
import HorseManager from "../components/HorseManager";
import clsx from "clsx";
/**
 * Animation Controller : A React Pure Component that displays the animation player, and the title of the dressage sheet
 * 
 * @author: Ga Jun Young
 */

/**
 * Prop Interface for this Functional Component
 */
interface AnimationProps extends WithStyles<typeof AnimationControllerStyles>{
    timeline: GSAPTimeline,
    horseManager: HorseManager,
    title: string,
    resetOrientation: () => void
}

interface AnimationState {
    isDraggablePaused: boolean,
    isReplay: boolean,
    toggle: boolean,
    sliderValue: number,
    totalTime: string,
    currentTime: string,
    marks: Mark[],
}

class Buttons extends React.Component<{ classes: any, onClick: () => void, actionIcon: any, onClick1: () => void, onClick2: () => void, toggle: boolean, onClick3: () => void }> {
    render() {
        return <>
            <IconButton className={this.props.classes.iconButton} aria-label="play-pause-replay"
                        onClick={this.props.onClick}>
                {this.props.actionIcon}
            </IconButton>
            <IconButton className={this.props.classes.iconButton} aria-label="skipPrev" onClick={this.props.onClick1}>
                <SkipPreviousIcon/>
            </IconButton>
            <IconButton className={this.props.classes.iconButton} aria-label="skipNext" onClick={this.props.onClick2}>
                <SkipNextIcon/>
            </IconButton>
            <IconButton className={clsx(this.props.classes.iconButton, {
                [this.props.classes.activeIconButton]: this.props.toggle,
            })} aria-label="resetView" onClick={this.props.onClick3}>
                <Icon>
                    <svg className={this.props.classes.svg} aria-hidden="true" focusable="false" data-prefix="fas"
                         data-icon="horse-head"
                         role="img" xmlns="http://www.w3.org/2000/svg"
                         viewBox="0 10 512 512">
                        <path fill="currentColor"
                              d="M509.8 332.5l-69.9-164.3c-14.9-41.2-50.4-71-93-79.2 18-10.6 46.3-35.9 34.2-82.3-1.3-5-7.1-7.9-12-6.1L166.9 76.3C35.9 123.4 0 238.9 0 398.8V480c0 17.7 14.3 32 32 32h236.2c23.8 0 39.3-25 28.6-46.3L256 384v-.7c-45.6-3.5-84.6-30.7-104.3-69.6-1.6-3.1-.9-6.9 1.6-9.3l12.1-12.1c3.9-3.9 10.6-2.7 12.9 2.4 14.8 33.7 48.2 57.4 87.4 57.4 17.2 0 33-5.1 46.8-13.2l46 63.9c6 8.4 15.7 13.3 26 13.3h50.3c8.5 0 16.6-3.4 22.6-9.4l45.3-39.8c8.9-9.1 11.7-22.6 7.1-34.4zM328 224c-13.3 0-24-10.7-24-24s10.7-24 24-24 24 10.7 24 24-10.7 24-24 24z"/>
                    </svg>
                </Icon>
            </IconButton>
        </>;
    }
}

class AnimationController extends React.PureComponent<AnimationProps, AnimationState> {

    private interval;
    constructor(props: AnimationProps) {
        super(props);

        this.state = {
            isDraggablePaused: false,
            isReplay: false,
            toggle: false,
            sliderValue: 0,
            totalTime: '00:00',
            currentTime: '00:00',
            marks: [],
        };

        // binding to enable 'this' to work in callbacks
        this.tick = this.tick.bind(this);
        this.onPlayButtonClick = this.onPlayButtonClick.bind(this);
        this.onSliderChange = this.onSliderChange.bind(this);
        this.onSliderCommitted = this.onSliderCommitted.bind(this);
        this.onSkipPrevClick = this.onSkipPrevClick.bind(this);
        this.onSkipNextClick = this.onSkipNextClick.bind(this);
        this.handleHorseViewClick = this.handleHorseViewClick.bind(this);
    }

    componentDidMount(): void {
        this.setState({
            totalTime: this.timeConvert(this.props.timeline.totalDuration()),
            currentTime: this.timeConvert(this.props.timeline.time())
        });
        this.props.timeline.play();
        this.generateMarks();
        this.interval = setInterval(() => this.tick(), 1000);
    }

    componentDidUpdate(prevProps: Readonly<AnimationProps>, prevState: Readonly<AnimationState>, snapshot?: any): void {
        if(prevProps.timeline !== this.props.timeline) {
            this.setState({
                isDraggablePaused: false,
                isReplay: true,
                toggle: false,
                sliderValue: 0,
                totalTime: this.timeConvert(this.props.timeline.totalDuration()),
                currentTime: this.timeConvert(this.props.timeline.time()),
                marks: [],
            });

            this.generateMarks();
            this.tick();
        }
    }

    componentWillUnmount(): void {
        clearInterval(this.interval);
    }

    /**
     * generate marks for the slider
     */
    generateMarks() {
        let marks: Mark[] = [];
        // Iterate through the timeline labels...
        for (let [key, value] of Object.entries(this.props.timeline.labels)) {
            let label = "";

            // extract the test number from the key
            if(!isNaN(parseInt(key.substr(0,key.indexOf(' '))))){
                label = key.substr(0,key.indexOf(' '));
            }

            // Add a mark
            marks.push({
                value: value,
                label: label,
            })
        }

        this.setState({marks: marks});
    };

    /**
     * Time conversion of the timeline to minutes:seconds
     * @param time
     */
    timeConvert(time: number): string {
        const date = new Date(time * 1000);
        const minutes = date.getUTCMinutes();
        const seconds = date.getSeconds();
        return minutes.toString().padStart(2, '0') + ":" + seconds.toString().padStart(2, '0');
    };

    // ==================   Callback functions   ==================
    /**
     * ticker to update a component
     */
    tick() {
        this.setState({
            sliderValue: (this.props.timeline.progress() * this.props.timeline.totalDuration()),
            currentTime: this.timeConvert(this.props.timeline.time())
        });

        if (this.props.timeline.progress() !== 1) {
            this.setState({isReplay: false,});
        } else {
            this.setState({isReplay: true,})
        }
    };

    /**
     * When slider is pressed, pause the progress of the timeline
     * @param object : not used.
     * @param value
     */
    onSliderChange(object, value: number) {
        this.setState({sliderValue: value});
        this.props.timeline.progress(value / this.props.timeline.totalDuration());
        this.props.timeline.pause();
    };

    /**
     * Once the slider is released, set the value.
     * @param object : not used.
     * @param value
     */
    onSliderCommitted(object, value: number) {
        this.setState({sliderValue: value});
        this.props.horseManager.pauseMixer(); // pause the horses animation

        if(!this.state.isDraggablePaused) // if the video was originally paused...
            this.props.timeline.play();
    };

    /**
     * Depending on the play buttons current state,
     * The clicking of the button would either play or pause.
     */
    onPlayButtonClick() {
        if(!this.state.isReplay) { // if replay is not available...
            if (!this.props.timeline.isActive()) { // timeline is not active... play timeline
                this.props.timeline.play();
                this.setState({isDraggablePaused: false});
            } else { // else pause timeline...
                this.props.timeline.pause();
                this.props.horseManager.pauseMixer();
                this.setState({isDraggablePaused: true});
            }
        } else {
            this.props.timeline.progress(0); // restart
        }
    }

    /**
     * On click, seek the previous timeline label and skip to that label
     */
    onSkipPrevClick() {
        if(this.props.timeline.progress() !== 0) { // disallow skipping backwards when progress is 0.
            let prevLabel = this.props.timeline.previousLabel();
            // @ts-ignore
            this.props.timeline.seek(prevLabel, false); // Gsap typescript definition and Gsap documents are currently different. But overload functionality is possible
        }
    };

    /**
     * On click, seek the next timeline label and skip to that label
     */
    onSkipNextClick() {
        let nextLabel = this.props.timeline.nextLabel();
        // @ts-ignore
        this.props.timeline.seek(nextLabel,false); // Gsap typescript definition and Gsap documents are currently different. But overload functionality is possible
    };

    /**
     * call back to handle the toggling of the horse view button
     */
    handleHorseViewClick() {
        this.props.resetOrientation();
        this.setState({toggle: !this.state.toggle})
    };

    // ========================= Draw components

    /**
     * Return the appropriate action icon depending on the status of the timeline bar
     */
    actionIcon() {
        if(this.state.isReplay)
            return <ReplayIcon/>;

        if(this.props.timeline.isActive())
            return <PauseIcon/>;

        return <PlayArrowIcon/>;
    }

    render() {
        const {classes} = this.props;
        return (
            <div className={classes.root}>
                <Grid container justify="center">
                    <Grid item xs={11}>
                        <CustomSlider
                            min={0}
                            max={this.props.timeline.totalDuration()}
                            value={this.state.sliderValue}
                            marks={this.state.marks}
                            onChange={this.onSliderChange}
                            onChangeCommitted={this.onSliderCommitted}
                            aria-label="continuous-slider"
                        />
                    </Grid>
                </Grid>

                <Grid container justify="center">
                    <Grid item xs={5}>
                        <Grid container alignItems="center">
                            <Grid item>
                                <Buttons classes={classes} onClick={this.onPlayButtonClick}
                                         actionIcon={this.actionIcon()} onClick1={this.onSkipPrevClick}
                                         onClick2={this.onSkipNextClick} toggle={this.state.toggle}
                                         onClick3={this.handleHorseViewClick}/>
                            </Grid>
                            <Grid item>
                                <p className={classes.time}>{this.state.currentTime + " / " + this.state.totalTime}</p>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={6}>
                        <p className={classes.dressageName}>{this.props.title}</p>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default withStyles(AnimationControllerStyles)(AnimationController);
