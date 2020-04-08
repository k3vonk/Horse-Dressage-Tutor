import React from 'react';
import Slider from '@material-ui/core/Slider';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import ReplayIcon from '@material-ui/icons/Replay';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import "../css/animation.css";


interface SliderState {
    timeline?: GSAPTimeline,
    isLoaded: boolean,
    isDraggablePaused: boolean,
    isReplay: boolean,
    sliderValue: number,
    marks: {value: number, label: string}[]
}



class AnimationController extends React.Component<{}, SliderState> {

    constructor(props) {
        super(props);
        this.state = {
            timeline: null,
            isLoaded: false,
            isDraggablePaused: true,
            isReplay: false,
            sliderValue: 0,
            marks: []
        };

        // callback functions
        this.onSliderChange = this.onSliderChange.bind(this);
        this.onSliderCommitted = this.onSliderCommitted.bind(this);
        this.onPlayButtonClick = this.onPlayButtonClick.bind(this);
        this.onSkipNextClick = this.onSkipNextClick.bind(this);
        this.onSkipPrevClick = this.onSkipPrevClick.bind(this);
    }

    setTimeline(timeline: GSAPTimeline) {

        this.setState( {
            timeline: timeline,
            isLoaded: true
        });
        this.generateMarks();

        // timeline callback to onUpdate
        this.state.timeline.eventCallback("onUpdate", () =>{
            this.setState({sliderValue: this.state.timeline.progress()  * this.state.timeline.totalDuration()});

            if (this.state.timeline.progress() === 1) {
                this.setState({isReplay: true})
            } else {
                this.setState({isReplay: false})
            }
        });

        // play the timeline
        this.state.timeline.play();

        this.setState({isDraggablePaused: false});
    }


    timeConvert(time: number) {
        const date = new Date(time * 1000);
        const minutes = date.getUTCMinutes();
        const seconds = date.getSeconds();
        return minutes.toString().padStart(1, '0') + ":" + seconds.toString().padStart(2, '0');
    }

    onSliderChange(object, value: number) {
        this.state.timeline.progress(value / this.state.timeline.totalDuration());
        this.state.timeline.pause(); // pause while dragging play head
    }

    onSliderCommitted(object, value: number) {
        this.setState({sliderValue: value});

        if (!this.state.isDraggablePaused)
            this.state.timeline.play();
    }

    onPlayButtonClick() {
        if(!this.state.isReplay) {
            if (!this.state.timeline.isActive()) {
                this.state.timeline.play();
                this.setState({isDraggablePaused: false,});
            } else {
                this.state.timeline.pause();
                this.setState({isDraggablePaused: true,});
            }
        } else {
            this.state.timeline.progress(0);
        }
    }

    onSkipNextClick() {
        let nextLabel = this.state.timeline.nextLabel();
        // @ts-ignore
        this.state.timeline.seek(nextLabel,false);
    }

    onSkipPrevClick() {
        let prevLabel = this.state.timeline.previousLabel();
        // @ts-ignore
        this.state.timeline.seek(prevLabel, false);
    }

    checkIsPaused() {
        if (this.state.timeline.isActive()) {
            return  <PauseIcon/>
        }
        return <PlayArrowIcon/>
    }

    generateMarks() {
        if (this.state.marks.length === 0) {
            for (let [key, value] of Object.entries(this.state.timeline.labels)) {
                console.log(key);
                let label = "";
                if(!isNaN(parseInt(key.substr(0,key.indexOf(' '))))){
                    label = key.substr(0,key.indexOf(' '));
                }
                this.state.marks.push({
                    value: value,
                    label: label
                })
            }
        }
    }

    public render() {

        return(
            <div className="slider">
                {this.state.isLoaded ?
                    <Grid container spacing={1}>
                        <Grid item>
                            <IconButton aria-label="play-pause-replay" onClick={this.onPlayButtonClick}>
                                {this.state.isReplay?
                                    <ReplayIcon/>
                                    : this.checkIsPaused()
                                }
                            </IconButton>
                        </Grid>
                        <Grid item>
                            <IconButton aria-label="skipNext" onClick={this.onSkipPrevClick}>
                                <SkipPreviousIcon/>
                            </IconButton>
                        </Grid>
                        <Grid item>
                            <IconButton aria-label="skipNext" onClick={this.onSkipNextClick}>
                                <SkipNextIcon/>
                            </IconButton>
                        </Grid>
                        <Grid item xs aria-labelledby="continuous-slider">
                            <div>
                            <Slider className="marker"
                                min={0.0}
                                max={this.state.timeline.totalDuration()}
                                value={this.state.sliderValue}
                                marks={this.state.marks}
                                onChange={this.onSliderChange}
                                onChangeCommitted={this.onSliderCommitted}
                                valueLabelDisplay="auto"
                            /> </div>
                        </Grid>
                        <Grid item>
                            <p className="time">{this.timeConvert(this.state.timeline.time()) + " / " + this.timeConvert(this.state.timeline.totalDuration())}</p>
                        </Grid>

                    </Grid>
                    : null}
            </div>
        )
    }
}


export default AnimationController;

