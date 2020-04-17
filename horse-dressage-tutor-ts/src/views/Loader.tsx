/**
 * Loader class : use of skeleton to ease loading effect
 *
 * @author: Ga Jun Young
 */

import React from "react";
import Skeleton from '@material-ui/lab/Skeleton';
import LoaderStyles from "../css/MakeStyles/LoaderStyles";

function Loader() {
    const classes = LoaderStyles();
    return (
        <div className={classes.root}>
            <Skeleton className={classes.navBar} animation="wave" variant="rect" />
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton className={classes.animationController} animation="wave" variant="rect" />
        </div>
    );
}

export default Loader;
