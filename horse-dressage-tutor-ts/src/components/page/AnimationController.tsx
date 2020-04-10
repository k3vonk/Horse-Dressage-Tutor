import React, {useEffect, useState} from 'react';
import {Mark} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import ReplayIcon from "@material-ui/icons/Replay";
import PauseIcon from "@material-ui/icons/Pause";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import SkipPreviousIcon from "@material-ui/icons/SkipPrevious";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import CustomSlider from "./CustomSlider";
import AnimationControllerStyles from "../../css/AnimationControllerStyle";
import {DressageStepMessage} from "./DressageStepMessage";

interface AnimationProps {
    timeline: GSAPTimeline
    title: string
}

export const AnimationController: React.FC<AnimationProps> = (props) => {
    const [isDraggablePaused, setIsDraggablePaused] = useState<boolean>(false);
    const [isReplay, setIsReplay] = useState<boolean>(false);
    const [sliderValue, setSliderValue] = useState<number>(0);
    const [marks, setMarks] = useState<Mark[]>([]); // setup marks for the slider
    const classes = AnimationControllerStyles();

    // init
    useEffect(() => {
        // timeline callback to onUpdate
        props.timeline.eventCallback("onUpdate", () =>{
            setSliderValue(props.timeline.progress() * props.timeline.totalDuration());
            if (props.timeline.progress() === 1) {
                setIsReplay(true);
            } else {
                setIsReplay(false);
            }
        });

        if (marks.length === 0) { // eslint gives warning if I try to put this in a separate function
            // setup
            props.timeline.play(); // play timeline...
            setIsDraggablePaused(false);

            let marks: Mark[] = [];
            for (let [key, value] of Object.entries(props.timeline.labels)) {
                let label = "";
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
    },[marks.length, props.timeline]);

    const timeConvert = function(time: number): String {
        const date = new Date(time * 1000);
        const minutes = date.getUTCMinutes();
        const seconds = date.getSeconds();
        return minutes.toString().padStart(2, '0') + ":" + seconds.toString().padStart(2, '0');
    };

    // ==================   Display functions   ==================
    const visualIconOnActive = function() {
        if (props.timeline.isActive()) {
            return  <PauseIcon/>
        }
        return <PlayArrowIcon/>
    };

    // ==================   Callback functions   ==================
    const onSliderChange = function(object, value: number) {
        props.timeline.progress(value / props.timeline.totalDuration());
        props.timeline.pause(); // pause while dragging play head
    };

    const onSliderCommitted = function(object, value: number) {
        setSliderValue(value);
        if (!isDraggablePaused)
            props.timeline.play();
    };

    const onPlayButtonClick = function() {
        if(!isReplay) {
            if (!props.timeline.isActive()) { // timeline is not active... play timeline
                props.timeline.play();
                setIsDraggablePaused(false);
            } else { // else pause timeline...
                props.timeline.pause();
                setIsDraggablePaused(true);
            }
        } else {
            props.timeline.progress(0); // restart
        }
    };

    const onSkipNextClick = function() {
        let nextLabel = props.timeline.nextLabel();
        // @ts-ignore
        props.timeline.seek(nextLabel,false); // Gsap typescript definition and Gsap documents are currently different. But overload functionality is possible
    };

    const onSkipPrevClick = function() {
        if(props.timeline.progress() !== 0) {
            let prevLabel = props.timeline.previousLabel();
            // @ts-ignore
            props.timeline.seek(prevLabel, false); // Gsap typescript definition and Gsap documents are currently different. But overload functionality is possible
        }
    };

    return (
        <>
            <div className={classes.root}>
                <Grid
                    container
                    direction="row"
                    justify="center"
                    alignItems="center"
                >
                    <Grid item md={3} xs={12}>
                        <h2 className={classes.h2}>{props.title}</h2>
                    </Grid>
                    <Grid item xs={"auto"}>
                        <IconButton className={classes.iconButton} aria-label="play-pause-replay" onClick={onPlayButtonClick}>
                            {isReplay? <ReplayIcon /> :visualIconOnActive()}
                        </IconButton>
                        <IconButton  className={classes.iconButton} aria-label="skipNext" onClick={onSkipPrevClick}>
                            <SkipPreviousIcon />
                        </IconButton>
                        <IconButton className={classes.iconButton} aria-label="skipNext" onClick={onSkipNextClick}>
                            <SkipNextIcon />
                        </IconButton>
                    </Grid>
                    <Grid item lg={"auto"} sm={1} xs={2}>
                        <h6 className={classes.h6}>{timeConvert(props.timeline.time())}</h6>
                    </Grid>
                    <Grid item lg={6} md={5} sm={6} xs={4}>

                        <CustomSlider
                            min={0.0}
                            max={props.timeline.totalDuration()}
                            value={sliderValue}
                            marks={marks}
                            onChange={onSliderChange}
                            onChangeCommitted={onSliderCommitted}
                            aria-label="continuous-slider"
                        />
                    </Grid>
                    <Grid item lg={"auto"} sm={1} xs={2}>
                        <h6 className={classes.h6}>{timeConvert(props.timeline.totalDuration())}</h6>
                    </Grid>
                </Grid>
            </div>
        </>
    )
};
