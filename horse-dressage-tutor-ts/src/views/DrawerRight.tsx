/**
 * Renders the right drawer. Contains settings, and switching of dressage sheets
 *
 * @author: Ga Jun Young, 16440714
 */

import React from "react";
import {Divider, Drawer, Grid, IconButton, ListItemText} from "@material-ui/core";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import StreetviewIcon from '@material-ui/icons/Streetview';
import clsx from "clsx";
import {DrawerRightProps} from "../utils/defined/PropInterfaces";

class DrawerRight extends React.PureComponent<DrawerRightProps> {

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

    render() {
        const {classes} = this.props;
        return (
            <Drawer
                variant="persistent"
                anchor="right"
                open={this.props.open}
                classes={{ paper: classes.paper }}
            >
                <div>
                {this.drawBackButton()}
                </div>
                <Divider className={classes.divider}/>
                {this.drawList()}
                <Divider/>
                <div>
                    <button className={classes.itemButton} onClick={()=>this.props.onResetView()}>
                        <Grid container
                              justify="center"
                              alignItems="center"
                              className={classes.item}>
                            <Grid item xs={3}><h5><StreetviewIcon/></h5></Grid>
                            <Grid item xs={9}><h5>Reset View</h5></Grid>
                        </Grid>
                    </button>
                </div>
            </Drawer>
        )
    }
}

export default DrawerRight;
