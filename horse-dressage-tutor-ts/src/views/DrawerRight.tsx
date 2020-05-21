/**
 * Renders the right drawer. Contains settings, and switching of dressage sheets
 *
 * @author: Ga Jun Young, 16440714
 */

import React from "react";
import {Divider, Drawer, Grid, IconButton, ListItemText, Slider, Typography} from "@material-ui/core";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import StreetviewIcon from '@material-ui/icons/Streetview';
import clsx from "clsx";
import {DrawerRightProps} from "../utils/defined/PropInterfaces";

class DrawerRight extends React.PureComponent<DrawerRightProps> {

    constructor(props) {
        super(props);

        this.handleAnimationSpeedChangeCB = this.handleAnimationSpeedChangeCB.bind(this);
        this.handleTimelineScaleChangeCB = this.handleTimelineScaleChangeCB.bind(this);
    }
    /**
     * Draw the back button
     */
   private drawBackButton() {
        const {classes} = this.props;
        return <div className={classes.backContainer}>
            <IconButton
                className={classes.backButton}
                onClick={this.props.onDrawerClose}
                aria-label="close drawer"
            >
                <ChevronLeftIcon/>
                <ListItemText className={classes.backText} primary={"Back"}/>
            </IconButton>
        </div>;
    }

    /**
     * Draw a list of dressage sheets. Small lists do not require memoization
     */
    private drawList() {
        const {classes} = this.props;
        return (
           this.props.dressageSheets.map((test, index) => (
                <div key={index} >
                    <button className={classes.itemButton} onClick={() => this.props.onChangeDressageSheet(index)}>
                        <Grid container
                              justify="center"
                              alignItems="center"
                              className={clsx(classes.item, {
                                      [classes.currItem]: this.props.currentSheet === test.name
                                  })}>
                            <Grid item xs={3}><h5>{index + 1}</h5></Grid>
                            <Grid item xs={9}><h5>{test.name}</h5></Grid>
                        </Grid>
                    </button>
                </div>
            ))
        )
    }

    /**
     * Configure the animation speed through the usage of a slider
     * @param classes - styling
     */
    private animationSpeedSetting(classes) {
        return <button className={classes.itemButton}>
            <Grid container
                  justify="center"
                  alignItems="center"
                  className={classes.item}>
                <Typography id="discrete-slider-small-steps" gutterBottom>
                    Animation Speed
                </Typography>
                <Slider
                    className={classes.animationSlider}
                    defaultValue={this.props.sceneManager.getAnimationSpeed()}
                    aria-labelledby="discrete-slider-small-steps"
                    step={0.0001}
                    marks
                    min={0.001}
                    max={0.01}
                    onChange={this.handleAnimationSpeedChangeCB}
                    valueLabelDisplay="auto"
                />
            </Grid>
        </button>;
    }

    /**
     * Configure the timeline scale, 1=Normal speed, 0.5=Half the normal speed, 2=Double normal speed
     * @param classes - styling
     */
    private playbackSpeedSetting(classes) {
        return <button className={classes.itemButton}>
            <Grid container
                  justify="center"
                  alignItems="center"
                  className={classes.item}>
                <Typography id="discrete-slider-small-steps" gutterBottom>
                    Playback Speed
                </Typography>
                <Slider
                    className={classes.animationSlider}
                    defaultValue={1}
                    aria-labelledby="discrete-slider-small-steps"
                    step={0.01}
                    marks
                    min={0.01}
                    max={2}
                    onChange={this.handleTimelineScaleChangeCB}
                    valueLabelDisplay="auto"
                />
            </Grid>
        </button>;
    }

    /**
     * A callback function that changes the animation speed
     * @param object - not used
     * @param value - the value of change
     */
    private handleAnimationSpeedChangeCB(object, value: number){
        this.props.sceneManager.setAnimationSpeed(value);
    }

    /**
     * A callback function that changes the timeline speed
     * @param object - not used
     * @param value
     */
    private handleTimelineScaleChangeCB(object, value: number) {
        this.props.timeline.timeScale(value);
    }

    render() {
        const {classes} = this.props;
        return (
            <Drawer
                variant="persistent"
                anchor="right"
                open={this.props.open}
                classes={{paper: classes.paper}}
            >
                <div>
                    {this.drawBackButton()}
                </div>
                <Divider className={classes.divider}/>
                {this.drawList()}
                <Divider/>
                <div>
                    <button className={classes.itemButton} onClick={() => this.props.onResetView()}>
                        <Grid container
                              justify="center"
                              alignItems="center"
                              className={classes.item}>
                            <Grid item xs={3}><h5><StreetviewIcon/></h5></Grid>
                            <Grid item xs={9}><h5>Reset View</h5></Grid>
                        </Grid>
                    </button>
                </div>
                <Divider/>
                <div>
                    {this.animationSpeedSetting(classes)}
                </div>
                <Divider/>
                <div>
                    {this.playbackSpeedSetting(classes)}
                </div>
            </Drawer>
        )
    }
}

export default DrawerRight;
