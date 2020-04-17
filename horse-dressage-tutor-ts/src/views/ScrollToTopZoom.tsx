/**
 * Based on: https://codesandbox.io/s/c503m?file=/demo.tsx
 * A demo of using zoom on AppBar
 */

import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import {createStyles, Theme, useScrollTrigger, Zoom} from "@material-ui/core";

interface Props {
    children: React.ReactElement;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            position: 'fixed',
            bottom: theme.spacing(2),
            right: theme.spacing(2),
            zIndex: 2,
        },
    }),
);

export default function ScrollToTopZoom(props: Props) {
    const {children} = props;
    const classes = useStyles();
    const trigger = useScrollTrigger();

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        const anchor = ((event.target as HTMLDivElement).ownerDocument || document).querySelector(
            '#back-to-top-anchor',
        );

        if (anchor) {
            anchor.scrollIntoView({behavior: 'smooth', block: 'center'});
        }
    };

    return (
        <React.Fragment>
            <Zoom in={trigger}>
                <div onClick={handleClick} role="presentation" className={classes.root}>
                    {children}
                </div>
            </Zoom>
        </React.Fragment>
    );
}
