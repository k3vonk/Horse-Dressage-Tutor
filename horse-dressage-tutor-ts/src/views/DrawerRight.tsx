import React from "react";
import {Divider, Drawer, Grid, IconButton, ListItemText, WithStyles} from "@material-ui/core";
import NavBarStyles from "../css/MakeStyles/NavBarStyles";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import StreetviewIcon from '@material-ui/icons/Streetview';
import {DressageTest} from "../utils/types";
import clsx from "clsx";

interface DrawerRightProps extends WithStyles<typeof NavBarStyles>{
    open: boolean,
    currentSheet: string,
    dressageSheets: DressageTest[],
    handleDrawerClose: () => void,
    changeDressageFunction: (index: number) =>void,
    handleResetView: ()=>void,
}

class DrawerRight extends React.PureComponent<DrawerRightProps> {

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

    /**
     * Draw a list of completed, current, inactive labels
     */
    drawList() {
        const {classes} = this.props;
        return (
           this.props.dressageSheets.map((test, index) => (
                <div key={index} >
                    <button className={classes.itemButton} onClick={() => this.props.changeDressageFunction(index)}>
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
                {this.drawBackButton()}
                <Divider className={classes.divider}/>
                {this.drawList()}
                <Divider/>
                <button className={classes.itemButton} onClick={()=>this.props.handleResetView()}>
                    <Grid container
                          justify="center"
                          alignItems="center"
                          className={classes.item}>
                        <Grid item xs={3}><h5><StreetviewIcon/></h5></Grid>
                        <Grid item xs={9}><h5>Reset View</h5></Grid>
                    </Grid>
                </button>
            </Drawer>
        )
    }
}

export default DrawerRight;
