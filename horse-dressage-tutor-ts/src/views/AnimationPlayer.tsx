/**
 * Creates the Animation Player with slider, buttons, and a title
 *
 * @author: Ga Jun Young, 16440714
 */

import React from 'react';
import {withStyles} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import CustomSlider from "../css/StylesWithJS/CustomSlider";
import AnimationPlayerStyles from "../css/StylesWithJS/AnimationPlayerStyles";
import AnimationButtons from "./AnimationButtons";
import {AnimationProps} from "../utils/defined/PropInterfaces";
import {AnimationState} from "../utils/defined/StateInterfaces";

class AnimationPlayer extends React.PureComponent<AnimationProps, AnimationState> {

    constructor(props: AnimationProps) {
        super(props);

        this.state = {
            isDraggablePaused: false,
            isReplayDisplayed: false,
            isToggled: false,
            totalTimestamp: '00:00',
            currTimestamp: '00:00',
            sliderValue: 0,
            marks: [],
        };

        // binding to enable 'this' to work in callbacks
        this.handleMainButtonClickCB = this.handleMainButtonClickCB.bind(this);
        this.handleSliderChangeCB = this.handleSliderChangeCB.bind(this);
        this.handleSliderCommittedCB = this.handleSliderCommittedCB.bind(this);
        this.handleHorseButtonToggleCB = this.handleHorseButtonToggleCB.bind(this);
    }

    componentDidMount(): void {
        this.setState({
            sliderValue: (this.props.timeline.progress() * this.props.timeline.totalDuration()),
            totalTimestamp: AnimationPlayer.convertTimeToString(this.props.timeline.totalDuration()),
            currTimestamp: AnimationPlayer.convertTimeToString(this.props.timeline.time())
        });

        this.generateMarks();
        this.props.timeline.play();
    }

    componentDidUpdate(prevProps: Readonly<AnimationProps>, prevState: Readonly<AnimationState>, snapshot?: any): void {
        if(prevProps.timeline !== this.props.timeline) { // update on timeline change
            this.setState({
                isDraggablePaused: false,
                isReplayDisplayed: false,
                isToggled: false,
                sliderValue: 0,
                totalTimestamp: AnimationPlayer.convertTimeToString(this.props.timeline.totalDuration()),
                currTimestamp: AnimationPlayer.convertTimeToString(this.props.timeline.time()),
                marks: [],
            });

            this.generateMarks();
        } else if(this.props.tick === -1) {
          this.setState({isToggled: false})
        } else if(prevProps.tick !== this.props.tick) { // update at each tick
            this.setState({
                sliderValue:  (this.props.timeline.progress() * this.props.timeline.totalDuration()),
                currTimestamp: AnimationPlayer.convertTimeToString(this.props.timeline.time())
            });

            if (this.props.timeline.progress() !== 1) {
                this.setState({isReplayDisplayed: false});
            } else {
                this.setState({isReplayDisplayed: true})
            }
        }
    }

    /**
     * generate marks for the slider
     */
    private generateMarks() {
        // Iterate through the timeline labels...
        for (let [key, value] of Object.entries(this.props.timeline.labels)) {
            let label = "";

            // extract the test number from the key
            if(!isNaN(parseInt(key.substr(0,key.indexOf(' '))))){
                label = key.substr(0,key.indexOf(' '));
            }

            this.setState(prevState => ({
                marks: [...prevState.marks, {value: value, label: label}]
            }))
        }
    };

    /**
     * Time conversion of the timeline to minutes:seconds
     * @param time
     */
    private static convertTimeToString(time: number): string {
        const date = new Date(time * 1000);
        const minutes = date.getUTCMinutes();
        const seconds = date.getSeconds();
        return minutes.toString().padStart(2, '0') + ":" + seconds.toString().padStart(2, '0');
    };

    // ==================   Callback functions   ==================
    /**
     * When slider is pressed, pause the progress of the timeline
     * @param object : not used.
     * @param value
     */
    private handleSliderChangeCB(object, value: number) {
        this.setState({
            sliderValue: value,
            currTimestamp: AnimationPlayer.convertTimeToString(this.props.timeline.time())
        });
        this.props.timeline.progress(value / this.props.timeline.totalDuration());
        this.props.timeline.pause();
    };

    /**
     * Once the slider is released, set the value.
     * @param object : not used.
     * @param value
     */
    private handleSliderCommittedCB(object, value: number) {
        this.setState({
            sliderValue: value,
            currTimestamp: AnimationPlayer.convertTimeToString(this.props.timeline.time())
        });
        this.props.horseManager.pauseAnimation();

        if(!this.state.isDraggablePaused) // if the video was originally not paused...
            this.props.timeline.play();
    };

    /**
     * Depending on the main buttons current state {play, pause, replay},
     * the clicking of the button would carry a specific action based on current state.
     */
    private handleMainButtonClickCB() {
        if(!this.state.isReplayDisplayed) { // if replay is not available...
            if (!this.props.timeline.isActive()) { // if timeline is not active then a click would play the animation
                this.props.timeline.play();
                this.setState({isDraggablePaused: false});
            } else { // else pause timeline...
                this.props.timeline.pause();
                this.props.horseManager.pauseAnimation();
                this.setState({isDraggablePaused: true});
            }
        } else {
            this.props.timeline.progress(0); // restart
            this.props.horseManager.pauseAnimation();

            if(!this.state.isDraggablePaused) // if the video was originally not paused...
                this.props.timeline.play();
        }
    }


    /**
     * On click toggle perspective [scene, horse]
     */
    private handleHorseButtonToggleCB() {
        this.props.onToggleView();
        this.setState({isToggled: !this.state.isToggled})
    };

    render() {
        const {classes} = this.props;

        return (
            <div className={classes.root}>
                <Grid container justify="center">
                    <Grid item xs={11}>
                        <CustomSlider
                            min={0.0}
                            max={this.props.timeline.totalDuration()}
                            value={this.state.sliderValue}
                            marks={this.state.marks}
                            onChange={this.handleSliderChangeCB}
                            onChangeCommitted={this.handleSliderCommittedCB}
                            aria-label="continuous-slider"
                        />
                    </Grid>
                </Grid>

                <Grid container justify="center">
                    <Grid item xs={5}>
                        <Grid container alignItems="center">
                            <Grid item>
                                <AnimationButtons classes={classes}  isReplayDisplayed={this.state.isReplayDisplayed}
                                                  timeline={this.props.timeline} isToggled={this.state.isToggled}
                                                  horseManager={this.props.horseManager} isDraggablePaused={this.state.isDraggablePaused}
                                                  onHorseButtonToggle={this.handleHorseButtonToggleCB}
                                                  onMainButtonClick={this.handleMainButtonClickCB}/>
                            </Grid>
                            <Grid item>
                                <p className={classes.time}>{this.state.currTimestamp + " / " + this.state.totalTimestamp}</p>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={6}>
                        <p className={classes.dressageName}>{this.props.dressageTitle}</p>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default withStyles(AnimationPlayerStyles)(AnimationPlayer);
