/**
 * LoadingPage : a functional component that holds the skeleton display to ease the loading effect
 *
 * @author: Ga Jun Young, 16440714
 */

import React from "react";
import Skeleton from '@material-ui/lab/Skeleton';
import LoadingPageStyle from "../css/StylesWithJS/LoadingPageStyle";

const LoadingPage: React.FC = () =>{
    const classes = LoadingPageStyle();

    /**
     * Given a React element, generate the element 3 times.
     * @source https://codesandbox.io/s/ueb66?file=/demo.tsx:1200-1349
     * @param element
     */
    function generate(element: React.ReactElement) {
        return [0, 1, 2].map((value) =>
            React.cloneElement(element, {
                key: value,
            }),
        );
    }

    return (
        <div className={classes.root}>
            <Skeleton className={classes.navBar} animation="wave" variant="rect" />
            {generate(<Skeleton />)}
            <Skeleton className={classes.animationPlayer} animation="wave" variant="rect" />
        </div>
    );
};

export default LoadingPage;
