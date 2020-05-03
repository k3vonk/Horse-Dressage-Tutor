/**
 * Renders the left drawer when the left hamburger is opened
 *
 * @author: Ga Jun Young, 16440714
 */

import React from "react";
import {Divider, Drawer, IconButton, ListItemText, withStyles} from "@material-ui/core";
import NavBarStyles from "../css/StylesWithJS/NavBarStyles";
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import CheckIcon from "@material-ui/icons/Check";
import HourglassEmptyIcon from "@material-ui/icons/HourglassEmpty";
import ListItem from "./ListItem";
import {DrawerLeftProps} from "../utils/defined/PropInterfaces";
import {DrawerStates} from "../utils/defined/StateInterfaces";

class DrawerLeft extends React.PureComponent<DrawerLeftProps, DrawerStates> {

    constructor(props: DrawerLeftProps) {
        super(props);

        this.state = {
            lastTimeScrolled: Date.now(),
            waitPeriod: 800
        };

        this.handleOnScrollCB = this.handleOnScrollCB.bind(this);
    }

    /**
     * Set the progress of the horse to the label.
     * @param label
     */
    private seekLabel(label: [string, number]) {
        this.props.timeline.seek(label[1] + 0.0001, false);
        if(!this.props.timeline.isActive()) {
            this.props.horseManager.pauseAnimation();
        }
    };

    /**
     * Given an ID, scroll to that element
     * @param id
     */
    private autoScroll(id: number) {
        if(this.state.lastTimeScrolled < new Date().getTime() - this.state.waitPeriod ) {
            const elemToScrollTo = document.getElementById(id.toString());
            elemToScrollTo.scrollIntoView();
        }
    }

    // ================= callback function ============= //
    /**
     * Reset a waiting timer on-scroll for auto-scroll to be enabled
     */
    private handleOnScrollCB() {
        // last time user scrolled is 0.8s ago
        if(this.state.lastTimeScrolled < new Date().getTime() - 800 ) { this.setState({waitPeriod: 800})
        } else { this.setState({waitPeriod: 4000});} // else set a long wait
        this.setState({lastTimeScrolled: Date.now()});
    }


    // ================= draw simple components ============= //
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
     * Draw an icon for a specific label depending on the label's value
     * @param labels : labels on the timeline
     * @param ID : id tag of the element
     */
    private drawLabelIcon(labels: [string, number], ID: number) {
        if (this.props.title === labels[0]) {
            this.autoScroll(ID);
            return <PlayArrowIcon/>
        }

        if(this.props.currTimestamp > labels[1]) {
            return <CheckIcon/>
        }

        return <HourglassEmptyIcon/>
    }

    /**
     * Draw a list of completed, current, inactive labels
     */
    private drawList() {
        const {classes} = this.props;
        return (
            Object.entries(this.props.timeline.labels).map((label, index) => (
                <div key={index} id={index.toString()}>
                    <ListItem classes={classes} onButtonClick={() => this.seekLabel(label)} title={this.props.title}
                              label={label} currTimestamp={this.props.currTimestamp}
                              drawLabelIcon={this.drawLabelIcon(label, index)}/>
                </div>
            ))
        )
    }


    render() {
        const {classes} = this.props;
        return(
            <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="left"
                open={this.props.open}
                classes={{ paper: classes.paper }}
                onScroll={this.handleOnScrollCB}
            >
                <div>
                {this.drawBackButton()}
                </div>
                <Divider className={classes.divider}/>
                {this.drawList()}

            </Drawer>
        )
    }
}

export default withStyles(NavBarStyles)(DrawerLeft);
