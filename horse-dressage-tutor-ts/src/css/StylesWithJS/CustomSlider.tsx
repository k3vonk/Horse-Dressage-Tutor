/**
 * Custom Slider is a function that creates a slider on top of the basic slider of MaterialUI
 *
 * @author: Ga Jun Young, 16440714
 */

import {withStyles} from "@material-ui/core";
import Slider from "@material-ui/core/Slider";

const CustomSlider = withStyles({
    root: {
        color: '#1699b9',
        height: 0,
    },
    marked: {
        marginBottom: 0,
        '@media (min-width:800px)': {
            marginBottom: 8,
        },
    },
    mark: {
        backgroundColor: '#e26e46',
        opacity: 1,
        height: 5,
    },
    markActive: {
        opacity: 1,
        backgroundColor: '#3dc2e2',
    },
    markLabel: {
        color: 'rgba(255,255,255,0.4)',
        display: 'none',
        '&[data-index="1"]': {
            color: '#ffffff'
        },
        '@media (min-width:800px)': {
            fontSize: '0.7rem',
            display: 'block',
        }
    },
    markLabelActive: {
      color: 'rgba(255,255,255,0.8)'
    },
    thumb: {
        height: 0,
        width: 0,
        marginTop: 0,
        marginLeft: 0,
        backgroundColor: 'rgba(81,187,213,0.4)',
        border: '0px solid currentColor',
        '&:focus, &:hover, &:active': {
            boxShadow: 'inherit',
        },
        '&:hover': {
            height: 14,
            width: 14,
            marginTop: -4.5,
            marginLeft: -8,
            backgroundColor: 'rgba(81,187,213,0.4)',
            border: '2px solid currentColor',
            '@media (min-width:900px)': {
                height: 24,
                width: 24,
                marginTop: -9,
                marginLeft: -12,
                border: '4px solid currentColor',
            },
        },
    },
    track: {
        height: 5,
    },
    rail: {
        height: 5,
        opacity: 1,
        backgroundColor: 'rgba(255,255,255,0.8)',
    }
})(Slider);

export default CustomSlider;
