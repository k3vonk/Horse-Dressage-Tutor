import {makeStyles} from "@material-ui/core/styles";
import {createStyles, Theme} from "@material-ui/core";

const AnimationControllerStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            position: 'absolute',
            width: '100%',
            top:'100vh',
            transform:'translateY(-100%)',
            background: 'rgba(0,0,0,0.5)',
        },
        h2: {
            color: '#ffffff',
            textAlign: "center",
        },
        h6: {
            textAlign: "center",
            color: '#ffffff',
            '@media (min-width:400px)': {
                fontSize: '0.9rem',
                marginTop: 12,
            },
            '@media (min-width: 600px)': {
                fontSize: '1.1rem',
                marginTop: 18
            },
            '@media (min-width: 1000px)': {
                paddingLeft: 15,
                paddingRight: 15,
            }
        },
        margin: {
            height: theme.spacing(3),
        },
        iconButton: {
            '&:focus, &:hover, &:active': {
                color: 'rgba(255,255,255,1)',
            },
            '&:focus, &:active': {
                border: '2px solid #1699b9',
            },
            marginTop: -18,
            borderRadius: 0,
            border: '2px solid transparent',
            color: 'rgba(255,255,255,0.6)',
            '@media (min-width:400px)': {
                marginTop: -20,
            },
        }
    }),
);


export default AnimationControllerStyles;
