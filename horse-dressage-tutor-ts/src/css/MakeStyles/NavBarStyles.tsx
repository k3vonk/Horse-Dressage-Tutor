/**
 * Style for the navigation bar
 *
 * @author: Ga Jun Young
 */

import {makeStyles} from "@material-ui/core/styles";
import {createStyles, Theme} from "@material-ui/core";

const drawerWidthAt600px = 240;
const drawerWidthAt1000px = 300;
const appBarHeightBelow600px = 75;
const appBarHeight = 60;

export const NavBarStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
            height: '10vh',
            position: 'relative',
        },
        appBar: {
            position: 'static',
            height: appBarHeightBelow600px,
            background: 'rgba(67, 67, 67, 0.5)',
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),

            '@media (min-width: 600px)': {
                height: appBarHeight
            },
        },
        appBarShift: {
            width: `calc(100% - ${drawerWidthAt600px}px)`,
            marginLeft: drawerWidthAt600px,
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            '@media (min-width: 600px)': {
                width: `calc(100% - ${drawerWidthAt600px}px)`,
                marginLeft: drawerWidthAt600px,
            },
            '@media (min-width: 1000px)': {
                width: `calc(100% - ${drawerWidthAt1000px}px)`,
                marginLeft: drawerWidthAt1000px,
            },
        },
        hide: {
            display: 'none',
        },
        menuButton: {
            justifySelf: 'flex-start',
            padding: 30,
            '@media (min-width: 600px)': {
                paddingLeft: 20,
            },
        },
        title: {
            flexGrow: 1,
            textAlign: 'center',
            padding: 10,
            '@media (min-width: 600px)': {
                padding: 0,
            },
        },
        drawer: {
            width: drawerWidthAt600px,
            flexShrink: 0,
            '@media (min-width: 600px)': {
                width: drawerWidthAt600px,
            },
            '@media (min-width: 1000px)': {
                width: drawerWidthAt1000px,
            },
        },
        paper: {
            position: 'absolute',
            height: '30vh',
            width: drawerWidthAt600px,
            background: 'rgba(67, 67, 67, 0.3)',
            color: 'white',
            '@media (min-width: 600px)': {
                width: drawerWidthAt600px,
                height: '30vh'
            },
            '@media (min-width: 1000px)': {
                width: drawerWidthAt1000px,
                height: '35vh'
            },
            '@media (min-width: 1200px)': {
                height: '40vh'
            },
            '@media (min-width: 1400px)': {
                height: '55vh'
            },
        },
        backContainer: {
            display: 'flex',
            background: '#D7E0E9',
            height: appBarHeight,
            '@media (min-width: 1000px)': {
                position:"fixed",
                width: drawerWidthAt1000px - 17,
                overflow: 'hidden',
            },
        },
        backButton: {
            width: '100%',
            borderRadius: 0,
            paddingBottom: 50,

        },
        backText: {
            textAlign: 'left',
        },
        divider: {
            '@media (min-width: 1000px)': {
                paddingTop: appBarHeight,
            },
        },
        currItem: {
            width: '100%',
            padding: 5,
            textAlign: 'center',
            background: 'rgba(150,64,0, 0.5)',
        },
        activeItem: {
            padding: 5,
            textAlign: 'center',
            background: 'rgba(1,50,32, 0.5)',
        },
        item: {
            padding: 5,
            textAlign: 'center',
        },
        icon: {
            top: 100
        },
        itemButton: {
            background: 'none',
            color: 'inherit',
            border: 'none',
            padding: 0,
            font: 'inherit',
            cursor: 'pointer',
            outline: 'inherit',
        }
    }),
);
