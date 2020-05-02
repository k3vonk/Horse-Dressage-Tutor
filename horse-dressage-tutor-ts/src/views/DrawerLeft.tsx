import React from "react";
import {Divider, Drawer, Grid, ListItemText, withStyles, WithStyles, IconButton} from "@material-ui/core";
import NavBarStyles from "../css/MakeStyles/NavBarStyles";
import clsx from 'clsx';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import CheckIcon from "@material-ui/icons/Check";
import HourglassEmptyIcon from "@material-ui/icons/HourglassEmpty";
import HorseManager from "../components/HorseManager";

interface DrawerLeftProps extends WithStyles<typeof NavBarStyles>{
    timeline: GSAPTimeline,
    horseManager: HorseManager,
    title: string,
    progress: number,
    open: boolean,
    handleDrawerClose: () => void,
}

interface DrawerStates {
    lastTimeScrolled: number,
    waitPeriod: number,
}

interface ListItemProps {
    classes: any,
    onClick: () => void,
    title: string,
    label: [string, number],
    progress: number,
    drawLabelIcon: any,
}
const ListItem = React.memo<ListItemProps>((props) => {
    return <button className={props.classes.itemButton} onClick={props.onClick}>
        <Grid container
              justify="center"
              alignItems="center"
              className={clsx(props.classes.item, {
                  [props.classes.currItem]: (props.title === props.label[0]),
                  [props.classes.activeItem]: (props.progress > props.label[1] &&
                      props.title !== props.label[0]),
              })}>
            <Grid item xs={3}>{props.drawLabelIcon}</Grid>
            <Grid item xs={9}><h5>{props.label[0]}</h5></Grid>
        </Grid>
    </button>;
});

class DrawerLeft extends React.PureComponent<DrawerLeftProps, DrawerStates> {

    constructor(props: DrawerLeftProps) {
        super(props);

        this.state = {
            lastTimeScrolled: Date.now(),
            waitPeriod: 800
        };

        this.handleScroll = this.handleScroll.bind(this);
    }

    /**
     * Set the progress of the horse to the label.
     * @param label
     */
    handleListItem(label: [string, number]) {
        this.props.timeline.seek(label[1] + 0.0001, false);
        if(!this.props.timeline.isActive()) {
            this.props.horseManager.pauseMixer();
        }
    };

    /**
     * Given an ID, scroll to that element
     * @param id
     */
    handleAutoScroll(id: number) {
        if(this.state.lastTimeScrolled < new Date().getTime() - this.state.waitPeriod ) {
            const elemToScrollTo = document.getElementById(id.toString());
            elemToScrollTo.scrollIntoView();
        }
    }

    /**
     * Handles scrolls - when scrolling set the auto scroll to a waiting period
     */
    handleScroll() {
        // last time user scrolled is 0.8s ago
        if(this.state.lastTimeScrolled < new Date().getTime() - 800 ) { this.setState({waitPeriod: 800})
        } else { this.setState({waitPeriod: 4000});} // else set a long wait
        this.setState({lastTimeScrolled: Date.now()});
    }

    /**
     * Draw the back button
     */
    drawBackButton() {
        const {classes} = this.props;
        return <div className={classes.backContainer}>
            <IconButton
                className={classes.backButton}
                onClick={this.props.handleDrawerClose}
                aria-label="close drawer"
            >
                <ChevronLeftIcon/>
                <ListItemText className={classes.backText} primary={"Back"}/>
            </IconButton>
        </div>;
    }

    drawLabelIcon(label: [string, number], index: number) {
        if (this.props.title === label[0]) {
            this.handleAutoScroll(index);
            return <PlayArrowIcon/>
        }

        if(this.props.progress > label[1]) {
            return <CheckIcon/>
        }

        return <HourglassEmptyIcon/>
    }

    /**
     * Draw a list of completed, current, inactive labels
     */
    drawList() {
        const {classes} = this.props;
        return (
            Object.entries(this.props.timeline.labels).map((label, index) => (
                <div key={index} id={index.toString()}>
                    <ListItem classes={classes} onClick={() => this.handleListItem(label)} title={this.props.title}
                                  label={label} progress={this.props.progress}
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
                onScroll={this.handleScroll}
            >
                {this.drawBackButton()}
                <Divider className={classes.divider}/>
                {this.drawList()}

            </Drawer>
        )
    }
}

export default withStyles(NavBarStyles)(DrawerLeft);
