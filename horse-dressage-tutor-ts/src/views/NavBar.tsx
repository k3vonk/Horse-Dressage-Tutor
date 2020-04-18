/**
 * Navigation Bar : draws the navigation app bar and the drawer of items
 *
 * @author: Ga Jun Young, 16440714
 */
import React, {useEffect, useState} from "react";
import {AppBar, Drawer, Grid, IconButton, ListItemText, Toolbar, Typography,} from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';
import {NavBarStyles} from "../css/MakeStyles/NavBarStyles";
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import CheckIcon from '@material-ui/icons/Check';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import Divider from '@material-ui/core/Divider';
import clsx from 'clsx';
import {Label, NavBarProps} from "../utils/types";

export const NavBar: React.FC<NavBarProps> = (props) => {
    const classes = NavBarStyles();
    const [open, setOpen] = useState(false);
    const [labels, setLabels] = useState<Label[]>([]);

    // init - setup labels
    useEffect(()=> {
        if (labels.length === 0) {
            let labels: Label[] = [];
            for (let [key, value] of Object.entries(props.timeline.labels)) {
                labels.push({
                    text: key,
                    progress: value
                });
            }
            setLabels(labels);
        }

    }, [labels.length, props.timeline.labels]);

    /**
     * Open drawer
     */
    const handleDrawerOpen = () => { setOpen(true); };

    /**
     * Close drawer
     */
    const handleDrawerClose = () => { setOpen(false); };

    /**
     * Set the progress of the horse to the label.
     * @param label
     */
    const handleListItem = (label: Label) => {
        props.timeline.seek(label.progress + 0.0001, false);
        if(!props.timeline.isActive()) {
            props.horseManager.pauseMixer();
        }
    };

    /**
     * Draw the label that is completed
     * @param label
     */
    function drawCompleted(label: Label) {
        return <Grid container
                     direction="row"
                     justify="center"
                     alignItems="center"
                     className={classes.currItem}>
            <Grid item xs={3}><PlayArrowIcon/></Grid>
            <Grid item xs={9}><h5>{label.text}</h5></Grid>
        </Grid>;
    }

    /**
     * Draw the label that is currently active
     * @param label
     */
    function drawCurrent(label: Label) {
        return <Grid container
                     direction="row"
                     justify="center"
                     alignItems="center"
                     className={classes.activeItem}>
            <Grid item xs={3}><CheckIcon/></Grid>
            <Grid item xs={9}><h5>{label.text}</h5></Grid>
        </Grid>;
    }

    /**
     * Draw the activated label which can be a completed or current label
     * @param label
     */
    function drawActivated(label: Label) {
        return <>
            {props.timeline.currentLabel() === label.text ?
                drawCompleted(label) : drawCurrent(label)
            }
        </>;
    }


    /**
     * Draw in-active label
     * @param label
     */
    function drawInActive(label: Label) {
        return <Grid container
                     direction="row"
                     justify="center"
                     alignItems="center"
                     className={classes.item}>
            <Grid item xs={3}><HourglassEmptyIcon/></Grid>
            <Grid item xs={9}><h5>{label.text}</h5></Grid>
        </Grid>;
    }

    /**
     * Draw a list of completed, current, inactive labels
     */
    function drawerList() {
        return (
            labels.map((label, index) => (
                    <React.Fragment key={index}>
                        {props.progress > label.progress?
                            <button className={classes.itemButton} onClick={() => handleListItem(label)}>
                                {drawActivated(label)}
                            </button>:
                            <button
                                className={classes.itemButton}
                                onClick={() => handleListItem(label)}>
                                {drawInActive(label)}
                            </button>
                        }
                    </React.Fragment>
                ))
        )
    }

    /**
     * Draw the app bar's tools
     */
    function drawToolbar() {
        return <Toolbar
            className={classes.toolbar}
            id='back-to-top-anchor'>
            <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                className={clsx(classes.menuButton, open && classes.hide)}
            >
                <MenuIcon/>
            </IconButton>
            <Typography className={clsx(classes.title, open && classes.hideTitle)} variant="subtitle1"
                        aria-label="dressage step">{props.timeline.currentLabel()}</Typography>
        </Toolbar>;
    }

    /**
     * Draw the back button
     */
    function drawBackButton() {
        return <div className={classes.backContainer}>
            <IconButton
                className={classes.backButton}
                onClick={handleDrawerClose}
                aria-label="close drawer"
            >
                <ChevronLeftIcon/>
                <ListItemText className={classes.backText} primary={"Back"}/>
            </IconButton>
        </div>;
    }

    return (
        <div className={classes.root}>
            <AppBar
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}>
                {drawToolbar()}
            </AppBar>

            <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="left"
                open={open}
                classes={{
                    paper: classes.paper,
                }}>
                {drawBackButton()}
                <Divider className={classes.divider}/>
                {drawerList()}
            </Drawer>
        </div>
    );
};

/*

            <ScrollToTopZoom {...props}>
                <Fab color="secondary" size="small" aria-label="scroll back to top">
                    <KeyboardArrowUpIcon />
                </Fab>
            </ScrollToTopZoom>
 */
