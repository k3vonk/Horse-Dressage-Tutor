/**
 * Creates the CSS styles for the AnimationController page
 *
 * @author: Ga Jun Young
 */

import {createStyles} from "@material-ui/core";

const AnimationControllerStyles = () => createStyles({
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
        activeIconButton: {
            color: 'rgba(255,255,255,1)',
        },
        svg: {
            height: '20px',
            width: '20px',
        }
    });

export default AnimationControllerStyles;
