/**
 * Navigation Bar : draws the navigation app bar and the drawer of items
 *
 * @author: Ga Jun Young, 16440714
 */
import React from "react";
import {
    AppBar,
    IconButton,
    Toolbar,
    Typography,
    withStyles,
    WithStyles,
} from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';
import SettingsIcon from '@material-ui/icons/Settings';
import NavBarStyles from "../css/MakeStyles/NavBarStyles";
import clsx from 'clsx';
import {DressageTest, Label} from "../utils/types";
import HorseManager from "../components/HorseManager";
import DrawerLeft from "./DrawerLeft";
import DrawerRight from "./DrawerRight";


interface NavBarProps extends WithStyles<typeof NavBarStyles>{
    currentSheet: string,
    dressageSheets: DressageTest[],
    timeline: GSAPTimeline,
    horseManager: HorseManager,
    changeDressageFunction: (index:number) => void,
    handleResetView: () =>void,
}

interface NavBarStates {
    leftOpen: boolean,
    rightOpen: boolean,
    waitPeriod: number,
    lastTimeScrolled: number,
    progress: number,
    title: string,
    labels: Label[],
}


class NavBar extends React.Component<NavBarProps, NavBarStates> {

    private interval;
    constructor(props: NavBarProps) {
        super(props);

        this.state = {
            leftOpen: false,
            rightOpen: false,
            waitPeriod: 800,
            lastTimeScrolled: Date.now(),
            progress: 0,
            title: props.timeline.currentLabel(),
            labels: null,
        };

        // bind functions for callback usage of 'this'
        this.tick = this.tick.bind(this);
        this.handleDrawerLeftOpen = this.handleDrawerLeftOpen.bind(this);
        this.handleDrawerRightOpen = this.handleDrawerRightOpen.bind(this);
        this.handleDrawerLeftClose = this.handleDrawerLeftClose.bind(this);
        this.handleDrawerRightClose= this.handleDrawerRightClose.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.reloadNavBar = this.reloadNavBar.bind(this);
    }

    componentDidMount(): void {
        this.interval = setInterval(() => this.tick(), 1000);
    }

    componentWillUnmount(): void {
        clearInterval(this.interval);
    }

    reloadNavBar(index: number){
        this.props.changeDressageFunction(index);
        this.setState( {
            leftOpen: false,
            rightOpen: false,
            waitPeriod: 800,
            lastTimeScrolled: Date.now(),
            progress: 0,
            title: this.props.timeline.currentLabel(),
            labels: null,
        });
    }
    // ============== Callback functions
    /**
     * ticker to update a component
     */
    tick() {
        this.setState({
            progress: this.props.timeline.progress() * this.props.timeline.totalDuration()
        });

        if(this.state.title !== this.props.timeline.currentLabel()) {
            this.setState({title: this.props.timeline.currentLabel()})
        }
    };

    handleDrawerLeftOpen() {
        this.setState({
            leftOpen: true,
            rightOpen: false,
        })
    }

    handleDrawerRightOpen() {
        this.setState({
            leftOpen: false,
            rightOpen: true
        })
    }

    handleDrawerLeftClose() {
        this.setState({leftOpen: false})
    }

    handleDrawerRightClose() {
        this.setState({rightOpen: false})
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


    // =============== Drawable components
    /**
     * Draw the app bar's tools
     */
    drawToolbar() {
        const {classes} = this.props;
        return <Toolbar
                className={classes.toolbar}
        >
            <IconButton
                color={"inherit"}
                aria-label="open drawer right"
                edge={"start"}
                onClick={this.handleDrawerLeftOpen}
                className={clsx(classes.menuButton, this.state.leftOpen && classes.hide, this.state.rightOpen && classes.hideTitle)}
            >
                <MenuIcon/>
            </IconButton>
            <Typography
                className={clsx(classes.title, (this.state.leftOpen || this.state.rightOpen) && classes.hideTitle)}
                variant={"subtitle1"}
                aria-label="current dressage step">
                {this.state.title}
            </Typography>

            <IconButton
                color={"inherit"}
                aria-label="open drawer right"
                edge={"end"}
                onClick={this.handleDrawerRightOpen}
                className={clsx(classes.menuButton, this.state.rightOpen && classes.hide, this.state.leftOpen && classes.hideTitle)}
            >
                <SettingsIcon/>
            </IconButton>
        </Toolbar>
    }

    render() {
        const {classes} = this.props;
        return (
            <div  className={classes.root}>
                <AppBar
                    className={clsx(classes.appBar, {
                        [classes.appBarShift]: this.state.leftOpen,
                        [classes.appBarShiftRight]: this.state.rightOpen,
                    })}
                >
                    {this.drawToolbar()}
                </AppBar>

                {this.state.leftOpen &&
                <DrawerLeft progress={this.state.progress}
                            horseManager={this.props.horseManager}
                            timeline={this.props.timeline}
                            title={this.state.title}
                            open={this.state.leftOpen}
                            handleDrawerClose={this.handleDrawerLeftClose}
                />}

                {this.state.rightOpen &&
                    <DrawerRight classes={classes}
                                 open={this.state.rightOpen}
                                 currentSheet={this.props.currentSheet}
                                 dressageSheets={this.props.dressageSheets}
                                 handleDrawerClose={this.handleDrawerRightClose}
                                 changeDressageFunction={this.reloadNavBar}
                                 handleResetView={this.props.handleResetView}
                    />
                }
            </div>
        )
    }
}

export default withStyles(NavBarStyles)(NavBar);
