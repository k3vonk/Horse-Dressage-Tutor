import {withStyles} from "@material-ui/core";
import Slider from "@material-ui/core/Slider";

const CustomSlider = withStyles({
    root: {
        color: '#1699b9',
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
        '&[data-index="1"]': {
            color: '#ffffff'
        },
        '@media (min-width:400px)': {
            fontSize: '0rem',
        },
        '@media (min-width:800px)': {
            fontSize: '0.7rem',
        }
    },
    markLabelActive: {
      color: 'rgba(255,255,255,0.8)'
    },
    thumb: {
        height: 24,
        width: 24,
        backgroundColor: 'rgba(81,187,213,0.4)',
        border: '4px solid currentColor',
        marginTop: -9,
        marginLeft: -12,
        '&:focus, &:hover, &active': {
            boxShadow: 'inherit',
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
