/**
 * A component that creates animation player buttons
 *
 * @author: Ga Jun Young, 16440714
 */
import React from "react";
import IconButton from "@material-ui/core/IconButton";
import SkipPreviousIcon from "@material-ui/icons/SkipPrevious";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import clsx from "clsx";
import ReplayIcon from "@material-ui/icons/Replay";
import PauseIcon from "@material-ui/icons/Pause";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import {HorseIcon} from "./HorseIcon";
import {AnimationButtonsProps} from "../utils/defined/PropInterfaces";

export default class AnimationButtons extends React.Component<AnimationButtonsProps> {

    constructor(props: Readonly<AnimationButtonsProps>) {
        super(props);

        this.handleSkipPrevClickCB = this.handleSkipPrevClickCB.bind(this);
        this.handleSkipNextClickCB = this.handleSkipNextClickCB.bind(this);
    }
    /**
     * Return the appropriate action icon depending on the status of the timeline bar
     */
    private actionIcon() {
        if(this.props.isReplayDisplayed)
            return <ReplayIcon/>;

        if(this.props.timeline.isActive())
            return <PauseIcon/>;

        return <PlayArrowIcon/>;
    }

    /**
     * On click, seek the previous timeline label and skip to that label
     */
    private handleSkipPrevClickCB() {
        if(this.props.timeline.progress() !== 0) { // disallow skipping backwards when progress is 0.
            let prevLabel = this.props.timeline.previousLabel();
            // @ts-ignore
            this.props.timeline.seek(prevLabel, false); // Gsap typescript definition and Gsap documents are currently different. But overload functionality is possible
            this.props.horseManager.pauseAnimation();

            if(!this.props.isDraggablePaused) // if the video was originally not paused...
                this.props.timeline.play();
        }
    };

    /**
     * On click, seek the next timeline label and skip to that label
     */
    private handleSkipNextClickCB() {
        let nextLabel = this.props.timeline.nextLabel();
        // @ts-ignore
        this.props.timeline.seek(nextLabel,false); // Gsap typescript definition and Gsap documents are currently different. But overload functionality is possible
        this.props.horseManager.pauseAnimation();

        if(!this.props.isDraggablePaused) // if the video was originally not paused...
            this.props.timeline.play();
    };

    render() {
        return <>
            <IconButton className={this.props.classes.iconButton} aria-label="play-pause-replay"
                        onClick={this.props.onMainButtonClick}>
                {this.actionIcon()}
            </IconButton>

            <IconButton className={this.props.classes.iconButton} aria-label="skipPrev"
                        onClick={this.handleSkipPrevClickCB}>
                <SkipPreviousIcon/>
            </IconButton>

            <IconButton className={this.props.classes.iconButton} aria-label="skipNext"
                        onClick={this.handleSkipNextClickCB}>
                <SkipNextIcon/>
            </IconButton>

            <IconButton className={clsx(this.props.classes.horseIcon, {
                [this.props.classes.activeHorseIcon]: this.props.isToggled,
            })} aria-label="resetView" onClick={this.props.onHorseButtonToggle}>
                <HorseIcon classes={this.props.classes}/>
            </IconButton>
        </>;
    }
}
