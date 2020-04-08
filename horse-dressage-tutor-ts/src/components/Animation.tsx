import React, {useEffect, useState} from 'react';
import {Mark} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Slider from "@material-ui/core/Slider";
import IconButton from "@material-ui/core/IconButton";
import ReplayIcon from "@material-ui/icons/Replay";
import PauseIcon from "@material-ui/icons/Pause";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import SkipPreviousIcon from "@material-ui/icons/SkipPrevious";
import SkipNextIcon from "@material-ui/icons/SkipNext";

interface AnimationProps {
    timeline: GSAPTimeline
}


export const Animation: React.FC<AnimationProps> = (props) => {
    const [isDraggablePaused, setIsDraggablePaused] = useState<boolean>(false);
    const [isReplay, setIsReplay] = useState<boolean>(false);
    const [sliderValue, setSliderValue] = useState<number>(0);
    const [marks, setMarks] = useState<Mark[]>([]);

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

        // setup
        props.timeline.play(); // play timeline...
        setIsDraggablePaused(false);
    }, [props.timeline]);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let generateMarks = function() {
        if (marks.length === 0) {
            let marks: Mark[] = [];
            for (let [key, value] of Object.entries(props.timeline.labels)) {
                let label = "";
                if(!isNaN(parseInt(key.substr(0,key.indexOf(' '))))){
                    label = key.substr(0,key.indexOf(' '));
                }
                // Add a mark
                marks.push({
                    value: value,
                    label: label
                })
            }
            setMarks(marks);
        }
    }(); // Called function

    const timeConvert = function(time: number): String {
        const date = new Date(time * 1000);
        const minutes = date.getUTCMinutes();
        const seconds = date.getSeconds();
        return minutes.toString().padStart(1, '0') + ":" + seconds.toString().padStart(2, '0');
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
            props.timeline.progress(0);
        }
    };

    const onSkipNextClick = function() {
        let nextLabel = props.timeline.nextLabel();
        // @ts-ignore
        props.timeline.seek(nextLabel,false);
    };

    const onSkipPrevClick = function() {
        if(props.timeline.progress() !== 0) {
            let prevLabel = props.timeline.previousLabel();
            // @ts-ignore
            props.timeline.seek(prevLabel, false); // Gsap typescript definition and Gsap documents are currently different. But overload functionality is possible
        }
    };


    return (
        <div>
            <Grid container spacing={1}>
                <Grid item>
                    <IconButton aria-label="play-pause-replay" onClick={onPlayButtonClick}>
                        {isReplay?
                            <ReplayIcon/>
                            : visualIconOnActive()
                        }
                    </IconButton>
                </Grid>
                <Grid item>
                    <IconButton aria-label="skipNext" onClick={onSkipPrevClick}>
                        <SkipPreviousIcon/>
                    </IconButton>
                </Grid>
                <Grid item>
                    <IconButton aria-label="skipNext" onClick={onSkipNextClick}>
                        <SkipNextIcon/>
                    </IconButton>
                </Grid>
                <Grid item xs aria-labelledby="continuous-slider">
                    <div>
                        <Slider className="marker"
                                min={0.0}
                                max={props.timeline.totalDuration()}
                                value={sliderValue}
                                marks={marks}
                                onChange={onSliderChange}
                                onChangeCommitted={onSliderCommitted}
                                valueLabelDisplay="auto"
                        /> </div>
                </Grid>
                <Grid item>
                    <p className="time">{timeConvert(props.timeline.time()) + " / " + timeConvert(props.timeline.totalDuration())}</p>
                </Grid>
            </Grid>
        </div>
    )
};
