/**
 * Animation Controller : A React Functional Component that displays a player, and the title of the dressage sheet
 * 
 * @author: Ga Jun Young
 */

import React, {useEffect, useState} from 'react';
import {Mark} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import ReplayIcon from "@material-ui/icons/Replay";
import PauseIcon from "@material-ui/icons/Pause";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import SkipPreviousIcon from "@material-ui/icons/SkipPrevious";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import CustomSlider from "../css/MakeStyles/CustomSlider";
import AnimationControllerStyles from "../css/MakeStyles/AnimationControllerStyle";
import DressageTimeline from "../utils/DressageTimeline";
import HorseManager from "../components/HorseManager";
import {NavBar} from "./NavBar";

/**
 * Prop Interface for this Functional Component
 */
interface AnimationProps {
    dressageTimeline: DressageTimeline,
    horseManager: HorseManager,
    title: string
}

export const AnimationController: React.FC<AnimationProps> = (props) => {
    const [timeline] = useState<GSAPTimeline>(props.dressageTimeline.getTimeline());
    const [isDraggablePaused, setIsDraggablePaused] = useState<boolean>(false);
    const [isReplay, setIsReplay] = useState<boolean>(false);
    const [sliderValue, setSliderValue] = useState<number>(0);
    const [marks, setMarks] = useState<Mark[]>([]); // setup marks for the slider
    const [, setTime] = useState(Date.now());
    const classes = AnimationControllerStyles();

    // setup timeline callback - onUpdate
    useEffect(() => {
        timeline.play(); // play timeline...
        setIsDraggablePaused(false);
    },[props.dressageTimeline, timeline]);

    useEffect(()=> {
        const interval = setInterval(() => {
                setTime(Date.now());
                setSliderValue(timeline.progress() * timeline.totalDuration());
                if (timeline.progress() === 1) { setIsReplay(true); }
                else { setIsReplay(false);}
                },
            800
        );
        return() => {
            clearInterval(interval);
        }
    }, [timeline]);

    // setup marks on the slider
    useEffect(()=> {
        generateMarks();
    });

    /**
     * generate marks for the slider
     */
    const generateMarks = function() {
        if (marks.length === 0) {
            let marks: Mark[] = [];

            // Iterate through the timeline labels...
            for (let [key, value] of Object.entries(timeline.labels)) {
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
            setMarks(marks);
        }
    };

    /**
     * Time conversion of the timeline to minutes:seconds
     * @param time
     */
    const timeConvert = function(time: number): String {
        const date = new Date(time * 1000);
        const minutes = date.getUTCMinutes();
        const seconds = date.getSeconds();
        return minutes.toString().padStart(2, '0') + ":" + seconds.toString().padStart(2, '0');
    };

    // ==================   Display functions   ==================
    /**
     * Display pause or play button depending on the timeline
     */
    const visualIconOnActive = function() {
        if (timeline.isActive()) {
            return  <PauseIcon/>
        }
        return <PlayArrowIcon/>
    };

    // ==================   Callback functions   ==================
    /**
     * When slider is pressed, pause the progress of the timeline
     * @param object : not used.
     * @param value
     */
    const onSliderChange = function(object, value: number) {
        setSliderValue(value);
        timeline.progress(value / timeline.totalDuration());
        timeline.pause();
    };

    /**
     * Once the slider is released, set the value.
     * @param object : not used.
     * @param value
     */
    const onSliderCommitted = function(object, value: number) {
        setSliderValue(value);
        props.horseManager.pauseMixer(); // pause the horses animation
        if (!isDraggablePaused) // if the video was originally being played...
            timeline.play();
    };

    /**
     * Depending on the play buttons current state,
     * The clicking of the button would either play or pause.
     */
    const onPlayButtonClick = function() {
        if(!isReplay) { // if replay is not available...
            if (!timeline.isActive()) { // timeline is not active... play timeline
                timeline.play();
                setIsDraggablePaused(false);
            } else { // else pause timeline...
                timeline.pause();
                props.horseManager.pauseMixer();
                setIsDraggablePaused(true);
            }
        } else {
            timeline.progress(0); // restart
        }
    };

    /**
     * On click, seek the next timeline label and skip to that label
     */
    const onSkipNextClick = function() {
        let nextLabel = timeline.nextLabel();
        // @ts-ignore
        timeline.seek(nextLabel,false); // Gsap typescript definition and Gsap documents are currently different. But overload functionality is possible
    };

    /**
     * On click, seek the previous timeline label and skip to that label
     */
    const onSkipPrevClick = function() {
        if(timeline.progress() !== 0) { // disallow skipping backwards when progress is 0.
            let prevLabel = timeline.previousLabel();
            // @ts-ignore
            timeline.seek(prevLabel, false); // Gsap typescript definition and Gsap documents are currently different. But overload functionality is possible
        }
    };

    /**
     * Draw the buttons for the controller - play, skip prev, skip next
     */
    function drawControllerButtons() {
        return <>
            <IconButton className={classes.iconButton} aria-label="play-pause-replay" onClick={onPlayButtonClick}>
                {isReplay ? <ReplayIcon/> : visualIconOnActive()}
            </IconButton>
            <IconButton className={classes.iconButton} aria-label="skipNext" onClick={onSkipPrevClick}>
                <SkipPreviousIcon/>
            </IconButton>
            <IconButton className={classes.iconButton} aria-label="skipNext" onClick={onSkipNextClick}>
                <SkipNextIcon/>
            </IconButton>
        </>;
    }

    return (
        <React.Fragment>
            <NavBar timeline={timeline} progress={sliderValue} horseManager={props.horseManager}/>

            <div className={classes.root}>
                <Grid
                    container
                    direction="row"
                    justify="center"
                    alignItems="center"
                >

                    <Grid item xs={11}>
                        <CustomSlider
                            min={0.0}
                            max={timeline.totalDuration()}
                            value={sliderValue}
                            marks={marks}
                            onChange={onSliderChange}
                            onChangeCommitted={onSliderCommitted}
                            aria-label="continuous-slider"
                        />
                    </Grid>

                </Grid>

                <Grid container
                      direction="row"
                      justify="center"
                      alignItems="center"
                >
                    <Grid item xs={5}>
                        <Grid container alignItems="center">
                            <Grid item >
                                {drawControllerButtons()}
                            </Grid>

                            <Grid item>
                                <p className={classes.time}>{timeConvert(timeline.time()) + " / " + timeConvert(timeline.totalDuration())}</p>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={6}>
                        <p className={classes.dressageName}>{props.title}</p>
                    </Grid>

                </Grid>


            </div>

        </React.Fragment>
    )
};

/*

            <NavBar timeline={timeline} progress={sliderValue} horseManager={props.horseManager}/>

 */
