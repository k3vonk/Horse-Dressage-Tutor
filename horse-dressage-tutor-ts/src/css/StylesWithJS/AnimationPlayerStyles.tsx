/**
 * Creates the CSS-IN-JS styles for the AnimationPlayer component
 *
 * @author: Ga Jun Young, 16440714
 */

import {createStyles} from "@material-ui/core";

const AnimationPlayerStyles = () => createStyles({
        root: {
            position: 'absolute',
            width: '100%',
            bottom: '0%',
            background: 'rgba(0,0,0,0.5)',
        },
        dressageName: {
            color: 'rgba(255,255,255,0.6)',
            textAlign: "right",
            fontSize: '1.0em',
            fontWeight: 'bold',

            '@media (min-width: 300px)': {
                margin: 8,
            },
            '@media (min-width: 500px)': {
                margin: '10px 8px 15px',
                fontSize: '1.0em',
            },
            '@media (min-width: 800px)': {
                fontSize: '1.5em',
            }
        },
        time: {
            textAlign: "center",
            color: '#ffffff',
            fontSize: '0.8em',
            fontWeight: 'bold',
            '@media (min-width: 300px)': {
                margin: '5px 5px 8px',
            },
            '@media (min-width: 500px)': {
                fontSize: '0.8em',
                margin: 10.6,
            },
            '@media (min-width: 800px)': {
                fontSize: '1.1em',
            }
        },
        iconButton: {
            color: 'rgba(255,255,255,0.6)',
            border: '2px solid transparent',
            borderRadius: 0,
            padding: 0,
            '&:focus, &:hover, &:active': {
                color: 'rgba(255,255,255,1)',
            },
            '&:focus, &:active': {
                border: '2px solid #1699b9',
            },

            '@media (min-width: 500px)': {
                padding: 0,
            },
            '@media (min-width: 800px)': {
                padding: 12,
            }
        },
        activeHorseIcon: {
            color: 'rgba(255,255,255,1) !important',
        },
        horseIcon: {
            color: 'rgba(255,255,255,0.6)',
            border: '2px solid transparent',
            borderRadius: 0,
            padding: 0,
            '&:hover': {
                color: 'rgba(255,255,255,0.8)',
            },
            '@media (min-width: 500px)': {
                padding: 0,
            },
            '@media (min-width: 800px)': {
                padding: 12,
            }
        },
        svg: {
            height: '20px',
            width: '20px',
        },
        titleBtn: {
            borderRadius: 0,
            color: 'rgba(255,255,255,0.6)',
            textAlign: 'right',
            fontSize: '0.7em',
            fontWeight: 'bold',
            backgroundColor: 'rgba(255,255,255,0.02)',

            '@media (min-width: 300px)': {
                margin: '0px 0px 7px',
            },
            '@media (min-width: 500px)': {
                margin: '0px 0px 15px',
                fontSize: '0.8em',
            },
            '@media (min-width: 800px)': {
                fontSize: '1.2em',
            }
        },
        menu: {
            backgroundColor: 'rgba(0,0,0,0.5)',
            color: 'rgba(255,255,255,0.6)',
            marginBottom: '2.7em',

            '@media (min-width: 300px)': {
                marginBottom: '3em',
            },
            '@media (min-width: 500px)': {
                marginBottom: '2.5em'
            },
        },
        menuItem: {

            '@media (min-width: 300px)': {
                padding: 1,
            },
            '@media (min-width: 500px)': {
                padding: '6px 16px',
            },
        }
    });

export default AnimationPlayerStyles;
