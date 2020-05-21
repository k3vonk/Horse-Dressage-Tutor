/**
 * Navigation Bar : draws the navigation app bar with two hamburgers and corresponding drawers.
 *
 * @author: Ga Jun Young, 16440714
 */
import React from "react";
import {AppBar, withStyles,} from "@material-ui/core";
import NavBarStyles from "../css/StylesWithJS/NavBarStyles";
import clsx from 'clsx';
import DrawerLeft from "./DrawerLeft";
import DrawerRight from "./DrawerRight";
import CustomToolbar from "./CustomToolbar";
import {NavBarStates} from "../utils/defined/StateInterfaces";
import {NavBarProps} from "../utils/defined/PropInterfaces";

class NavBar extends React.PureComponent<NavBarProps, NavBarStates> {

    constructor(props: NavBarProps) {
        super(props);

        this.state = {
            isLeftOpen: false,
            isRightOpen: false,
            currTimestamp: 0,
            title: props.timeline.currentLabel()
        };

        // bind functions for callback usage of 'this'
        this.handleDrawerLeftOpenCB = this.handleDrawerLeftOpenCB.bind(this);
        this.handleDrawerRightOpenCB = this.handleDrawerRightOpenCB.bind(this);
        this.handleDrawerLeftCloseCB = this.handleDrawerLeftCloseCB.bind(this);
        this.handleDrawerRightCloseCB= this.handleDrawerRightCloseCB.bind(this);
        this.handleChangeDressageSheetCB = this.handleChangeDressageSheetCB.bind(this);
    }

    componentDidUpdate(prevProps: Readonly<NavBarProps>, prevState: Readonly<NavBarStates>, snapshot?: any): void {
        if(prevProps.time !== this.props.time) {
            this.setState({
                currTimestamp: this.props.timeline.progress() * this.props.timeline.totalDuration()
            });

            if(this.state.title !== this.props.timeline.currentLabel()) {
                this.setState({title: this.props.timeline.currentLabel()})
            }
        }
    }

    // ==================   Callback functions   ==================
    /**
     * Given the index of the dressage sheet, change the dressage sheet and reset navbar state
     * @param index
     */
    handleChangeDressageSheetCB(index: number){
        this.props.onChangeDressageSheet(index);
        this.setState( {
            isLeftOpen: false,
            isRightOpen: false,
            currTimestamp: 0,
            title: this.props.timeline.currentLabel()
        });
    }

    handleDrawerLeftOpenCB() {
        this.setState({
            isLeftOpen: true,
            isRightOpen: false,
        })
    }

    handleDrawerRightOpenCB() {
        this.setState({
            isLeftOpen: false,
            isRightOpen: true
        })
    }

    handleDrawerLeftCloseCB() {
        this.setState({isLeftOpen: false})
    }

    handleDrawerRightCloseCB() {
        this.setState({isRightOpen: false})
    }

    render() {
        const {classes} = this.props;
        return (
            <div  className={classes.root}>
                <AppBar
                    className={clsx(classes.appBar, {
                        [classes.appBarShift]: this.state.isLeftOpen,
                        [classes.appBarShiftRight]: this.state.isRightOpen,
                    })}
                >
                    <CustomToolbar classes={classes} leftOpen={this.state.isLeftOpen}
                                   rightOpen={this.state.isRightOpen} title={this.state.title}
                                   onDrawerLeftOpen={this.handleDrawerLeftOpenCB}
                                   onDrawerRightOpen={this.handleDrawerRightOpenCB}/>
                </AppBar>

                {this.state.isLeftOpen &&
                <DrawerLeft currTimestamp={this.state.currTimestamp}
                            horseManager={this.props.horseManager}
                            timeline={this.props.timeline}
                            title={this.state.title}
                            open={this.state.isLeftOpen}
                            onDrawerClose={this.handleDrawerLeftCloseCB}
                />}

                {this.state.isRightOpen &&
                    <DrawerRight classes={classes}
                                 open={this.state.isRightOpen}
                                 currentSheet={this.props.currentSheetName}
                                 dressageSheets={this.props.dressageJsonSheets}
                                 onDrawerClose={this.handleDrawerRightCloseCB}
                                 onChangeDressageSheet={this.handleChangeDressageSheetCB}
                                 onResetView={this.props.onResetView}
                    />
                }
            </div>
        )
    }
}

export default withStyles(NavBarStyles)(NavBar);
