/**
 * Style for the navigation bar (CSS-IN-JS)
 *
 * @author: Ga Jun Young, 16440714
 */

import {createStyles, Theme} from "@material-ui/core";
import {NAVBAR_HEIGHT} from "../../utils/defined/Constants";

const drawerWidthAt600px = 240;
const drawerWidthAt1000px = 300;
const appBarHeightBelow600px = 75;
const appBarHeight = 60;

const NavBarStyles = (theme: Theme) => createStyles({
        root: {
            flexGrow: 1,
            height: NAVBAR_HEIGHT,
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

            '@media (min-width: 500px)': {
                height: appBarHeight
            },
        },
        appBarShift: {
            width: `calc(100% - 100%)`,
            marginLeft: drawerWidthAt600px,
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            '@media (min-width: 500px)': {
                width: `calc(100% - ${drawerWidthAt600px}px)`,
                marginLeft: drawerWidthAt600px,
            },
            '@media (min-width: 1000px)': {
                width: `calc(100% - ${drawerWidthAt1000px}px)`,
                marginLeft: drawerWidthAt1000px,
            },
        },
        appBarShiftRight: {
            width: `calc(100% - 100%)`,
            marginRight: drawerWidthAt600px,
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            '@media (min-width: 500px)': {
                width: `calc(100% - ${drawerWidthAt600px}px)`,
                marginRight: drawerWidthAt600px,
            },
            '@media (min-width: 1000px)': {
                width: `calc(100% - ${drawerWidthAt1000px}px)`,
                marginRight: drawerWidthAt1000px,
            },
        },
        toolbar: {
            height: appBarHeightBelow600px,
            '@media (min-width: 500px)': {
                height: appBarHeight
            },
        },
        hideTitle: {
            '@media only screen and (max-width: 499px)':{
                display: 'none',
            },
        },
        hide: {
            display: 'none',
        },
        menuButton: {
            justifySelf: 'flex-start',
            border: '2px solid transparent',
            borderRadius: 0,
            padding: 10,
        },
        title: {
            flexGrow: 1,
            textAlign: 'center',
            '@media (min-width: 300px)': {
                fontSize: '0.8em',
                fontWeight: 'bold',
            },
            '@media (min-width: 800px)': {
                fontSize: '1em',
            }
        },
        drawer: {
            flexShrink: 0,
        },
        paper: {
            position: 'absolute',
            height: '30vh',
            width: '99.5%',
            background: 'rgba(67, 67, 67, 0.3)',
            color: 'white',
            '@media (min-width: 500px)': {
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
                height: '80vh'
            },
        },
        backContainer: {
            display: 'flex',
            background: '#D7E0E9',
            height: appBarHeightBelow600px,
            '@media (min-width: 500px)': {
               height: appBarHeight
            },
        },
        backButton: {
            width: '100%',
            borderRadius: 0,
            paddingTop: 10,
            paddingBottom: 10,
        },
        backText: {
            textAlign: 'left',
        },
        divider: {
        },
        currItem: {
            padding: 10,
            textAlign: 'center',
            background: 'rgba(150,64,0, 0.5)',
        },
        activeItem: {
            padding: 10,
            textAlign: 'center',
            background: 'rgba(1,50,32, 0.5)',
        },
        item: {
            padding: 10,
            textAlign: 'center',
        },
        icon: {
           top: 100
        },
        itemButton: {
            width: '100%',
            background: 'none',
            color: 'inherit',
            border: 'none',
            padding: 0,
            font: 'inherit',
            cursor: 'pointer',
            outline: 'inherit',

            '&:active': {
                background: 'rgba(255,255,255,0.3)',
            }
        },
        animationSlider: {
            '@media (min-width: 300px)': {
                width: '90%'
            },
            '@media (min-width: 500px)': {
                width: '80%'
            },
        }
    });

export default NavBarStyles;
